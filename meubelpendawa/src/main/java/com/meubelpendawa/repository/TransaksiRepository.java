package com.meubelpendawa.repository;

import java.util.Optional;
import java.util.List;
import com.meubelpendawa.model.Transaksi;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransaksiRepository extends JpaRepository<Transaksi, String> {
    Optional<Transaksi> findTopByOrderByOrderIdDesc();
    List<Transaksi> findByNamaPemesanContainingIgnoreCaseOrOrderIdContainingIgnoreCase(String namaPemesan, String orderId);
}