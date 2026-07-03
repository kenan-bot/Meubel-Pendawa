package com.meubelpendawa.controller;

import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.meubelpendawa.model.Transaksi;
import com.meubelpendawa.service.TransaksiService;
import com.midtrans.httpclient.error.MidtransError;

@RestController
@RequestMapping("/transaksi")
@CrossOrigin("*")
public class TransaksiController {

    private static final Logger log = LoggerFactory.getLogger(TransaksiController.class);

    @Autowired
    private TransaksiService transaksiService;

    @GetMapping
    public List<Transaksi> getAllTransaksi() {
        return transaksiService.getAllTransaksi();
    }
    
    @GetMapping("/search")
    public List<Transaksi> searchTransaksi(@RequestParam String keyword) {
        return transaksiService.searchTransaksi(keyword);
    }

    @PostMapping
    public Transaksi tambahTransaksi(@RequestBody Transaksi transaksi) {
        return transaksiService.simpanTransaksi(transaksi);
    }

    @PutMapping("/{orderId}/bayar")
    public Transaksi prosesPembayaran(@PathVariable String orderId, @RequestParam Double jumlahBayar) {
        return transaksiService.prosesPembayaran(orderId, jumlahBayar);
    }

    // [BARU] Frontend panggil ini saat kasir confirm "Proses Pesanan" untuk metode CASHLESS.
    // Return Snap Token yang dipakai frontend untuk buka window.snap.pay(token).
    @PostMapping("/{orderId}/midtrans-token")
    public ResponseEntity<Map<String, Object>> buatSnapToken(@PathVariable String orderId) {
        try {
            return ResponseEntity.ok(transaksiService.buatSnapToken(orderId));
        } catch (MidtransError e) {
            log.error("Gagal buat Snap Token untuk order {}: {}", orderId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("error", "Gagal terhubung ke Midtrans: " + e.getMessage()));
        } catch (Exception e) {
            // Penting: tanpa ini, exception selain MidtransError (mis. transaksi tidak
            // ditemukan, total belum valid, dll) lolos ke default error handler Spring
            // dan cuma tampil "Internal Server Error" generik di frontend -- gak kelihatan
            // penyebab aslinya tanpa buka log server.
            log.error("Gagal buat Snap Token untuk order {}: {}", orderId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage() != null ? e.getMessage() : "Terjadi kesalahan tak terduga."));
        }
    }

    // [BARU] Cek status manual -- dipanggil FRONTEND (bukan server Midtrans) begitu Snap
    // kasih callback onSuccess/onPending. Manfaatnya dua: (1) dev lokal jadi gak wajib
    // pakai ngrok/tunnel buat testing, (2) di production jadi jaring pengaman tambahan
    // kalau webhook telat/gagal terkirim -- status tetap ke-update tanpa nunggu webhook.
    // Reuse logic yang sama persis dengan webhook (sama-sama nanya status ASLI ke Midtrans,
    // bukan percaya begitu saja ke frontend).
    @PostMapping("/{orderId}/cek-status")
    public ResponseEntity<Transaksi> cekStatusPembayaran(@PathVariable String orderId) {
        try {
            return ResponseEntity.ok(transaksiService.cekDanUpdateStatus(orderId));
        } catch (Exception e) {
            log.error("Gagal cek status pembayaran untuk order {}: {}", orderId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // [BARU] Webhook -- dipanggil SERVER Midtrans (bukan browser user), daftarkan URL publik
    // endpoint ini di Dashboard Midtrans > Settings > Configuration > Payment Notification URL.
    // Selalu balas 200 OK supaya Midtrans tidak retry-kirim notifikasi berkali-kali.
    @PostMapping("/notification")
    public ResponseEntity<String> notifikasiMidtrans(@RequestBody Map<String, Object> payload) {
        String orderId = (String) payload.get("order_id");
        try {
            transaksiService.cekDanUpdateStatus(orderId);
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            // tetap 200 -- kalau balas error, Midtrans anggap gagal terkirim & akan retry terus
            return ResponseEntity.ok("Notification diterima, tapi gagal diproses: " + e.getMessage());
        }
    }

}