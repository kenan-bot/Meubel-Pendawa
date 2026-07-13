package com.meubelpendawa.dto.dashboard;

public class DashboardMerekPopulerResponse {

    private String namaMerek;

    private Integer totalTerjual;

    public DashboardMerekPopulerResponse() {
    }

    public DashboardMerekPopulerResponse(
            String namaMerek,
            Integer totalTerjual) {

        this.namaMerek = namaMerek;
        this.totalTerjual = totalTerjual;
    }

    public String getNamaMerek() {
        return namaMerek;
    }

    public void setNamaMerek(String namaMerek) {
        this.namaMerek = namaMerek;
    }

    public Integer getTotalTerjual() {
        return totalTerjual;
    }

    public void setTotalTerjual(Integer totalTerjual) {
        this.totalTerjual = totalTerjual;
    }
}