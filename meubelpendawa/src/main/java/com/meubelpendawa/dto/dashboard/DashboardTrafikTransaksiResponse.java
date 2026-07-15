package com.meubelpendawa.dto.dashboard;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class DashboardTrafikTransaksiResponse {

    // Tanggal bucket
    private LocalDate tanggal;

    // Hari (Sen, Sel, Rab...)
    private String hari;

    // Interval waktu
    // Contoh : 07:00 - 09:00
    private String intervalJam;

    // Awal bucket
    private LocalDateTime waktu;

    // ==========================
    // DATA UTAMA (Y AXIS)
    // ==========================

    private Integer totalTransaksi;

    // ==========================
    // DATA TOOLTIP
    // ==========================

    private Double totalOmzet;

    private Double rataRataTransaksi;

    private Double totalCash;

    private Double totalCashless;

    // transaksi terakhir pada bucket
    private LocalDateTime transaksiTerakhir;

    public DashboardTrafikTransaksiResponse() {
    }

    public DashboardTrafikTransaksiResponse(
            LocalDate tanggal,
            String hari,
            String intervalJam,
            LocalDateTime waktu,
            Integer totalTransaksi,
            Double totalOmzet,
            Double rataRataTransaksi,
            Double totalCash,
            Double totalCashless,
            LocalDateTime transaksiTerakhir) {

        this.tanggal = tanggal;
        this.hari = hari;
        this.intervalJam = intervalJam;
        this.waktu = waktu;
        this.totalTransaksi = totalTransaksi;
        this.totalOmzet = totalOmzet;
        this.rataRataTransaksi = rataRataTransaksi;
        this.totalCash = totalCash;
        this.totalCashless = totalCashless;
        this.transaksiTerakhir = transaksiTerakhir;
    }

    public LocalDate getTanggal() {
        return tanggal;
    }

    public void setTanggal(LocalDate tanggal) {
        this.tanggal = tanggal;
    }

    public String getHari() {
        return hari;
    }

    public void setHari(String hari) {
        this.hari = hari;
    }

    public String getIntervalJam() {
        return intervalJam;
    }

    public void setIntervalJam(String intervalJam) {
        this.intervalJam = intervalJam;
    }

    public LocalDateTime getWaktu() {
        return waktu;
    }

    public void setWaktu(LocalDateTime waktu) {
        this.waktu = waktu;
    }

    public Integer getTotalTransaksi() {
        return totalTransaksi;
    }

    public void setTotalTransaksi(Integer totalTransaksi) {
        this.totalTransaksi = totalTransaksi;
    }

    public Double getTotalOmzet() {
        return totalOmzet;
    }

    public void setTotalOmzet(Double totalOmzet) {
        this.totalOmzet = totalOmzet;
    }

    public Double getRataRataTransaksi() {
        return rataRataTransaksi;
    }

    public void setRataRataTransaksi(Double rataRataTransaksi) {
        this.rataRataTransaksi = rataRataTransaksi;
    }

    public Double getTotalCash() {
        return totalCash;
    }

    public void setTotalCash(Double totalCash) {
        this.totalCash = totalCash;
    }

    public Double getTotalCashless() {
        return totalCashless;
    }

    public void setTotalCashless(Double totalCashless) {
        this.totalCashless = totalCashless;
    }

    public LocalDateTime getTransaksiTerakhir() {
        return transaksiTerakhir;
    }

    public void setTransaksiTerakhir(LocalDateTime transaksiTerakhir) {
        this.transaksiTerakhir = transaksiTerakhir;
    }
}