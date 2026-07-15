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
import java.time.ZoneId;

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

    @Value("${midtrans.client-key}")
    private String clientKey;

    @Value("${midtrans.is-production:false}")
    private boolean isProduction;

    public List<Transaksi> getAllTransaksi() {
        return transaksiRepository.findAll();
    }

    @Transactional
    public Transaksi simpanTransaksi(Transaksi transaksi) {

        String tanggal = LocalDate.now()
                .format(DateTimeFormatter.ofPattern("yyMMdd"));

        String prefix = "ORD" + tanggal;

        Transaksi lastTransaksi = transaksiRepository.findFirstByOrderIdStartingWithOrderByOrderIdDesc(prefix);

        String lastOrderId = lastTransaksi == null
                ? null
                : lastTransaksi.getOrderId();

        transaksi.setOrderId(
                idGeneratorService.generateNextOrderId(prefix, lastOrderId));

        transaksi.setTanggalTransaksi(
                LocalDateTime.now(ZoneId.of("Asia/Jakarta")));

        transaksi.setTotalPesanan(0.0);
        transaksi.setKembalian(0.0);

        return transaksiRepository.save(transaksi);
    }

    private void buatPengirimanJikaBelumAda(Transaksi transaksi) {
        if (!"DELIVERY".equalsIgnoreCase(transaksi.getMetodePengiriman())) {
            return;
        }
        if (pengirimanRepository.existsByTransaksi_OrderId(transaksi.getOrderId())) {
            return;
        }

        Pengiriman pengiriman = new Pengiriman();
        Pengiriman lastPengiriman = pengirimanRepository.findFirstByOrderByIdPengirimanDesc();

        String lastId = lastPengiriman == null
                ? null
                : lastPengiriman.getIdPengiriman();

        pengiriman.setIdPengiriman(
                idGeneratorService.generateNextId(lastId, "PNG"));
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

        List<DetailTransaksi> items = detailTransaksiRepository.findByTransaksi_OrderId(orderId);

        for (DetailTransaksi item : items) {

            Produk produk = item.getProduk();

            if (produk.getStok() < item.getQty()) {
                throw new RuntimeException(
                        "Stok " + produk.getNamaProduk() + " tidak mencukupi");
            }

            produk.setStok(produk.getStok() - item.getQty());

            produkRepository.save(produk);
        }

        Transaksi tersimpan = transaksiRepository.save(transaksi);

        buatPengirimanJikaBelumAda(tersimpan);

        strukService.kirimStrukEmail(tersimpan.getOrderId());

        return tersimpan;

    }

    public Map<String, Object> buatSnapToken(String orderId) throws MidtransError {
        Transaksi transaksi = transaksiRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Transaksi tidak ditemukan"));

        if (transaksi.getTotalPesanan() == null || transaksi.getTotalPesanan() <= 0) {
            throw new RuntimeException("Total pesanan belum valid, tambahkan item dulu");
        }

        Map<String, Object> transactionDetails = new HashMap<>();
        transactionDetails.put("order_id", transaksi.getOrderId());
        //midtrans butuh gross_amount bulat (tanpa desimal)
        transactionDetails.put("gross_amount", transaksi.getTotalPesanan().longValue());

        Map<String, Object> customerDetails = new HashMap<>();
        customerDetails.put("first_name", transaksi.getNamaPemesan());
        customerDetails.put("phone", transaksi.getNoWhatsapp());

        Map<String, Object> params = new HashMap<>();
        params.put("transaction_details", transactionDetails);
        params.put("customer_details", customerDetails);
        
        params.put("enabled_payments", java.util.List.of("other_qris"));

        String token = midtransSnapApi.createTransactionToken(params);

        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("orderId", orderId);
        result.put("clientKey", clientKey);
        result.put("isProduction", isProduction);
        return result;
    }

    @Transactional
    public Transaksi cekDanUpdateStatus(String orderId) throws MidtransError {
        JSONObject statusResult = midtransCoreApi.checkTransaction(orderId);
        String transactionStatus = statusResult.getString("transaction_status");
        String fraudStatus = statusResult.optString("fraud_status", "accept");

        Transaksi transaksi = transaksiRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Transaksi tidak ditemukan"));

        String statusSebelumnya = transaksi.getStatusPembayaran();

        if ("capture".equals(transactionStatus) || "settlement".equals(transactionStatus)) {
            if ("challenge".equals(fraudStatus)) {
                transaksi.setStatusPembayaran("CHALLENGE"); // butuh review manual di dashboard Midtrans
            } else {
                transaksi.setStatusPembayaran("SUCCESS");
                transaksi.setJumlahBayar(transaksi.getTotalPesanan());
                transaksi.setKembalian(0.0);

                List<DetailTransaksi> items = detailTransaksiRepository.findByTransaksi_OrderId(orderId);

                for (DetailTransaksi item : items) {

                    Produk produk = item.getProduk();

                    if (produk.getStok() < item.getQty()) {
                        throw new RuntimeException(
                                "Stok " + produk.getNamaProduk() + " tidak mencukupi");
                    }

                    produk.setStok(produk.getStok() - item.getQty());

                    produkRepository.save(produk);
                }
            }
        } else if ("cancel".equals(transactionStatus) || "deny".equals(transactionStatus)
                || "expire".equals(transactionStatus)) {
            transaksi.setStatusPembayaran("FAILED");
        } else if ("pending".equals(transactionStatus)) {
            transaksi.setStatusPembayaran("PENDING");
        }

        Transaksi tersimpan = transaksiRepository.save(transaksi);

        if ("SUCCESS".equals(tersimpan.getStatusPembayaran()) && !"SUCCESS".equals(statusSebelumnya)) {

            buatPengirimanJikaBelumAda(tersimpan);
            strukService.kirimStrukEmail(tersimpan.getOrderId());
        }

        return tersimpan;
    }

    public List<Transaksi> searchTransaksi(String keyword) {
        return transaksiRepository.findByNamaPemesanContainingIgnoreCaseOrOrderIdContainingIgnoreCase(keyword, keyword);
    }

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

                sudahTerlanjurBayar = false;
            }

            if (sudahTerlanjurBayar) {

                cekDanUpdateStatus(orderId);
                throw new RuntimeException(
                        "Pembayaran ternyata sudah berhasil sebelum dibatalkan, order tetap disimpan");
            }
        }

        List<DetailTransaksi> items = detailTransaksiRepository.findByTransaksi_OrderId(orderId);
        
        detailTransaksiRepository.deleteAll(items);

        if (pengirimanRepository.existsByTransaksi_OrderId(orderId)) {
            pengirimanRepository.findAll().stream()
                    .filter(p -> orderId.equals(p.getTransaksi() != null ? p.getTransaksi().getOrderId() : null))
                    .forEach(p -> pengirimanRepository.deleteById(p.getIdPengiriman()));
        }

        transaksiRepository.delete(transaksi);
    }
}