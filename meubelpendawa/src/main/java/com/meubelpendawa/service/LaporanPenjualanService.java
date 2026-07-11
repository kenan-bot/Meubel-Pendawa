package com.meubelpendawa.service;

import com.meubelpendawa.dto.LaporanPenjualanSummaryResponse;
import com.meubelpendawa.repository.DetailTransaksiRepository;
import com.meubelpendawa.repository.TransaksiRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.meubelpendawa.dto.LaporanPenjualanDetailResponse;
import com.meubelpendawa.model.DetailTransaksi;
import com.meubelpendawa.model.Transaksi;

@Service
public class LaporanPenjualanService {

    private final TransaksiRepository transaksiRepository;
    private final DetailTransaksiRepository detailRepository;

    public LaporanPenjualanService(
            TransaksiRepository transaksiRepository,
            DetailTransaksiRepository detailRepository) {

        this.transaksiRepository = transaksiRepository;
        this.detailRepository = detailRepository;
    }

    public LaporanPenjualanSummaryResponse getSummary() {

        LaporanPenjualanSummaryResponse response = new LaporanPenjualanSummaryResponse();

        response.setTotalOmzet(
                transaksiRepository.getTotalOmzet());

        response.setTotalTransaksi(
                transaksiRepository.getTotalTransaksi());

        response.setRataRataPembelian(
                transaksiRepository.getRataRataPembelian());

        response.setProdukTerjual(
                detailRepository.getTotalProdukTerjual());

        response.setCash(
                transaksiRepository.getTotalCash());

        response.setCashless(
                transaksiRepository.getTotalCashless());

        return response;
    }

    public LaporanPenjualanSummaryResponse getSummary(
            LocalDateTime startDate,
            LocalDateTime endDate) {

        LaporanPenjualanSummaryResponse response = new LaporanPenjualanSummaryResponse();

        response.setTotalOmzet(
                transaksiRepository.getTotalOmzetByPeriode(
                        startDate, endDate));

        response.setTotalTransaksi(
                transaksiRepository.getTotalTransaksiByPeriode(
                        startDate, endDate));

        response.setRataRataPembelian(
                transaksiRepository.getRataRataPembelianByPeriode(
                        startDate, endDate));

        response.setProdukTerjual(
                detailRepository.getTotalProdukTerjualByPeriode(
                        startDate, endDate));

        response.setCash(
                transaksiRepository.getTotalCashByPeriode(
                        startDate, endDate));

        response.setCashless(
                transaksiRepository.getTotalCashlessByPeriode(
                        startDate, endDate));

        return response;
    }

    public List<LaporanPenjualanDetailResponse> getDetailPenjualan(
            LocalDateTime startDate,
            LocalDateTime endDate) {

        List<Transaksi> transaksiList = transaksiRepository.getDetailPenjualanByPeriode(
                startDate,
                endDate);

        List<LaporanPenjualanDetailResponse> response = new ArrayList<>();

        int nomor = 1;

        for (Transaksi transaksi : transaksiList) {

            List<DetailTransaksi> detailList = detailRepository.findByTransaksi_OrderId(
                    transaksi.getOrderId());

            String produk = detailList.stream()
                    .map(detail -> detail.getQty()
                            + " "
                            + detail.getProduk().getNamaProduk())
                    .collect(Collectors.joining(", "));

            LaporanPenjualanDetailResponse item = new LaporanPenjualanDetailResponse();

            item.setNo(nomor++);
            item.setTanggal(transaksi.getTanggalTransaksi());
            item.setOrderId(transaksi.getOrderId());
            item.setPemesan(transaksi.getNamaPemesan());
            item.setProduk(produk);
            item.setTotal(transaksi.getTotalPesanan());
            item.setPembayaran(transaksi.getMetodePembayaran());
            item.setPengiriman(transaksi.getMetodePengiriman());

            response.add(item);
        }

        return response;
    }
}