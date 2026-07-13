package com.meubelpendawa.service;

import org.springframework.stereotype.Service;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;

import com.meubelpendawa.dto.dashboard.DashboardPengirimanResponse;
import com.meubelpendawa.dto.dashboard.DashboardProdukTerlarisResponse;
import com.meubelpendawa.repository.DetailTransaksiRepository;
import com.meubelpendawa.repository.PengirimanRepository;
import com.meubelpendawa.repository.TransaksiRepository;

import com.meubelpendawa.dto.dashboard.DashboardTransaksiTerbesarResponse;
import com.meubelpendawa.model.Transaksi;

import java.time.LocalDate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Map;
import java.util.stream.Collectors;

import com.meubelpendawa.dto.dashboard.DashboardDriverResponse;
import com.meubelpendawa.dto.dashboard.DashboardMerekPopulerResponse;
import com.meubelpendawa.model.Pengiriman;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final PengirimanRepository pengirimanRepository;
    private final TransaksiRepository transaksiRepository;
    private final DetailTransaksiRepository detailTransaksiRepository;

    public DashboardServiceImpl(
            PengirimanRepository pengirimanRepository,
            TransaksiRepository transaksiRepository,
            DetailTransaksiRepository detailTransaksiRepository) {

        this.pengirimanRepository = pengirimanRepository;
        this.transaksiRepository = transaksiRepository;
        this.detailTransaksiRepository = detailTransaksiRepository;
    }

    // pengiriman

    @Override
    public DashboardPengirimanResponse getPengirimanBelumSelesai() {

        List<Pengiriman> semuaPengiriman = pengirimanRepository.findAll();

        List<Pengiriman> pengirimanAktif = semuaPengiriman.stream()
                .filter(p -> !"COMPLETED".equalsIgnoreCase(
                        p.getStatusPengiriman()))
                .toList();

        int totalAktif = pengirimanAktif.size();

        LocalDateTime batasTerlambat = LocalDateTime.now().minusDays(2);

        int totalTerlambat = (int) pengirimanAktif.stream()
                .filter(p -> p.getTransaksi() != null
                        && p.getTransaksi().getTanggalTransaksi() != null
                        && p.getTransaksi()
                                .getTanggalTransaksi()
                                .isBefore(batasTerlambat))
                .count();

        Map<String, Long> driverMap = pengirimanAktif.stream()
                .filter(p -> p.getDriver() != null)
                .collect(Collectors.groupingBy(
                        p -> p.getDriver().getNamaKaryawan(),
                        Collectors.counting()));

        List<DashboardDriverResponse> drivers = new ArrayList<>();

        driverMap.forEach((nama, total) -> {
            drivers.add(
                    new DashboardDriverResponse(
                            nama,
                            total.intValue()));
        });

        drivers.sort((a, b) -> b.getTotal().compareTo(
                a.getTotal()));

        DashboardPengirimanResponse response = new DashboardPengirimanResponse();

        response.setTotalAktif(totalAktif);
        response.setTotalTerlambat(totalTerlambat);
        response.setDrivers(drivers);

        return response;
    }

    // transaksi terbesar

    @Override
    public DashboardTransaksiTerbesarResponse getTransaksiTerbesarHariIni() {

        LocalDate hariIni = LocalDate.now();

        LocalDateTime awalHari = hariIni.atStartOfDay();
        LocalDateTime akhirHari = hariIni.atTime(23, 59, 59);

        List<Transaksi> transaksiHariIni = transaksiRepository
                .findByTanggalTransaksiBetweenAndStatusPembayaran(
                        awalHari,
                        akhirHari,
                        "SUCCESS");

        DashboardTransaksiTerbesarResponse response = new DashboardTransaksiTerbesarResponse();

        if (transaksiHariIni.isEmpty()) {
            return response;
        }

        Transaksi transaksiTerbesar = transaksiHariIni.stream()
                .max(Comparator.comparing(Transaksi::getTotalPesanan))
                .orElse(null);

        if (transaksiTerbesar == null) {
            return response;
        }

        response.setOrderId(transaksiTerbesar.getOrderId());
        response.setNamaPemesan(transaksiTerbesar.getNamaPemesan());
        response.setTotal(transaksiTerbesar.getTotalPesanan());
        response.setWaktuTransaksi(transaksiTerbesar.getTanggalTransaksi());
        response.setMetodePembayaran(transaksiTerbesar.getMetodePembayaran());

        return response;
    }

    // Produk terlaris
    @Override
    public List<DashboardProdukTerlarisResponse> getProdukTerlarisBulanIni() {

        LocalDate sekarang = LocalDate.now();

        List<Object[]> results = detailTransaksiRepository.getProdukTerlarisBulanIni(
                sekarang.getYear(),
                sekarang.getMonthValue());

        return results.stream()
                .limit(5)
                .map(row -> {

                    DashboardProdukTerlarisResponse dto = new DashboardProdukTerlarisResponse();

                    dto.setNamaProduk((String) row[0]);

                    dto.setTotalTerjual(
                            ((Number) row[1]).intValue());

                    dto.setTotalOmzet(
                            ((Number) row[2]).doubleValue());

                    return dto;
                })
                .toList();
    }

    // merek populer
    @Override
    public List<DashboardMerekPopulerResponse> getMerekPopulerBulanIni() {

        LocalDate sekarang = LocalDate.now();

        List<Object[]> results = detailTransaksiRepository.getMerekPopulerBulanIni(
                sekarang.getYear(),
                sekarang.getMonthValue());

        return results.stream()
                .limit(3)
                .map(row -> {

                    DashboardMerekPopulerResponse dto = new DashboardMerekPopulerResponse();

                    dto.setNamaMerek(
                            (String) row[0]);

                    dto.setTotalTerjual(
                            ((Number) row[1]).intValue());

                    return dto;
                })
                .toList();
    }
}