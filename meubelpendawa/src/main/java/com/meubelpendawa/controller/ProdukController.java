package com.meubelpendawa.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.meubelpendawa.model.Produk;
import com.meubelpendawa.service.ProdukService;


@RestController
@RequestMapping("/produk")
public class ProdukController {

    @Autowired
    private ProdukService produkService;

    @GetMapping
    public List<Produk> getAllProduk() {
        return produkService.getAllProduk();
    }

    @GetMapping("/search")
    public List<Produk> searchProduk(@RequestParam String keyword) {
        return produkService.searchProduk(keyword);
    }

    @GetMapping("/kategori/{idKategori}")
    public List<Produk> getProdukByKategori(@PathVariable String idKategori) {
        return produkService.getProdukByKategori(idKategori);
    }
    
    @GetMapping("/merek/{idMerek}")
    public List<Produk> getProdukByMerek(@PathVariable String idMerek) {
        return produkService.getProdukByMerek(idMerek);
    }

    @PostMapping
    public Produk tambahProduk(@RequestBody Produk produk) {
        return produkService.simpanProduk(produk);
    }

    @PutMapping
    public Produk updateProduk(@RequestBody Produk produk) {
        return produkService.updateProduk(produk);
    }

    @DeleteMapping("/{id}")
    public void hapusProduk(@PathVariable String id) {
        produkService.hapusProduk(id);
    }
    
}
