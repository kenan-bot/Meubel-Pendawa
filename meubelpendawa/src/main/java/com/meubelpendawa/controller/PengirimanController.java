package com.meubelpendawa.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.meubelpendawa.model.Pengiriman;
import com.meubelpendawa.service.PengirimanService;

@RestController
@RequestMapping("/pengiriman")
public class PengirimanController {

    @Autowired
    private PengirimanService pengirimanService;

    @GetMapping
    public List<Pengiriman> getAllPengiriman() {
        return pengirimanService.getAllPengiriman();
    }

    @GetMapping("/driver/{idKaryawan}")
    public List<Pengiriman> getPengirimanDriver(@PathVariable String idKaryawan) {
    return pengirimanService.getPengirimanByDriver(idKaryawan);
    }

    @PostMapping
    public Pengiriman tambahPengiriman(@RequestBody Pengiriman pengiriman) {
        return pengirimanService.simpanPengiriman(pengiriman);
    }

    @PutMapping
    public Pengiriman updatePengiriman(@RequestBody Pengiriman pengiriman) {
        return pengirimanService.updatePengiriman(pengiriman);
    }

    @DeleteMapping("/{id}")
    public void hapusPengiriman(@PathVariable String id) {
        pengirimanService.hapusPengiriman(id);
    }

    @PutMapping("/{idPengiriman}/status")
    public Pengiriman updateStatus(@PathVariable String idPengiriman,@RequestParam String status) {
    return pengirimanService.updateStatus(idPengiriman, status);
}


}
