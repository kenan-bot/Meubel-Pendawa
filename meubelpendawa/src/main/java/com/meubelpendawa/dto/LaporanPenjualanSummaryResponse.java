package com.meubelpendawa.dto;

import java.util.List;

public class LaporanPenjualanSummaryResponse {

    private Double totalOmzet;
    private Long totalTransaksi;
    private Long produkTerjual;
    private Double rataRataPembelian;
    private Double cash;
    private Double cashless;

    // Growth KPI
    private Double omzetGrowth;
    private Double transaksiGrowth;
    private Double produkGrowth;
    private Double rataRataGrowth;

    // Dashboard
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

    // Growth

    public Double getOmzetGrowth() {
        return omzetGrowth;
    }

    public void setOmzetGrowth(Double omzetGrowth) {
        this.omzetGrowth = omzetGrowth;
    }

    public Double getTransaksiGrowth() {
        return transaksiGrowth;
    }

    public void setTransaksiGrowth(Double transaksiGrowth) {
        this.transaksiGrowth = transaksiGrowth;
    }

    public Double getProdukGrowth() {
        return produkGrowth;
    }

    public void setProdukGrowth(Double produkGrowth) {
        this.produkGrowth = produkGrowth;
    }

    public Double getRataRataGrowth() {
        return rataRataGrowth;
    }

    public void setRataRataGrowth(Double rataRataGrowth) {
        this.rataRataGrowth = rataRataGrowth;
    }

    // Dashboard

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