package com.meubelpendawa.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.meubelpendawa.model.DetailTransaksi;
import com.meubelpendawa.model.Produk;
import com.meubelpendawa.model.Transaksi;
import com.meubelpendawa.repository.DetailTransaksiRepository;
import com.meubelpendawa.repository.ProdukRepository;
import com.meubelpendawa.repository.TransaksiRepository;

@Service
public class DetailTransaksiService {

    @Autowired
    private ProdukRepository produkRepository;

    @Autowired
    private TransaksiRepository transaksiRepository;

    @Autowired
    private DetailTransaksiRepository detailTransaksiRepository;

    @Autowired
    private IdGeneratorService idGeneratorService;

    public List<DetailTransaksi> getAllDetailTransaksi() {
        return detailTransaksiRepository.findAll();
    }

    public DetailTransaksi simpanDetailTransaksi(DetailTransaksi detailTransaksi) {

        Produk produk = produkRepository.findById(detailTransaksi.getProduk().getIdProduk())
                .orElseThrow(() -> new RuntimeException("Produk tidak ditemukan"));

        if (produk.getStok() < detailTransaksi.getQty()) {
            throw new RuntimeException("Stok tidak mencukupi");
        }

        if (detailTransaksi.getHargaJual() == null) {
            throw new RuntimeException("Harga jual wajib diisi");
        }

        if (detailTransaksi.getHargaJual() <= 0) {
            throw new RuntimeException("Harga jual harus lebih dari 0");
        }

        if (detailTransaksi.getQty() == null || detailTransaksi.getQty() <= 0) {
            throw new RuntimeException("Qty harus lebih dari 0");
        }

        DetailTransaksi lastDetail = detailTransaksiRepository.findFirstByOrderByIdDetailTransaksiDesc();

        String lastId = lastDetail == null
                ? null
                : lastDetail.getIdDetailTransaksi();

        detailTransaksi.setIdDetailTransaksi(
                idGeneratorService.generateNextId(lastId, "DTL"));
        detailTransaksi.setSubtotal(detailTransaksi.getQty() * detailTransaksi.getHargaJual());

        DetailTransaksi hasil = detailTransaksiRepository.save(detailTransaksi);
        produk.setStok(produk.getStok() - detailTransaksi.getQty());

        produkRepository.save(produk);

        String orderId = hasil.getTransaksi().getOrderId();

        Transaksi transaksi = transaksiRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Transaksi tidak ditemukan"));

        double totalBaru = detailTransaksiRepository.findByTransaksi_OrderId(orderId)
                .stream().mapToDouble(DetailTransaksi::getSubtotal).sum();

        transaksi.setTotalPesanan(totalBaru);
        if (transaksi.getJumlahBayar() != null) {
            transaksi.setKembalian(transaksi.getJumlahBayar() - totalBaru);
        }
        transaksiRepository.save(transaksi);
        return hasil;
    }

}
