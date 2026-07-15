package com.meubelpendawa.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "produk")
@Getter             
@Setter             
@NoArgsConstructor
public class Produk {

    @Id
    private String idProduk;

    private String namaProduk;

    private Double hargaDefault;

    private Integer stok;

    private String deskripsi;

    private String gambarUrl;

    @Column(nullable = false)
    private Boolean statusAktif = true;

    @ManyToOne
    @JoinColumn(name = "idKategori")
    private Kategori kategori;

    @ManyToOne
    @JoinColumn(name = "idMerek")
    private Merek merek;


    public Produk(
            String namaProduk,
            Double hargaDefault,
            Integer stok,
            String deskripsi,
            String gambarUrl,
            Kategori kategori,
            Merek merek) {

        this.namaProduk = namaProduk;
        this.hargaDefault = hargaDefault;
        this.stok = stok;
        this.deskripsi = deskripsi;
        this.gambarUrl = gambarUrl;
        this.kategori = kategori;
        this.merek = merek;
        this.statusAktif = true;
    }

}