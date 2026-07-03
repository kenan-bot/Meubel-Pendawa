package com.meubelpendawa.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.meubelpendawa.model.Transaksi;
import com.meubelpendawa.repository.TransaksiRepository;
import com.meubelpendawa.model.Pengiriman;
import com.meubelpendawa.repository.PengirimanRepository;
import com.midtrans.httpclient.error.MidtransError;
import com.midtrans.service.MidtransCoreApi;
import com.midtrans.service.MidtransSnapApi;
import java.time.format.DateTimeFormatter;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TransaksiService {

    @Autowired
    private TransaksiRepository transaksiRepository;

    @Autowired
    private IdGeneratorService idGeneratorService;

    @Autowired
    private PengirimanRepository pengirimanRepository;

    @Autowired
    private MidtransSnapApi midtransSnapApi;

    @Autowired
    private MidtransCoreApi midtransCoreApi;

    // Client Key & flag production TIDAK rahasia (Midtrans desainnya memang buat dipakai di browser),
    // jadi aman dikirim ke frontend lewat response ini -- frontend jadi tidak perlu simpan salinan
    // config-nya sendiri (misal lewat .env), cukup sekali sumber kebenaran di application.properties.
    @Value("${midtrans.client-key}")
    private String clientKey;

    @Value("${midtrans.is-production:false}")
    private boolean isProduction;

    public List<Transaksi> getAllTransaksi() {
        return transaksiRepository.findAll();
    }

    @Transactional
    public Transaksi simpanTransaksi(Transaksi transaksi) {

        String tanggal = LocalDate.now().format(DateTimeFormatter.ofPattern("yyMMdd"));
        String prefix = "ORD" + tanggal;
        long jumlahHariIni = transaksiRepository.countByOrderIdStartingWith(prefix);

        transaksi.setOrderId(idGeneratorService.generateOrderId(prefix, jumlahHariIni));
        transaksi.setTanggalTransaksi(LocalDateTime.now());

        transaksi.setTotalPesanan(0.0);
        transaksi.setKembalian(0.0);

        Transaksi transaksiTersimpan = transaksiRepository.save(transaksi);

        if ("DELIVERY".equalsIgnoreCase(transaksi.getMetodePengiriman())) {

            Pengiriman pengiriman = new Pengiriman();
            long nomorPengiriman = pengirimanRepository.count() + 1;
            pengiriman.setIdPengiriman(idGeneratorService.generatePengirimanId(nomorPengiriman));
            pengiriman.setTransaksi(transaksiTersimpan);
            pengiriman.setDriver(transaksi.getDriver());
            pengiriman.setStatusPengiriman("ON_PROCESS");
            pengirimanRepository.save(pengiriman);
        }

        return transaksiTersimpan;
    }

    public Transaksi prosesPembayaran(String orderId, Double jumlahBayar) {
        Transaksi transaksi = transaksiRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Transaksi tidak ditemukan"));
        if (jumlahBayar < transaksi.getTotalPesanan()) {
            throw new RuntimeException("Jumlah bayar kurang dari total pesanan");
        }
        transaksi.setJumlahBayar(jumlahBayar);
        transaksi.setKembalian(jumlahBayar - transaksi.getTotalPesanan());
        transaksi.setStatusPembayaran("SUCCESS"); // CASH: uang sudah di tangan kasir, langsung final

        return transaksiRepository.save(transaksi);

    }

    /**
     * Generate Snap Token untuk transaksi CASHLESS yang order-nya SUDAH dibuat & item-nya
     * sudah ditambahkan (jadi totalPesanan sudah final). Dipanggil frontend saat kasir klik
     * "Proses Pesanan" dan metode pembayarannya CASHLESS.
     */
    public Map<String, Object> buatSnapToken(String orderId) throws MidtransError {
        Transaksi transaksi = transaksiRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Transaksi tidak ditemukan"));

        if (transaksi.getTotalPesanan() == null || transaksi.getTotalPesanan() <= 0) {
            throw new RuntimeException("Total pesanan belum valid, tambahkan item dulu");
        }

        Map<String, Object> transactionDetails = new HashMap<>();
        transactionDetails.put("order_id", transaksi.getOrderId());
        // Midtrans butuh gross_amount bulat (tanpa desimal)
        transactionDetails.put("gross_amount", transaksi.getTotalPesanan().longValue());

        Map<String, Object> customerDetails = new HashMap<>();
        customerDetails.put("first_name", transaksi.getNamaPemesan());
        customerDetails.put("phone", transaksi.getNoWhatsapp());

        Map<String, Object> params = new HashMap<>();
        params.put("transaction_details", transactionDetails);
        params.put("customer_details", customerDetails);
        // Batasi cuma QRIS -- kalau tidak di-set, Snap nampilin SEMUA metode pembayaran
        // aktif di akun Midtrans (VA, kartu, dst), bukan cuma QRIS.
        params.put("enabled_payments", java.util.List.of("other_qris"));

        String token = midtransSnapApi.createTransactionToken(params);

        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("orderId", orderId);
        result.put("clientKey", clientKey);
        result.put("isProduction", isProduction);
        return result;
    }

    /**
     * Cek status transaksi ASLI ke Midtrans lalu update database sesuai hasilnya.
     * Dipanggil dari DUA tempat:
     *   1. Webhook POST /transaksi/notification (dari server Midtrans)
     *   2. Endpoint manual POST /transaksi/{orderId}/cek-status (dipanggil frontend
     *      begitu Snap kasih callback onSuccess/onPending -- berguna buat dev lokal
     *      yang belum setup ngrok, atau sebagai jaring pengaman kalau webhook telat)
     *
     * PENTING: sengaja TIDAK langsung percaya transaction_status dari body notifikasi
     * webhook ATAU dari callback Snap di frontend. Status selalu diambil ulang lewat
     * checkTransaction() ke server Midtrans, supaya tidak bisa dipalsukan pihak luar
     * (baik lewat POST palsu ke webhook, maupun manipulasi di sisi browser).
     */
    @Transactional
    public Transaksi cekDanUpdateStatus(String orderId) throws MidtransError {
        JSONObject statusResult = midtransCoreApi.checkTransaction(orderId);
        String transactionStatus = statusResult.getString("transaction_status");
        String fraudStatus = statusResult.optString("fraud_status", "accept");

        Transaksi transaksi = transaksiRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Transaksi tidak ditemukan"));

        if ("capture".equals(transactionStatus) || "settlement".equals(transactionStatus)) {
            if ("challenge".equals(fraudStatus)) {
                transaksi.setStatusPembayaran("CHALLENGE"); // butuh review manual di dashboard Midtrans
            } else {
                transaksi.setStatusPembayaran("SUCCESS");
                transaksi.setJumlahBayar(transaksi.getTotalPesanan());
                transaksi.setKembalian(0.0);
            }
        } else if ("cancel".equals(transactionStatus) || "deny".equals(transactionStatus)
                || "expire".equals(transactionStatus)) {
            transaksi.setStatusPembayaran("FAILED");
        } else if ("pending".equals(transactionStatus)) {
            transaksi.setStatusPembayaran("PENDING");
        }

        return transaksiRepository.save(transaksi);
    }

    public List<Transaksi> searchTransaksi(String keyword) {
        return transaksiRepository.findByNamaPemesanContainingIgnoreCaseOrOrderIdContainingIgnoreCase(keyword, keyword);
    }
}