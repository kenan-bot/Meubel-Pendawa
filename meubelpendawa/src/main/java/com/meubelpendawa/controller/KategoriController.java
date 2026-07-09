package com.meubelpendawa.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.meubelpendawa.model.Kategori;
import com.meubelpendawa.service.KategoriService;
import com.meubelpendawa.repository.ProdukRepository;
import java.util.Map;

@RestController
@RequestMapping("/kategori")
public class KategoriController {

    @Autowired
    private KategoriService kategoriService;

    @Autowired
    private ProdukRepository produkRepository;

    @GetMapping
    public List<Kategori> getAllKategori() {
        return kategoriService.getAllKategori();
    }

    @GetMapping("/{idKategori}/is-used")
    public Map<String, Boolean> isUsed(@PathVariable String idKategori) {

        boolean used = produkRepository.existsByKategori_IdKategori(idKategori);

        System.out.println("ID KATEGORI = " + idKategori);
        System.out.println("USED = " + used);

        return Map.of("used", used);
    }

    @GetMapping("/{idKategori}/usage-count")
    public Long getUsageCount(
            @PathVariable String idKategori) {

        return produkRepository.countByKategori_IdKategori(idKategori);
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
