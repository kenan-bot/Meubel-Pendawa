package com.meubelpendawa.controller;

import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.meubelpendawa.model.Transaksi;
import com.meubelpendawa.service.StrukService;
import com.meubelpendawa.service.TransaksiService;
import com.midtrans.httpclient.error.MidtransError;

@RestController
@RequestMapping("/transaksi")
public class TransaksiController {

    private static final Logger log = LoggerFactory.getLogger(TransaksiController.class);

    @Autowired
    private TransaksiService transaksiService;

    @Autowired
    private StrukService strukService;

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

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Map<String, String>> batalkanTransaksi(@PathVariable String orderId) {
        try {
            transaksiService.batalkanTransaksi(orderId);
            return ResponseEntity.ok(Map.of("message", "Order " + orderId + " dibatalkan."));
        } catch (MidtransError e) {
            log.error("Gagal cek status Midtrans saat batalkan order {}: {}", orderId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("error", "Gagal terhubung ke Midtrans: " + e.getMessage()));
        } catch (Exception e) {
            log.error("Gagal membatalkan order {}: {}", orderId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage() != null ? e.getMessage() : "Gagal membatalkan order."));
        }
    }


    @PostMapping("/{orderId}/midtrans-token")
    public ResponseEntity<Map<String, Object>> buatSnapToken(@PathVariable String orderId) {
        try {
            return ResponseEntity.ok(transaksiService.buatSnapToken(orderId));
        } catch (MidtransError e) {
            log.error("Gagal buat Snap Token untuk order {}: {}", orderId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("error", "Gagal terhubung ke Midtrans: " + e.getMessage()));
        } catch (Exception e) {
            
            log.error("Gagal buat Snap Token untuk order {}: {}", orderId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage() != null ? e.getMessage() : "Terjadi kesalahan tak terduga."));
        }
    }


    @PostMapping("/{orderId}/cek-status")
    public ResponseEntity<Transaksi> cekStatusPembayaran(@PathVariable String orderId) {
        try {
            return ResponseEntity.ok(transaksiService.cekDanUpdateStatus(orderId));
        } catch (Exception e) {
            log.error("Gagal cek status pembayaran untuk order {}: {}", orderId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping(value = "/{orderId}/struk", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> cetakStruk(@PathVariable String orderId) {
        try {
            byte[] pdf = strukService.generateStrukPdf(orderId);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=Struk-" + orderId + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (Exception e) {
            log.error("Gagal membuat struk PDF untuk order {}: {}", orderId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{orderId}/struk/kirim-email")
    public ResponseEntity<Map<String, String>> kirimUlangStruk(@PathVariable String orderId) {
        try {
            strukService.kirimStrukEmail(orderId);
            return ResponseEntity.ok(Map.of("message", "Struk berhasil dikirim ke email."));
        } catch (Exception e) {
            log.error("Gagal kirim ulang struk untuk order {}: {}", orderId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage() != null ? e.getMessage() : "Gagal mengirim struk."));
        }
    }

    
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