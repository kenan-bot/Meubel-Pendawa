package com.meubelpendawa.dto.dashboard;

import java.time.LocalDateTime;

public class DashboardTransaksiTerbesarResponse {

    private String orderId;

    private String namaPemesan;

    private Double total;

    private LocalDateTime waktuTransaksi;

    private String metodePembayaran;

    public DashboardTransaksiTerbesarResponse() {
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

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public LocalDateTime getWaktuTransaksi() {
        return waktuTransaksi;
    }

    public void setWaktuTransaksi(LocalDateTime waktuTransaksi) {
        this.waktuTransaksi = waktuTransaksi;
    }

    public String getMetodePembayaran() {
        return metodePembayaran;
    }

    public void setMetodePembayaran(String metodePembayaran) {
        this.metodePembayaran = metodePembayaran;
    }
}