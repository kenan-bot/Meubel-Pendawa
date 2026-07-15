package com.meubelpendawa.dto.dashboard;

public class DashboardTrafikSummaryResponse {

    // ==========================
    // KPI UTAMA
    // ==========================

    // Total transaksi selama 7 hari
    private Integer totalTransaksi;

    // Total omzet selama 7 hari
    private Double totalOmzet;

    // Persentase pertumbuhan dibanding 7 hari sebelumnya
    private Double persentasePertumbuhan;

    // ==========================
    // PEAK HOUR
    // ==========================

    // Hari dengan transaksi tertinggi
    private String peakHari;

    // Interval waktu tersibuk
    private String peakInterval;

    // Jumlah transaksi pada peak hour
    private Integer peakTransaksi;

    // Omzet pada peak hour
    private Double peakOmzet;

    public DashboardTrafikSummaryResponse() {
    }

    public DashboardTrafikSummaryResponse(
            Integer totalTransaksi,
            Double totalOmzet,
            Double persentasePertumbuhan,
            String peakHari,
            String peakInterval,
            Integer peakTransaksi,
            Double peakOmzet) {

        this.totalTransaksi = totalTransaksi;
        this.totalOmzet = totalOmzet;
        this.persentasePertumbuhan = persentasePertumbuhan;
        this.peakHari = peakHari;
        this.peakInterval = peakInterval;
        this.peakTransaksi = peakTransaksi;
        this.peakOmzet = peakOmzet;
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

    public Double getPersentasePertumbuhan() {
        return persentasePertumbuhan;
    }

    public void setPersentasePertumbuhan(Double persentasePertumbuhan) {
        this.persentasePertumbuhan = persentasePertumbuhan;
    }

    public String getPeakHari() {
        return peakHari;
    }

    public void setPeakHari(String peakHari) {
        this.peakHari = peakHari;
    }

    public String getPeakInterval() {
        return peakInterval;
    }

    public void setPeakInterval(String peakInterval) {
        this.peakInterval = peakInterval;
    }

    public Integer getPeakTransaksi() {
        return peakTransaksi;
    }

    public void setPeakTransaksi(Integer peakTransaksi) {
        this.peakTransaksi = peakTransaksi;
    }

    public Double getPeakOmzet() {
        return peakOmzet;
    }

    public void setPeakOmzet(Double peakOmzet) {
        this.peakOmzet = peakOmzet;
    }

}