package com.meubelpendawa.repository;

import com.meubelpendawa.model.DetailTransaksi;
import com.meubelpendawa.model.Transaksi;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface DetailTransaksiRepository extends JpaRepository<DetailTransaksi, String> {

    List<DetailTransaksi> findByTransaksi_OrderId(String orderId);

    List<DetailTransaksi> findByTransaksiIn(List<Transaksi> transaksi);

    DetailTransaksi findFirstByOrderByIdDetailTransaksiDesc();

    // KPI LAPORAN PENJUALAN

    @Query("""
            SELECT COALESCE(SUM(d.qty), 0)
            FROM DetailTransaksi d
            WHERE d.transaksi.statusPembayaran = 'SUCCESS'
            """)
    Long getTotalProdukTerjual();

    @Query("""
            SELECT COALESCE(SUM(d.qty), 0)
            FROM DetailTransaksi d
            WHERE d.transaksi.statusPembayaran = 'SUCCESS'
            AND d.transaksi.tanggalTransaksi BETWEEN :startDate AND :endDate
            """)
    Long getTotalProdukTerjualByPeriode(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("""
            SELECT d.produk.namaProduk,
                   SUM(d.qty)
            FROM DetailTransaksi d
            WHERE d.transaksi.statusPembayaran = 'SUCCESS'
            AND d.transaksi.tanggalTransaksi BETWEEN :startDate AND :endDate
            GROUP BY d.produk.namaProduk
            ORDER BY SUM(d.qty) DESC
            """)
    List<Object[]> getKontribusiProduk(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}