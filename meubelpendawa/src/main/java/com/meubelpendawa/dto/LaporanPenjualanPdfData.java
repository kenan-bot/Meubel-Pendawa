package com.meubelpendawa.dto;

import java.util.List;

public class LaporanPenjualanPdfData {

    private String periode;

    private String tanggalCetak;

    private LaporanPenjualanSummaryResponse summary;

    private List<KontribusiProdukResponse> topProduk;

    private List<LaporanPenjualanTrenResponse> trenPenjualan;

    private List<LaporanPenjualanDetailResponse> detailPenjualan;

    public LaporanPenjualanPdfData() {
    }

    public String getPeriode() {
        return periode;
    }

    public void setPeriode(String periode) {
        this.periode = periode;
    }

    public String getTanggalCetak() {
        return tanggalCetak;
    }

    public void setTanggalCetak(String tanggalCetak) {
        this.tanggalCetak = tanggalCetak;
    }

    public LaporanPenjualanSummaryResponse getSummary() {
        return summary;
    }

    public void setSummary(LaporanPenjualanSummaryResponse summary) {
        this.summary = summary;
    }

    public List<KontribusiProdukResponse> getTopProduk() {
        return topProduk;
    }

    public void setTopProduk(List<KontribusiProdukResponse> topProduk) {
        this.topProduk = topProduk;
    }

    public List<LaporanPenjualanTrenResponse> getTrenPenjualan() {
        return trenPenjualan;
    }

    public void setTrenPenjualan(List<LaporanPenjualanTrenResponse> trenPenjualan) {
        this.trenPenjualan = trenPenjualan;
    }

    public List<LaporanPenjualanDetailResponse> getDetailPenjualan() {
        return detailPenjualan;
    }

    public void setDetailPenjualan(List<LaporanPenjualanDetailResponse> detailPenjualan) {
        this.detailPenjualan = detailPenjualan;
    }
}