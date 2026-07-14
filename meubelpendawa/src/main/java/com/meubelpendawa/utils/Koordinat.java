package com.meubelpendawa.utils;

public class Koordinat {

    private final Double latitude;

    private final Double longitude;

    public Koordinat(Double latitude, Double longitude) {

        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Double getLatitude() {
        return latitude;
    }

    public Double getLongitude() {
        return longitude;
    }
}