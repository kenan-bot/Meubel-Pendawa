package com.meubelpendawa.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.meubelpendawa.model.Kategori;
import com.meubelpendawa.repository.KategoriRepository;

@Service
public class KategoriService {

    @Autowired
    private KategoriRepository kategoriRepository;

    @Autowired
    private IdGeneratorService idGeneratorService;

    public List<Kategori> getAllKategori() {
        return kategoriRepository.findAll();
    }

    public Kategori simpanKategori(Kategori kategori) {

        long nomor = kategoriRepository.count() + 1;
        kategori.setIdKategori(idGeneratorService.generateKategoriId(nomor));
        return kategoriRepository.save(kategori);
    }

    public Kategori updateKategori(Kategori kategori) {

        Kategori existing = kategoriRepository.findById(kategori.getIdKategori())
                .orElseThrow(() -> new RuntimeException("Kategori tidak ditemukan"));

        existing.setNamaKategori(kategori.getNamaKategori());

        return kategoriRepository.save(existing);
    }

    public void hapusKategori(String idKategori) {
        kategoriRepository.deleteById(idKategori);
    }

}
