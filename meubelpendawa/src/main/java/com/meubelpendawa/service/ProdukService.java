package com.meubelpendawa.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.meubelpendawa.model.Produk;
import com.meubelpendawa.repository.ProdukRepository;

@Service
public class ProdukService {

    @Autowired
    private ProdukRepository produkRepository;

    @Autowired
    private IdGeneratorService idGeneratorService;

    public List<Produk> getAllProduk() {
        return produkRepository.findAll();
    }

    public Produk simpanProduk(Produk produk) {

        long nomor = produkRepository.count() + 1;
        produk.setIdProduk(idGeneratorService.generateProdukId(nomor));

        if (produk.getStok() < 0) {
            throw new RuntimeException("Stok tidak boleh negatif");
        }
        
        if (produk.getHargaDefault() <= 0) {
            throw new RuntimeException("Harga harus lebih dari 0");
        }

        if (produk.getNamaProduk() == null || produk.getNamaProduk().isBlank()) {
            throw new RuntimeException("Nama produk wajib diisi");
        }

        return produkRepository.save(produk);
    }

    public Produk updateProduk(Produk produk) {

        if (produk.getStok() < 0) {
            throw new RuntimeException("Stok tidak boleh negatif");
        }
        
        if (produk.getHargaDefault() <= 0) {
            throw new RuntimeException("Harga harus lebih dari 0");
        }

        if (produk.getNamaProduk() == null || produk.getNamaProduk().isBlank()) {
            throw new RuntimeException("Nama produk wajib diisi");
        }
        
        return produkRepository.save(produk);
    }

    public void hapusProduk(String idProduk) {
        produkRepository.deleteById(idProduk);
    }

    public List<Produk> searchProduk(String keyword) {
        return produkRepository.findByNamaProdukContainingIgnoreCase(keyword);
    }

    public List<Produk> getProdukByKategori(String idKategori) {
        return produkRepository.findByKategori_IdKategori(idKategori);
    }

    public List<Produk> getProdukByMerek(String idMerek) {
        return produkRepository.findByMerek_IdMerek(idMerek);
    }

}
