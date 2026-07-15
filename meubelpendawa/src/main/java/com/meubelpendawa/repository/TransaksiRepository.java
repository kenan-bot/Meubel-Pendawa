package com.meubelpendawa.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.meubelpendawa.model.Transaksi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TransaksiRepository extends JpaRepository<Transaksi, String> {

    Optional<Transaksi> findTopByOrderByOrderIdDesc();

    List<Transaksi> findTop5ByStatusPembayaranOrderByTanggalTransaksiDesc(
            String statusPembayaran);

    long countByMetodePengirimanIgnoreCase(String metodePengiriman);

    long countByMetodePengirimanAndStatusPembayaran(
            String metodePengiriman,
            String statusPembayaran);

    List<Transaksi> findByStatusPembayaran(String statusPembayaran);

    List<Transaksi> findByNamaPemesanContainingIgnoreCaseOrOrderIdContainingIgnoreCase(
            String namaPemesan,
            String orderId);

    long countByOrderIdStartingWith(String prefix);

    List<Transaksi> findByTanggalTransaksiBetweenAndStatusPembayaran(
            LocalDateTime awal,
            LocalDateTime akhir,
            String statusPembayaran);

    Transaksi findFirstByOrderIdStartingWithOrderByOrderIdDesc(String prefix);

    // kpi laporan penjualan

    @Query("""
            SELECT COALESCE(SUM(t.totalPesanan), 0)
            FROM Transaksi t
            WHERE t.statusPembayaran = 'SUCCESS'
            """)
    Double getTotalOmzet();

    @Query("""
            SELECT COUNT(t)
            FROM Transaksi t
            WHERE t.statusPembayaran = 'SUCCESS'
            """)
    Long getTotalTransaksi();

    @Query("""
            SELECT COALESCE(AVG(t.totalPesanan), 0)
            FROM Transaksi t
            WHERE t.statusPembayaran = 'SUCCESS'
            """)
    Double getRataRataPembelian();

    // filter tanggal

    @Query("""
            SELECT COALESCE(SUM(t.totalPesanan), 0)
            FROM Transaksi t
            WHERE t.statusPembayaran = 'SUCCESS'
            AND t.tanggalTransaksi BETWEEN :startDate AND :endDate
            """)
    Double getTotalOmzetByPeriode(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("""
            SELECT COUNT(t)
            FROM Transaksi t
            WHERE t.statusPembayaran = 'SUCCESS'
            AND t.tanggalTransaksi BETWEEN :startDate AND :endDate
            """)
    Long getTotalTransaksiByPeriode(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("""
            SELECT COALESCE(AVG(t.totalPesanan), 0)
            FROM Transaksi t
            WHERE t.statusPembayaran = 'SUCCESS'
            AND t.tanggalTransaksi BETWEEN :startDate AND :endDate
            """)
    Double getRataRataPembelianByPeriode(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // metode pembayaran

    @Query("""
                SELECT COALESCE(SUM(t.totalPesanan),0)
                FROM Transaksi t
                WHERE t.statusPembayaran='SUCCESS'
                AND UPPER(t.metodePembayaran)='CASH'
            """)
    Double getTotalCash();

    @Query("""
                SELECT COALESCE(SUM(t.totalPesanan),0)
                FROM Transaksi t
                WHERE t.statusPembayaran='SUCCESS'
                AND UPPER(t.metodePembayaran) <> 'CASH'
            """)
    Double getTotalCashless();

    @Query("""
                SELECT COALESCE(SUM(t.totalPesanan),0)
                FROM Transaksi t
                WHERE t.statusPembayaran='SUCCESS'
                AND UPPER(t.metodePembayaran)='CASH'
                AND t.tanggalTransaksi BETWEEN :startDate AND :endDate
            """)
    Double getTotalCashByPeriode(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("""
                SELECT COALESCE(SUM(t.totalPesanan),0)
                FROM Transaksi t
                WHERE t.statusPembayaran='SUCCESS'
                AND UPPER(t.metodePembayaran) <> 'CASH'
                AND t.tanggalTransaksi BETWEEN :startDate AND :endDate
            """)
    Double getTotalCashlessByPeriode(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("""
            SELECT t
            FROM Transaksi t
            WHERE t.statusPembayaran = 'SUCCESS'
            AND t.tanggalTransaksi BETWEEN :startDate AND :endDate
            ORDER BY t.tanggalTransaksi DESC
            """)
    List<Transaksi> getDetailPenjualanByPeriode(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("""
            SELECT t
            FROM Transaksi t
            WHERE t.statusPembayaran = 'SUCCESS'
            AND t.tanggalTransaksi BETWEEN :startDate AND :endDate
            ORDER BY t.tanggalTransaksi ASC
            """)
    List<Transaksi> getTrenPenjualanByPeriode(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("""
                SELECT t
                FROM Transaksi t
                WHERE t.statusPembayaran = 'SUCCESS'
                AND t.tanggalTransaksi BETWEEN :startDate AND :endDate
                ORDER BY t.tanggalTransaksi ASC
            """)
    List<Transaksi> getTrafikTransaksi(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("""
            SELECT COUNT(t)
            FROM Transaksi t
            WHERE t.statusPembayaran = 'SUCCESS'
            AND t.tanggalTransaksi BETWEEN :startDate AND :endDate
            """)
    Long countTransaksiBerhasil(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}