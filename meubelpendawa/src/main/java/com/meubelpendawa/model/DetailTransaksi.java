package com.meubelpendawa.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
@Table(name = "detailtransaksi")
public class DetailTransaksi {

    @Id
    private String idDetailTransaksi;

    private Integer qty;

    private Double hargaJual;

    private Double subtotal;

    @ManyToOne
    @JoinColumn(name = "idProduk")
    private Produk produk;

    @ManyToOne
    @JoinColumn(name = "orderId")
    private Transaksi transaksi;

    public DetailTransaksi() {
    }

    public DetailTransaksi(Integer qty, Double hargaJual, Double subtotal, Produk produk, Transaksi transaksi) {
        this.qty = qty;
        this.hargaJual = hargaJual;
        this.subtotal = subtotal;
        this.produk = produk;
        this.transaksi = transaksi;
    }

    public String getIdDetailTransaksi() {
        return idDetailTransaksi;
    }

    public void setIdDetailTransaksi(String idDetailTransaksi) {
        this.idDetailTransaksi = idDetailTransaksi;
    }

    public Integer getQty() {
        return qty;
    }

    public void setQty(Integer qty) {
        this.qty = qty;
    }

    public Double getHargaJual() {
        return hargaJual;
    }

    public void setHargaJual(Double hargaJual) {
        this.hargaJual = hargaJual;
    }

    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }

    public Produk getProduk() {
        return produk;
    }

    public void setProduk(Produk produk) {
        this.produk = produk;
    }

    public Transaksi getTransaksi() {
        return transaksi;
    }

    public void setTransaksi(Transaksi transaksi) {
        this.transaksi = transaksi;
    }
}
