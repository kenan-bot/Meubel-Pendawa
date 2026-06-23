package com.meubelpendawa.repository;

import com.meubelpendawa.model.DetailTransaksi;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DetailTransaksiRepository extends JpaRepository<DetailTransaksi, String> {
    List<DetailTransaksi> findByTransaksi_OrderId(String orderId);
}
