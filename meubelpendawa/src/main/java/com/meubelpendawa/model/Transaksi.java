package com.meubelpendawa.model;

import java.time.LocalDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

@Entity
@Table(name = "transaksi")
public class Transaksi {

    @Id
    private String orderId;

    private String namaPemesan;

    private String noWhatsapp;

    private String alamatPengiriman;

    private LocalDateTime tanggalTransaksi;

    private String metodePengiriman;

    private String metodePembayaran;

    @ManyToOne
    @JoinColumn(name = "idKaryawan")
    private Karyawan driver;

    private Double totalPesanan;

    private Double jumlahBayar;

    private Double kembalian;

    // [BARU] Untuk cashless via Midtrans: PENDING (menunggu bayar) -> SUCCESS / FAILED / CHALLENGE.
    // Untuk CASH, langsung diisi "SUCCESS" saat prosesPembayaran() dipanggil (lihat TransaksiService).
    private String statusPembayaran = "PENDING";

    public Transaksi() {
    }

    public Transaksi(String namaPemesan, String noWhatsapp, String alamatPengiriman, String metodePengiriman, String metodePembayaran) {
        this.namaPemesan = namaPemesan;
        this.noWhatsapp = noWhatsapp;
        this.alamatPengiriman = alamatPengiriman;
        this.metodePengiriman = metodePengiriman;
        this.metodePembayaran = metodePembayaran;
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

    public String getNoWhatsapp() {
        return noWhatsapp;
    }

    public void setNoWhatsapp(String noWhatsapp) {
        this.noWhatsapp = noWhatsapp;
    }

    public String getAlamatPengiriman() {
        return alamatPengiriman;
    }

    public void setAlamatPengiriman(String alamatPengiriman) {
        this.alamatPengiriman = alamatPengiriman;
    }

    public LocalDateTime getTanggalTransaksi() {
        return tanggalTransaksi;
    }

    public void setTanggalTransaksi(LocalDateTime tanggalTransaksi) {
        this.tanggalTransaksi = tanggalTransaksi;
    }

    public String getMetodePengiriman() {
        return metodePengiriman;
    }

    public void setMetodePengiriman(String metodePengiriman) {
        this.metodePengiriman = metodePengiriman;
    }

    public String getMetodePembayaran() {
        return metodePembayaran;
    }

    public void setMetodePembayaran(String metodePembayaran) {
        this.metodePembayaran = metodePembayaran;
    }

    public Double getTotalPesanan() {
        return totalPesanan;
    }

    public void setTotalPesanan(Double totalPesanan) {
        this.totalPesanan = totalPesanan;
    }

    public Double getJumlahBayar() {
        return jumlahBayar;
    }

    public void setJumlahBayar(Double jumlahBayar) {
        this.jumlahBayar = jumlahBayar;
    }

    public Double getKembalian() {
        return kembalian;
    }

    public void setKembalian(Double kembalian) {
        this.kembalian = kembalian;
    }
    
    public Karyawan getDriver() {
        return driver;
    }

    public void setDriver(Karyawan driver) {
        this.driver = driver;
    }

    public String getStatusPembayaran() {
        return statusPembayaran;
    }

    public void setStatusPembayaran(String statusPembayaran) {
        this.statusPembayaran = statusPembayaran;
    }
}