package com.meubelpendawa.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DetailLaporanHarianDTO {

    // Data Tabel Laporan Harian

    private Integer no;

    private String orderId;

    private LocalDateTime tanggalTransaksi;

    private String namaPemesan;

    private String metodePembayaran;

    private String metodePengiriman;

    private BigDecimal totalPesanan;

    public DetailLaporanHarianDTO() {
    }

    public DetailLaporanHarianDTO(
            Integer no,
            String orderId,
            LocalDateTime tanggalTransaksi,
            String namaPemesan,
            String metodePembayaran,
            String metodePengiriman,
            BigDecimal totalPesanan) {

        this.no = no;
        this.orderId = orderId;
        this.tanggalTransaksi = tanggalTransaksi;
        this.namaPemesan = namaPemesan;
        this.metodePembayaran = metodePembayaran;
        this.metodePengiriman = metodePengiriman;
        this.totalPesanan = totalPesanan;
    }

    public Integer getNo() {
        return no;
    }

    public void setNo(Integer no) {
        this.no = no;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public LocalDateTime getTanggalTransaksi() {
        return tanggalTransaksi;
    }

    public void setTanggalTransaksi(LocalDateTime tanggalTransaksi) {
        this.tanggalTransaksi = tanggalTransaksi;
    }

    public String getNamaPemesan() {
        return namaPemesan;
    }

    public void setNamaPemesan(String namaPemesan) {
        this.namaPemesan = namaPemesan;
    }

    public String getMetodePembayaran() {
        return metodePembayaran;
    }

    public void setMetodePembayaran(String metodePembayaran) {
        this.metodePembayaran = metodePembayaran;
    }

    public String getMetodePengiriman() {
        return metodePengiriman;
    }

    public void setMetodePengiriman(String metodePengiriman) {
        this.metodePengiriman = metodePengiriman;
    }

    public BigDecimal getTotalPesanan() {
        return totalPesanan;
    }

    public void setTotalPesanan(BigDecimal totalPesanan) {
        this.totalPesanan = totalPesanan;
    }
}