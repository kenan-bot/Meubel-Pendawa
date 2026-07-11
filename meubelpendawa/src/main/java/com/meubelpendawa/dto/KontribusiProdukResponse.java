package com.meubelpendawa.dto;

public class KontribusiProdukResponse {

    private String namaProduk;
    private Long totalTerjual;
    private Double persentase;

    public KontribusiProdukResponse() {
    }

    public String getNamaProduk() {
        return namaProduk;
    }

    public void setNamaProduk(String namaProduk) {
        this.namaProduk = namaProduk;
    }

    public Long getTotalTerjual() {
        return totalTerjual;
    }

    public void setTotalTerjual(Long totalTerjual) {
        this.totalTerjual = totalTerjual;
    }

    public Double getPersentase() {
        return persentase;
    }

    public void setPersentase(Double persentase) {
        this.persentase = persentase;
    }
}