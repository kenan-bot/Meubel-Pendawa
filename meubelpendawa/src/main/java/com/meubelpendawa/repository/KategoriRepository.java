package com.meubelpendawa.repository;

import com.meubelpendawa.model.Kategori;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KategoriRepository extends JpaRepository<Kategori, String> {
    Kategori findFirstByOrderByIdKategoriDesc();
}