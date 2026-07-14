package com.meubelpendawa.dto.dashboard;

public class DashboardDeliveryResponse {

    private Long totalDelivery;
    private Long totalPickup;
    private Long totalPesanan;

    private Double persentaseDelivery;
    private Double persentasePickup;

    private String insight;

    public DashboardDeliveryResponse() {
    }

    public DashboardDeliveryResponse(
            Long totalDelivery,
            Long totalPickup,
            Long totalPesanan,
            Double persentaseDelivery,
            Double persentasePickup,
            String insight) {

        this.totalDelivery = totalDelivery;
        this.totalPickup = totalPickup;
        this.totalPesanan = totalPesanan;
        this.persentaseDelivery = persentaseDelivery;
        this.persentasePickup = persentasePickup;
        this.insight = insight;
    }

    public Long getTotalDelivery() {
        return totalDelivery;
    }

    public void setTotalDelivery(Long totalDelivery) {
        this.totalDelivery = totalDelivery;
    }

    public Long getTotalPickup() {
        return totalPickup;
    }

    public void setTotalPickup(Long totalPickup) {
        this.totalPickup = totalPickup;
    }

    public Long getTotalPesanan() {
        return totalPesanan;
    }

    public void setTotalPesanan(Long totalPesanan) {
        this.totalPesanan = totalPesanan;
    }

    public Double getPersentaseDelivery() {
        return persentaseDelivery;
    }

    public void setPersentaseDelivery(Double persentaseDelivery) {
        this.persentaseDelivery = persentaseDelivery;
    }

    public Double getPersentasePickup() {
        return persentasePickup;
    }

    public void setPersentasePickup(Double persentasePickup) {
        this.persentasePickup = persentasePickup;
    }

    public String getInsight() {
        return insight;
    }

    public void setInsight(String insight) {
        this.insight = insight;
    }
}