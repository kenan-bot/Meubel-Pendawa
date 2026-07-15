package com.meubelpendawa.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "pengiriman")
@Getter             
@Setter             
@NoArgsConstructor
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

}