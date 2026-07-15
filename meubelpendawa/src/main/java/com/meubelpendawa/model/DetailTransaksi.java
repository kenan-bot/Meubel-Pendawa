package com.meubelpendawa.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "detailtransaksi")
@Getter 
@Setter 
@NoArgsConstructor
public class DetailTransaksi {

    @Id
    private String idDetailTransaksi;

    private Integer qty;

    private Double hargaJual;

    private String namaProduk;

    private Double subtotal;

    @ManyToOne
    @JoinColumn(name = "idProduk")
    private Produk produk;

    @ManyToOne
    @JoinColumn(name = "orderId")
    private Transaksi transaksi;

    public DetailTransaksi(Integer qty, Double hargaJual, Double subtotal, Produk produk, Transaksi transaksi) {
        this.qty = qty;
        this.hargaJual = hargaJual;
        this.subtotal = subtotal;
        this.produk = produk;
        this.transaksi = transaksi;
    }

    
}
