package com.meubelpendawa.repository;

import com.meubelpendawa.model.Pengiriman;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PengirimanRepository extends JpaRepository<Pengiriman, String> {

    List<Pengiriman> findByDriver_IdKaryawan(String idKaryawan);

    boolean existsByTransaksi_OrderId(String orderId);

    Optional<Pengiriman> findByTransaksi_OrderId(String orderId);
}