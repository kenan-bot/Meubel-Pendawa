package com.meubelpendawa.dto.dashboard;

public class DashboardDriverResponse {

    private String nama;
    private Integer total;

    public DashboardDriverResponse() {
    }

    public DashboardDriverResponse(
            String nama,
            Integer total) {

        this.nama = nama;
        this.total = total;
    }

    public String getNama() {
        return nama;
    }

    public void setNama(String nama) {
        this.nama = nama;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }
}