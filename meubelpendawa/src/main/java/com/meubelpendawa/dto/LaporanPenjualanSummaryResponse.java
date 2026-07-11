package com.meubelpendawa.dto;

import java.util.List;

public class LaporanPenjualanSummaryResponse {

    private Double totalOmzet;
    private Long totalTransaksi;
    private Long produkTerjual;
    private Double rataRataPembelian;
    private Double cash;
    private Double cashless;

    // Tambahan
    private Double growthPercentage;
    private String comparisonLabel;
    private List<LaporanPenjualanTrenResponse> trend;

    public LaporanPenjualanSummaryResponse() {
    }

    public Double getTotalOmzet() {
        return totalOmzet;
    }

    public void setTotalOmzet(Double totalOmzet) {
        this.totalOmzet = totalOmzet;
    }

    public Long getTotalTransaksi() {
        return totalTransaksi;
    }

    public void setTotalTransaksi(Long totalTransaksi) {
        this.totalTransaksi = totalTransaksi;
    }

    public Long getProdukTerjual() {
        return produkTerjual;
    }

    public void setProdukTerjual(Long produkTerjual) {
        this.produkTerjual = produkTerjual;
    }

    public Double getRataRataPembelian() {
        return rataRataPembelian;
    }

    public void setRataRataPembelian(Double rataRataPembelian) {
        this.rataRataPembelian = rataRataPembelian;
    }

    public Double getCash() {
        return cash;
    }

    public void setCash(Double cash) {
        this.cash = cash;
    }

    public Double getCashless() {
        return cashless;
    }

    public void setCashless(Double cashless) {
        this.cashless = cashless;
    }

    // ===== Tambahan =====

    public Double getGrowthPercentage() {
        return growthPercentage;
    }

    public void setGrowthPercentage(Double growthPercentage) {
        this.growthPercentage = growthPercentage;
    }

    public String getComparisonLabel() {
        return comparisonLabel;
    }

    public void setComparisonLabel(String comparisonLabel) {
        this.comparisonLabel = comparisonLabel;
    }

    public List<LaporanPenjualanTrenResponse> getTrend() {
        return trend;
    }

    public void setTrend(List<LaporanPenjualanTrenResponse> trend) {
        this.trend = trend;
    }
}