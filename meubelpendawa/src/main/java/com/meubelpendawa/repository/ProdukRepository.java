package com.meubelpendawa.repository;

import com.meubelpendawa.model.Produk;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProdukRepository extends JpaRepository<Produk, String> {

    List<Produk> findByNamaProdukContainingIgnoreCase(String keyword);

    List<Produk> findByKategori_IdKategori(String idKategori);

    List<Produk> findByMerek_IdMerek(String idMerek);

    boolean existsByKategori_IdKategori(String idKategori);

    Long countByKategori_IdKategori(String idKategori);

    boolean existsByMerek_IdMerek(String idMerek);

    Long countByMerek_IdMerek(String idMerek);

    Produk findFirstByOrderByIdProdukDesc();
}