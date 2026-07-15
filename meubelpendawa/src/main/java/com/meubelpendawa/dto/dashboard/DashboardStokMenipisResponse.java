package com.meubelpendawa.dto.dashboard;

public class DashboardStokMenipisResponse {

    private String namaProduk;
    private Integer stok;

    public DashboardStokMenipisResponse() {
    }

    public DashboardStokMenipisResponse(
            String namaProduk,
            Integer stok) {

        this.namaProduk = namaProduk;
        this.stok = stok;
    }

    public String getNamaProduk() {
        return namaProduk;
    }

    public void setNamaProduk(String namaProduk) {
        this.namaProduk = namaProduk;
    }

    public Integer getStok() {
        return stok;
    }

    public void setStok(Integer stok) {
        this.stok = stok;
    }
}