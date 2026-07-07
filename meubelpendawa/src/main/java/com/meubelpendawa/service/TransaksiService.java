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
import com.meubelpendawa.model.DetailTransaksi;
import com.meubelpendawa.model.Produk;
import com.meubelpendawa.repository.DetailTransaksiRepository;
import com.meubelpendawa.repository.ProdukRepository;
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
    private DetailTransaksiRepository detailTransaksiRepository;

    @Autowired
    private ProdukRepository produkRepository;

    @Autowired
    private MidtransSnapApi midtransSnapApi;

    @Autowired
    private MidtransCoreApi midtransCoreApi;

    @Autowired
    private StrukService strukService;

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

        // [DIUBAH] Pengiriman TIDAK lagi dibuat di sini. Kalau dibuat sekarang, order
        // CASHLESS yang pembayarannya dibatalkan/gagal (X di QRIS, expired, dsb) akan
        // tetap punya row `pengiriman` walau uangnya belum pernah masuk -- makanya order
        // yang belum SUCCESS bisa "nyelip" muncul di Status Pengiriman & Laporan Harian.
        // Sekarang pembuatan Pengiriman dipindah ke titik saat statusPembayaran benar-benar
        // menjadi SUCCESS: lihat prosesPembayaran() (untuk CASH) dan cekDanUpdateStatus()
        // (untuk CASHLESS). Lihat juga buatPengirimanJikaBelumAda().

        return transaksiTersimpan;
    }

    /**
     * Buat row Pengiriman HANYA kalau: (1) metode pengirimannya DELIVERY, dan
     * (2) belum ada Pengiriman untuk order ini (idempotent -- aman dipanggil berkali-kali,
     * misalnya kalau cekDanUpdateStatus() sempat terpanggil lebih dari sekali untuk order
     * yang sama lewat webhook + pengecekan manual frontend).
     *
     * Dipanggil hanya SETELAH statusPembayaran benar-benar SUCCESS, supaya order yang
     * pembayarannya batal/gagal/masih pending tidak pernah masuk ke Status Pengiriman
     * ataupun ikut terhitung di Laporan Harian.
     */
    private void buatPengirimanJikaBelumAda(Transaksi transaksi) {
        if (!"DELIVERY".equalsIgnoreCase(transaksi.getMetodePengiriman())) {
            return;
        }
        if (pengirimanRepository.existsByTransaksi_OrderId(transaksi.getOrderId())) {
            return;
        }

        Pengiriman pengiriman = new Pengiriman();
        long nomorPengiriman = pengirimanRepository.count() + 1;
        pengiriman.setIdPengiriman(idGeneratorService.generatePengirimanId(nomorPengiriman));
        pengiriman.setTransaksi(transaksi);
        pengiriman.setDriver(transaksi.getDriver());
        pengiriman.setStatusPengiriman("ON_PROCESS");
        pengirimanRepository.save(pengiriman);
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

        Transaksi tersimpan = transaksiRepository.save(transaksi);

        // [DIUBAH] Baru buat Pengiriman di sini, setelah statusPembayaran dipastikan SUCCESS.
        buatPengirimanJikaBelumAda(tersimpan);

        // [BARU] Order CASH sudah final di titik ini -> langsung kirim struk ke email toko.
        strukService.kirimStrukEmail(tersimpan.getOrderId());

        return tersimpan;

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

        // Simpan status SEBELUM diupdate -- dipakai di bawah supaya struk tidak terkirim
        // dobel kalau method ini kepanggil berkali-kali untuk order yang sama (webhook
        // Midtrans + pengecekan manual dari frontend keduanya bisa memicu ini).
        String statusSebelumnya = transaksi.getStatusPembayaran();

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

        Transaksi tersimpan = transaksiRepository.save(transaksi);

        // [BARU] Order CASHLESS baru final kalau statusnya sudah SUCCESS (settlement/capture
        // tanpa challenge) -- kirim struk ke email toko di titik ini, bukan di status lain
        // (PENDING/FAILED/CHALLENGE). Guard "belum SUCCESS sebelumnya" mencegah struk terkirim
        // dobel kalau webhook & pengecekan manual dari frontend sama-sama memanggil method ini.
        if ("SUCCESS".equals(tersimpan.getStatusPembayaran()) && !"SUCCESS".equals(statusSebelumnya)) {
            // [DIUBAH] Baru sekarang Pengiriman dibuat -- order CASHLESS yang tadinya
            // dibatalkan/gagal/expired tidak pernah sampai ke titik ini, jadi tidak pernah
            // dapat row Pengiriman dan otomatis tidak akan muncul di Status Pengiriman.
            buatPengirimanJikaBelumAda(tersimpan);
            strukService.kirimStrukEmail(tersimpan.getOrderId());
        }

        return tersimpan;
    }

    public List<Transaksi> searchTransaksi(String keyword) {
        return transaksiRepository.findByNamaPemesanContainingIgnoreCaseOrOrderIdContainingIgnoreCase(keyword, keyword);
    }

    /**
     * Batalkan order yang belum/gagal dibayar -- dipanggil frontend saat customer nutup
     * popup QRIS (Snap onClose/onError) tanpa menyelesaikan pembayaran.
     *
     * Order & seluruh DetailTransaksi-nya DIHAPUS PERMANEN dari database (bukan cuma
     * ditandai FAILED), dan stok produk yang sempat dikurangi saat item ditambahkan ke
     * keranjang DIKEMBALIKAN. Jadi order yang batal benar-benar tidak nyisa jejak apapun.
     *
     * PENTING -- jaring pengaman race condition: event "ditutup" dari browser TIDAK selalu
     * berarti pembayaran gagal (bisa saja customer sudah keburu bayar sebelum sempat nutup
     * tab). Makanya untuk CASHLESS, status ASLI dicek ulang ke Midtrans dulu sebelum hapus:
     * kalau ternyata sudah settlement/capture, order TIDAK dihapus -- malah disinkronkan
     * jadi SUCCESS lewat cekDanUpdateStatus(), supaya order & uangnya tetap tercatat.
     */
    @Transactional
    public void batalkanTransaksi(String orderId) throws MidtransError {
        Transaksi transaksi = transaksiRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Transaksi tidak ditemukan"));

        if ("SUCCESS".equals(transaksi.getStatusPembayaran())) {
            throw new RuntimeException("Transaksi sudah berhasil dibayar, tidak bisa dibatalkan");
        }

        if ("CASHLESS".equalsIgnoreCase(transaksi.getMetodePembayaran())) {
            boolean sudahTerlanjurBayar = false;
            try {
                JSONObject statusResult = midtransCoreApi.checkTransaction(orderId);
                String status = statusResult.getString("transaction_status");
                sudahTerlanjurBayar = "capture".equals(status) || "settlement".equals(status);
            } catch (MidtransError e) {
                // Midtrans belum punya catatan transaksi ini sama sekali (mis. customer nutup
                // sebelum sempat memilih metode QRIS) -- aman dilanjutkan untuk dihapus.
                sudahTerlanjurBayar = false;
            }

            if (sudahTerlanjurBayar) {
                // Ternyata sudah bayar -- JANGAN dihapus, sinkronkan saja statusnya. Sengaja
                // dipanggil DI LUAR try-catch di atas: kalau checkTransaction kedua di dalam
                // cekDanUpdateStatus() ini gagal/timeout, errornya harus tetap dilempar apa
                // adanya (bukan tertelan dan dianggap "aman dihapus" oleh catch di atas).
                cekDanUpdateStatus(orderId);
                throw new RuntimeException(
                        "Pembayaran ternyata sudah berhasil sebelum dibatalkan, order tetap disimpan");
            }
        }

        // Kembalikan stok tiap item SEBELUM baris detail-nya dihapus.
        List<DetailTransaksi> items = detailTransaksiRepository.findByTransaksi_OrderId(orderId);
        for (DetailTransaksi item : items) {
            Produk produk = item.getProduk();
            if (produk != null) {
                produk.setStok(produk.getStok() + item.getQty());
                produkRepository.save(produk);
            }
        }
        detailTransaksiRepository.deleteAll(items);

        // Pengiriman seharusnya belum pernah dibuat untuk order yang belum SUCCESS (lihat
        // buatPengirimanJikaBelumAda()), tapi dicek juga untuk jaga-jaga.
        if (pengirimanRepository.existsByTransaksi_OrderId(orderId)) {
            pengirimanRepository.findAll().stream()
                    .filter(p -> orderId.equals(p.getTransaksi() != null ? p.getTransaksi().getOrderId() : null))
                    .forEach(p -> pengirimanRepository.deleteById(p.getIdPengiriman()));
        }

        transaksiRepository.delete(transaksi);
    }
}