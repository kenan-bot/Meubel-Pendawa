package com.meubelpendawa.model;

import java.time.LocalDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

@Entity
@Table(name = "transaksi")
@Getter             
@Setter             
@NoArgsConstructor
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

    private String statusPembayaran = "PENDING";

    public Transaksi(String namaPemesan, String noWhatsapp, String alamatPengiriman, String metodePengiriman, String metodePembayaran) {
        this.namaPemesan = namaPemesan;
        this.noWhatsapp = noWhatsapp;
        this.alamatPengiriman = alamatPengiriman;
        this.metodePengiriman = metodePengiriman;
        this.metodePembayaran = metodePembayaran;
    }

    
}