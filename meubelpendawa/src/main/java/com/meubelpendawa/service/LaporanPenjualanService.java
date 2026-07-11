package com.meubelpendawa.service;

import com.meubelpendawa.dto.LaporanPenjualanSummaryResponse;
import com.meubelpendawa.repository.DetailTransaksiRepository;
import com.meubelpendawa.repository.TransaksiRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.meubelpendawa.dto.LaporanPenjualanTrenResponse;

import java.time.temporal.ChronoUnit;
import java.time.format.TextStyle;
import java.util.Locale;

import java.util.LinkedHashMap;
import java.util.Map;

import com.meubelpendawa.dto.KontribusiProdukResponse;
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

                // Hitung growth dibanding periode sebelumnya

                // Lama periode yang dipilih
                long jumlahHari = ChronoUnit.DAYS.between(
                                startDate.toLocalDate(),
                                endDate.toLocalDate()) + 1;

                // Periode sebelumnya
                LocalDateTime previousStart = startDate.minusDays(jumlahHari);

                LocalDateTime previousEnd = endDate.minusDays(jumlahHari);

                // Omzet sekarang
                Double currentOmzet = response.getTotalOmzet();

                // Omzet periode sebelumnya
                Double previousOmzet = transaksiRepository.getTotalOmzetByPeriode(
                                previousStart,
                                previousEnd);

                // Hitung growth %
                double growth = 0;

                if (previousOmzet != null && previousOmzet > 0) {

                        growth = ((currentOmzet - previousOmzet)
                                        / previousOmzet) * 100;

                }

                response.setGrowthPercentage(growth);

                if (jumlahHari == 1) {

                        response.setComparisonLabel("dibanding kemarin");

                } else {

                        response.setComparisonLabel("dibanding periode sebelumnya");

                }

                response.setTrend(
                                getTrenPenjualan(startDate, endDate));

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

        public List<LaporanPenjualanTrenResponse> getTrenPenjualan(
                        LocalDateTime startDate,
                        LocalDateTime endDate) {

                List<Transaksi> transaksiList = transaksiRepository.getTrenPenjualanByPeriode(
                                startDate,
                                endDate);

                long jumlahHari = ChronoUnit.DAYS.between(
                                startDate.toLocalDate(),
                                endDate.toLocalDate());

                Map<String, Double> omzetMap = new LinkedHashMap<>();
                Map<String, Long> transaksiMap = new LinkedHashMap<>();

                for (Transaksi transaksi : transaksiList) {

                        String label;

                        // HARIAN
                        if (jumlahHari == 0) {

                                label = String.format(
                                                "%02d:00",
                                                transaksi.getTanggalTransaksi().getHour());

                        }

                        // BULANAN
                        else if (jumlahHari <= 31) {

                                label = String.valueOf(
                                                transaksi.getTanggalTransaksi().getDayOfMonth());

                        }

                        // TAHUNAN
                        else {

                                label = transaksi.getTanggalTransaksi()
                                                .getMonth()
                                                .getDisplayName(
                                                                TextStyle.SHORT,
                                                                new Locale("id", "ID"));
                        }

                        omzetMap.put(
                                        label,
                                        omzetMap.getOrDefault(label, 0.0)
                                                        + transaksi.getTotalPesanan());

                        transaksiMap.put(
                                        label,
                                        transaksiMap.getOrDefault(label, 0L)
                                                        + 1);
                }

                List<LaporanPenjualanTrenResponse> result = new ArrayList<>();

                for (String label : omzetMap.keySet()) {

                        result.add(
                                        new LaporanPenjualanTrenResponse(
                                                        label,
                                                        omzetMap.get(label),
                                                        transaksiMap.get(label)));
                }

                return result;
        }

        public List<KontribusiProdukResponse> getKontribusiProduk(
                        LocalDateTime startDate,
                        LocalDateTime endDate) {

                List<Object[]> data = detailRepository.getKontribusiProduk(
                                startDate,
                                endDate);

                long totalProduk = data.stream()
                                .mapToLong(row -> ((Number) row[1]).longValue())
                                .sum();

                List<KontribusiProdukResponse> response = new ArrayList<>();

                for (Object[] row : data) {

                        String namaProduk = (String) row[0];

                        Long qty = ((Number) row[1]).longValue();

                        double persen = totalProduk == 0
                                        ? 0
                                        : ((double) qty / totalProduk) * 100;

                        KontribusiProdukResponse item = new KontribusiProdukResponse();

                        item.setNamaProduk(namaProduk);
                        item.setTotalTerjual(qty);
                        item.setPersentase(persen);

                        response.add(item);
                }

                return response.stream()
                                .limit(5)
                                .toList();
        }

}