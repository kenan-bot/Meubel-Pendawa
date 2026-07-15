package com.meubelpendawa.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public List<Produk> searchProduk(String keyword) {
        return produkRepository.findByNamaProdukContainingIgnoreCase(keyword);
    }

    public List<Produk> getProdukByKategori(String idKategori) {
        return produkRepository.findByKategori_IdKategori(idKategori);
    }

    public List<Produk> getProdukByMerek(String idMerek) {
        return produkRepository.findByMerek_IdMerek(idMerek);
    }

    @Transactional
    public Produk simpanProduk(Produk produk) {

        Produk lastProduk = produkRepository.findFirstByOrderByIdProdukDesc();

        String lastId = lastProduk == null
                ? null
                : lastProduk.getIdProduk();

        produk.setIdProduk(
                idGeneratorService.generateNextId(lastId, "PRD"));

        if (produk.getNamaProduk() == null || produk.getNamaProduk().isBlank()) {
            throw new RuntimeException("Nama produk wajib diisi");
        }

        if (produk.getHargaDefault() == null || produk.getHargaDefault() <= 0) {
            throw new RuntimeException("Harga harus lebih dari 0");
        }

        if (produk.getStok() == null || produk.getStok() < 0) {
            throw new RuntimeException("Stok tidak boleh negatif");
        }

        //produk baru selalu aktif
        produk.setStatusAktif(true);

        return produkRepository.save(produk);
    }

    @Transactional
    public Produk updateProduk(Produk produk) {

        Produk existing = produkRepository.findById(produk.getIdProduk())
                .orElseThrow(() -> new RuntimeException("Produk tidak ditemukan"));

        if (produk.getNamaProduk() == null || produk.getNamaProduk().isBlank()) {
            throw new RuntimeException("Nama produk wajib diisi");
        }

        if (produk.getHargaDefault() == null || produk.getHargaDefault() <= 0) {
            throw new RuntimeException("Harga harus lebih dari 0");
        }

        if (produk.getStok() == null || produk.getStok() < 0) {
            throw new RuntimeException("Stok tidak boleh negatif");
        }

        existing.setNamaProduk(produk.getNamaProduk());
        existing.setHargaDefault(produk.getHargaDefault());
        existing.setStok(produk.getStok());
        existing.setDeskripsi(produk.getDeskripsi());
        existing.setGambarUrl(produk.getGambarUrl());
        existing.setKategori(produk.getKategori());
        existing.setMerek(produk.getMerek());

        //statusAktif sengaja tidak diubah di sini
        //karena perubahan status hanya melalui endpoint aktif/nonaktif

        return produkRepository.save(existing);
    }

    @Transactional
    public void hapusProduk(String idProduk) {
        produkRepository.deleteById(idProduk);
    }

    @Transactional
    public Produk aktifkanProduk(String idProduk) {

        Produk produk = produkRepository.findById(idProduk)
                .orElseThrow(() -> new RuntimeException("Produk tidak ditemukan"));

        produk.setStatusAktif(true);

        return produkRepository.save(produk);
    }

    @Transactional
    public Produk nonaktifkanProduk(String idProduk) {

        Produk produk = produkRepository.findById(idProduk)
                .orElseThrow(() -> new RuntimeException("Produk tidak ditemukan"));

        produk.setStatusAktif(false);

        return produkRepository.save(produk);
    }

}