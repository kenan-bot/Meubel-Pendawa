package com.meubelpendawa.dto.dashboard;

public class DashboardWilayahPelangganResponse {

    private String wilayah;

    private Integer total;

    public DashboardWilayahPelangganResponse() {
    }

    public DashboardWilayahPelangganResponse(
            String wilayah,
            Integer total) {

        this.wilayah = wilayah;
        this.total = total;
    }

    public String getWilayah() {
        return wilayah;
    }

    public void setWilayah(String wilayah) {
        this.wilayah = wilayah;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }
}