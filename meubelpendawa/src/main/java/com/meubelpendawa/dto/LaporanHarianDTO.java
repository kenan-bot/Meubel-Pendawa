package com.meubelpendawa.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class LaporanHarianDTO {

    // Ringkasan Laporan
    private BigDecimal cash = BigDecimal.ZERO;

    private BigDecimal cashless = BigDecimal.ZERO;

    private BigDecimal totalPemasukan = BigDecimal.ZERO;

    private Integer jumlahTransaksi = 0;

    // Detail Transaksi
    private List<DetailLaporanHarianDTO> transaksi = new ArrayList<>();

    public LaporanHarianDTO() {
    }


    public BigDecimal getCash() {
        return cash;
    }

    public void setCash(BigDecimal cash) {
        this.cash = cash;
    }

    public BigDecimal getCashless() {
        return cashless;
    }

    public void setCashless(BigDecimal cashless) {
        this.cashless = cashless;
    }

    public BigDecimal getTotalPemasukan() {
        return totalPemasukan;
    }

    public void setTotalPemasukan(BigDecimal totalPemasukan) {
        this.totalPemasukan = totalPemasukan;
    }

    public Integer getJumlahTransaksi() {
        return jumlahTransaksi;
    }

    public void setJumlahTransaksi(Integer jumlahTransaksi) {
        this.jumlahTransaksi = jumlahTransaksi;
    }

    public List<DetailLaporanHarianDTO> getTransaksi() {
        return transaksi;
    }

    public void setTransaksi(List<DetailLaporanHarianDTO> transaksi) {
        this.transaksi = transaksi;
    }
}