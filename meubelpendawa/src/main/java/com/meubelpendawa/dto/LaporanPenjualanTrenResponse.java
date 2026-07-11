package com.meubelpendawa.dto;

public class LaporanPenjualanTrenResponse {

    private String label;
    private Double omzet;
    private Long transaksi;

    public LaporanPenjualanTrenResponse() {
    }

    public LaporanPenjualanTrenResponse(
            String label,
            Double omzet,
            Long transaksi) {

        this.label = label;
        this.omzet = omzet;
        this.transaksi = transaksi;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Double getOmzet() {
        return omzet;
    }

    public void setOmzet(Double omzet) {
        this.omzet = omzet;
    }

    public Long getTransaksi() {
        return transaksi;
    }

    public void setTransaksi(Long transaksi) {
        this.transaksi = transaksi;
    }
}