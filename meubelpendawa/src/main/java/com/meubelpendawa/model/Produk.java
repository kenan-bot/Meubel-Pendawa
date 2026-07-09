package com.meubelpendawa.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
@Table(name = "produk")
public class Produk {

    @Id
    private String idProduk;

    private String namaProduk;

    private Double hargaDefault;

    private Integer stok;

    private String deskripsi;

    private String gambarUrl;

    private Boolean statusAktif = true;

    @ManyToOne
    @JoinColumn(name = "idKategori")
    private Kategori kategori;

    @ManyToOne
    @JoinColumn(name = "idMerek")
    private Merek merek;

    public Produk() {
    }

    public Produk(String namaProduk,
            Double hargaDefault,
            Integer stok,
            String deskripsi,
            String gambarUrl,
            Kategori kategori,
            Merek merek, Boolean statusAktif) {

        this.namaProduk = namaProduk;
        this.hargaDefault = hargaDefault;
        this.stok = stok;
        this.deskripsi = deskripsi;
        this.gambarUrl = gambarUrl;
        this.kategori = kategori;
        this.merek = merek;
        this.statusAktif = statusAktif;
    }

    public String getIdProduk() {
        return idProduk;
    }

    public void setIdProduk(String idProduk) {
        this.idProduk = idProduk;
    }

    public String getNamaProduk() {
        return namaProduk;
    }

    public void setNamaProduk(String namaProduk) {
        this.namaProduk = namaProduk;
    }

    public Double getHargaDefault() {
        return hargaDefault;
    }

    public void setHargaDefault(Double hargaDefault) {
        this.hargaDefault = hargaDefault;
    }

    public Integer getStok() {
        return stok;
    }

    public void setStok(Integer stok) {
        this.stok = stok;
    }

    public String getDeskripsi() {
        return deskripsi;
    }

    public void setDeskripsi(String deskripsi) {
        this.deskripsi = deskripsi;
    }

    public String getGambarUrl() {
        return gambarUrl;
    }

    public void setGambarUrl(String gambarUrl) {
        this.gambarUrl = gambarUrl;
    }

    public Kategori getKategori() {
        return kategori;
    }

    public void setKategori(Kategori kategori) {
        this.kategori = kategori;
    }

    public Merek getMerek() {
        return merek;
    }

    public void setMerek(Merek merek) {
        this.merek = merek;
    }

    public Boolean getStatusAktif() {
        return statusAktif;
    }

    public void setStatusAktif(Boolean statusAktif) {
        this.statusAktif = statusAktif;
    }
}