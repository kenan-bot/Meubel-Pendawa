package com.meubelpendawa.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.meubelpendawa.model.Kategori;
import com.meubelpendawa.service.KategoriService;


@RestController
@RequestMapping("/kategori")
@CrossOrigin("*")
public class KategoriController {

    @Autowired
    private KategoriService kategoriService;

    @GetMapping
    public List<Kategori> getAllKategori() {
        return kategoriService.getAllKategori();
    }

    @PostMapping
    public Kategori tambahKategori(@RequestBody Kategori kategori) {
        return kategoriService.simpanKategori(kategori);
    }

    @PutMapping
    public Kategori updateKategori(@RequestBody Kategori kategori) {
        return kategoriService.updateKategori(kategori);
    }

    @DeleteMapping("/{id}")
    public void hapusKategori(@PathVariable String id) {
        kategoriService.hapusKategori(id);
    }
}
