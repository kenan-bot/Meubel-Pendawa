package com.meubelpendawa.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.meubelpendawa.model.Transaksi;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransaksiRepository extends JpaRepository<Transaksi, String> {

    Optional<Transaksi> findTopByOrderByOrderIdDesc();

    List<Transaksi> findByNamaPemesanContainingIgnoreCaseOrOrderIdContainingIgnoreCase(
            String namaPemesan,
            String orderId);

    long countByOrderIdStartingWith(String prefix);

    List<Transaksi> findByTanggalTransaksiBetweenAndStatusPembayaran(
            LocalDateTime awal,
            LocalDateTime akhir,
            String statusPembayaran
    );

}