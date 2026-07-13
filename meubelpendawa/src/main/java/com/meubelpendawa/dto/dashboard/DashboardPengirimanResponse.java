package com.meubelpendawa.dto.dashboard;

import java.util.List;

public class DashboardPengirimanResponse {

    private Integer totalAktif;

    private Integer totalTerlambat;

    private List<DashboardDriverResponse> drivers;

    public DashboardPengirimanResponse() {
    }

    public Integer getTotalAktif() {
        return totalAktif;
    }

    public void setTotalAktif(Integer totalAktif) {
        this.totalAktif = totalAktif;
    }

    public Integer getTotalTerlambat() {
        return totalTerlambat;
    }

    public void setTotalTerlambat(Integer totalTerlambat) {
        this.totalTerlambat = totalTerlambat;
    }

    public List<DashboardDriverResponse> getDrivers() {
        return drivers;
    }

    public void setDrivers(
            List<DashboardDriverResponse> drivers) {

        this.drivers = drivers;
    }
}