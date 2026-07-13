package com.meubelpendawa.dto.dashboard;

import java.time.LocalDateTime;

public class DashboardTransaksiTerbaruResponse {

    private String orderId;

    private String namaPemesan;

    private Double totalPesanan;

    private String metodePembayaran;

    private LocalDateTime tanggalTransaksi;

    public DashboardTransaksiTerbaruResponse() {
    }

    public DashboardTransaksiTerbaruResponse(
            String orderId,
            String namaPemesan,
            Double totalPesanan,
            String metodePembayaran,
            LocalDateTime tanggalTransaksi) {

        this.orderId = orderId;
        this.namaPemesan = namaPemesan;
        this.totalPesanan = totalPesanan;
        this.metodePembayaran = metodePembayaran;
        this.tanggalTransaksi = tanggalTransaksi;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getNamaPemesan() {
        return namaPemesan;
    }

    public void setNamaPemesan(String namaPemesan) {
        this.namaPemesan = namaPemesan;
    }

    public Double getTotalPesanan() {
        return totalPesanan;
    }

    public void setTotalPesanan(Double totalPesanan) {
        this.totalPesanan = totalPesanan;
    }

    public String getMetodePembayaran() {
        return metodePembayaran;
    }

    public void setMetodePembayaran(String metodePembayaran) {
        this.metodePembayaran = metodePembayaran;
    }

    public LocalDateTime getTanggalTransaksi() {
        return tanggalTransaksi;
    }

    public void setTanggalTransaksi(LocalDateTime tanggalTransaksi) {
        this.tanggalTransaksi = tanggalTransaksi;
    }
}