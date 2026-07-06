package com.meubelpendawa.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "pengiriman")
public class Pengiriman {

    @Id
    private String idPengiriman;

    private String statusPengiriman;

    private LocalDateTime tanggalSelesai;

    @ManyToOne
    @JoinColumn(name = "idKaryawan")
    private Karyawan driver;

    @OneToOne
    @JoinColumn(name = "orderId")
    private Transaksi transaksi;

    public Pengiriman() {
    }

    public Pengiriman(
            String statusPengiriman,
            LocalDateTime tanggalSelesai,
            Karyawan driver,
            Transaksi transaksi) {

        this.statusPengiriman = statusPengiriman;
        this.tanggalSelesai = tanggalSelesai;
        this.driver = driver;
        this.transaksi = transaksi;
    }

    public String getIdPengiriman() {
        return idPengiriman;
    }

    public void setIdPengiriman(String idPengiriman) {
        this.idPengiriman = idPengiriman;
    }

    public String getStatusPengiriman() {
        return statusPengiriman;
    }

    public void setStatusPengiriman(String statusPengiriman) {
        this.statusPengiriman = statusPengiriman;
    }

    public LocalDateTime getTanggalSelesai() {
        return tanggalSelesai;
    }

    public void setTanggalSelesai(LocalDateTime tanggalSelesai) {
        this.tanggalSelesai = tanggalSelesai;
    }

    public Karyawan getDriver() {
        return driver;
    }

    public void setDriver(Karyawan driver) {
        this.driver = driver;
    }

    public Transaksi getTransaksi() {
        return transaksi;
    }

    public void setTransaksi(Transaksi transaksi) {
        this.transaksi = transaksi;
    }
}