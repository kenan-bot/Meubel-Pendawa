package com.meubelpendawa.dto.dashboard;

public class DashboardProdukTerlarisResponse {

    private String namaProduk;

    private Integer totalTerjual;

    private Double totalOmzet;

    public DashboardProdukTerlarisResponse() {
    }

    public DashboardProdukTerlarisResponse(
            String namaProduk,
            Integer totalTerjual,
            Double totalOmzet) {

        this.namaProduk = namaProduk;
        this.totalTerjual = totalTerjual;
        this.totalOmzet = totalOmzet;
    }

    public String getNamaProduk() {
        return namaProduk;
    }

    public void setNamaProduk(String namaProduk) {
        this.namaProduk = namaProduk;
    }

    public Integer getTotalTerjual() {
        return totalTerjual;
    }

    public void setTotalTerjual(Integer totalTerjual) {
        this.totalTerjual = totalTerjual;
    }

    public Double getTotalOmzet() {
        return totalOmzet;
    }

    public void setTotalOmzet(Double totalOmzet) {
        this.totalOmzet = totalOmzet;
    }
}