package com.meubelpendawa.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.meubelpendawa.model.Transaksi;
import com.meubelpendawa.service.TransaksiService;

@RestController
@RequestMapping("/transaksi")
@CrossOrigin("*")
public class TransaksiController {

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

}