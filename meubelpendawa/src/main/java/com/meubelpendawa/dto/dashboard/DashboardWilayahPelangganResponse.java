package com.meubelpendawa.dto.dashboard;

public class DashboardWilayahPelangganResponse {

    private String wilayah;

    private Integer total;

    private Double latitude;

    private Double longitude;

    public DashboardWilayahPelangganResponse() {
    }

    public DashboardWilayahPelangganResponse(
            String wilayah,
            Integer total,
            Double latitude,
            Double longitude) {

        this.wilayah = wilayah;
        this.total = total;
        this.latitude = latitude;
        this.longitude = longitude;
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

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}