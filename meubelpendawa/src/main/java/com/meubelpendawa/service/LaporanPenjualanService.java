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

        private Double hitungGrowth(Double current, Double previous) {

                current = current == null ? 0.0 : current;
                previous = previous == null ? 0.0 : previous;

                if (previous == 0) {
                        return current == 0 ? 0.0 : 100.0;
                }

                return ((current - previous) / previous) * 100;
        }

        public LaporanPenjualanSummaryResponse getSummary() {

                LocalDateTime endDate = LocalDateTime.now();
                LocalDateTime startDate = endDate.minusDays(29);

                return getSummary(startDate, endDate);
        }

        public LaporanPenjualanSummaryResponse getSummary(
                        LocalDateTime startDate,
                        LocalDateTime endDate) {

                LaporanPenjualanSummaryResponse response = new LaporanPenjualanSummaryResponse();

                // PERIODE SEKARANG

                Double totalOmzet = transaksiRepository.getTotalOmzetByPeriode(
                                startDate, endDate);

                Long totalTransaksi = transaksiRepository.getTotalTransaksiByPeriode(
                                startDate, endDate);

                Double rataRata = transaksiRepository.getRataRataPembelianByPeriode(
                                startDate, endDate);

                Long produkTerjual = detailRepository.getTotalProdukTerjualByPeriode(
                                startDate, endDate);

                Double cash = transaksiRepository.getTotalCashByPeriode(
                                startDate, endDate);

                Double cashless = transaksiRepository.getTotalCashlessByPeriode(
                                startDate, endDate);

                response.setTotalOmzet(totalOmzet);
                response.setTotalTransaksi(totalTransaksi);
                response.setRataRataPembelian(rataRata);
                response.setProdukTerjual(produkTerjual);
                response.setCash(cash);
                response.setCashless(cashless);

                // PERIODE SEBELUMNYA

                long jumlahHari = ChronoUnit.DAYS.between(
                                startDate.toLocalDate(),
                                endDate.toLocalDate()) + 1;

                LocalDateTime previousStart = startDate.minusDays(jumlahHari);
                LocalDateTime previousEnd = endDate.minusDays(jumlahHari);

                Double previousOmzet = transaksiRepository.getTotalOmzetByPeriode(
                                previousStart,
                                previousEnd);

                Long previousTransaksi = transaksiRepository.getTotalTransaksiByPeriode(
                                previousStart,
                                previousEnd);

                Double previousRataRata = transaksiRepository.getRataRataPembelianByPeriode(
                                previousStart,
                                previousEnd);

                Long previousProduk = detailRepository.getTotalProdukTerjualByPeriode(
                                previousStart,
                                previousEnd);

                // GROWTH

                response.setOmzetGrowth(
                                hitungGrowth(totalOmzet, previousOmzet));

                response.setTransaksiGrowth(
                                hitungGrowth(
                                                totalTransaksi == null ? 0.0 : totalTransaksi.doubleValue(),
                                                previousTransaksi == null ? 0.0 : previousTransaksi.doubleValue()));

                response.setRataRataGrowth(
                                hitungGrowth(rataRata, previousRataRata));

                response.setProdukGrowth(
                                hitungGrowth(
                                                produkTerjual == null ? 0.0 : produkTerjual.doubleValue(),
                                                previousProduk == null ? 0.0 : previousProduk.doubleValue()));

                // LABEL

                if (jumlahHari == 1) {
                        response.setComparisonLabel("dibanding kemarin");
                } else {
                        response.setComparisonLabel("dibanding periode sebelumnya");
                }

                // MINI CHART

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