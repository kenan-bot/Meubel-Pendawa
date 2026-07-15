package com.meubelpendawa.service;

import java.util.List;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.time.format.DateTimeFormatter;

import com.meubelpendawa.model.Transaksi;

import org.springframework.stereotype.Service;

import com.meubelpendawa.dto.dashboard.DashboardTrafikResponse;
import com.meubelpendawa.dto.dashboard.DashboardTrafikSummaryResponse;
import com.meubelpendawa.dto.dashboard.DashboardTrafikTransaksiResponse;
import com.meubelpendawa.repository.TransaksiRepository;

@Service
public class DashboardTrafikServiceImpl implements DashboardTrafikService {
    // field
    private final TransaksiRepository transaksiRepository;

    // constant
    private static final DateTimeFormatter JAM_FORMAT = DateTimeFormatter.ofPattern("HH:mm");

    // constructor
    public DashboardTrafikServiceImpl(
            TransaksiRepository transaksiRepository) {

        this.transaksiRepository = transaksiRepository;
    }

    // Helper methods
    private String getNamaHari(DayOfWeek dayOfWeek) {

        return switch (dayOfWeek) {

            case MONDAY -> "Sen";

            case TUESDAY -> "Sel";

            case WEDNESDAY -> "Rab";

            case THURSDAY -> "Kam";

            case FRIDAY -> "Jum";

            case SATURDAY -> "Sab";

            case SUNDAY -> "Min";
        };
    }

    private String formatIntervalJam(
            LocalTime mulai,
            LocalTime selesai) {

        return JAM_FORMAT.format(mulai)
                + " - "
                + JAM_FORMAT.format(selesai);
    }

    private DashboardTrafikTransaksiResponse createEmptyBucket(
            LocalDateTime waktuBucket,
            LocalTime jamMulai,
            LocalTime jamSelesai) {

        DashboardTrafikTransaksiResponse dto = new DashboardTrafikTransaksiResponse();

        dto.setTanggal(waktuBucket.toLocalDate());

        dto.setHari(
                getNamaHari(
                        waktuBucket.getDayOfWeek()));

        dto.setIntervalJam(
                formatIntervalJam(
                        jamMulai,
                        jamSelesai));

        dto.setWaktu(waktuBucket);

        dto.setTotalTransaksi(0);

        dto.setTotalOmzet(0.0);

        dto.setRataRataTransaksi(0.0);

        dto.setTotalCash(0.0);

        dto.setTotalCashless(0.0);

        dto.setTransaksiTerakhir(null);

        return dto;
    }

    private Map<LocalDateTime, DashboardTrafikTransaksiResponse> buildEmptyBuckets() {

        Map<LocalDateTime, DashboardTrafikTransaksiResponse> buckets = new LinkedHashMap<>();

        LocalDate hariIni = LocalDate.now();

        LocalDate tanggalAwal = hariIni.minusDays(6);

        for (int hari = 0; hari < 7; hari++) {

            LocalDate tanggal = tanggalAwal.plusDays(hari);

            for (int offset = 0; offset < 12; offset++) {

                int jam = (6 + (offset * 2)) % 24;

                LocalDateTime waktuBucket = tanggal.atTime(jam, 0);

                DashboardTrafikTransaksiResponse dto = createEmptyBucket(
                        waktuBucket,
                        LocalTime.of(jam, 0),
                        LocalTime.of((jam + 2) % 24, 0));

                buckets.put(waktuBucket, dto);
            }
        }

        return buckets;
    }

    private LocalDateTime getBucketTime(LocalDateTime waktuTransaksi) {

        int jam = waktuTransaksi.getHour();

        jam = (jam / 2) * 2;

        if (jam < 6) {
            return waktuTransaksi
                    .toLocalDate()
                    .atTime(jam, 0);
        }

        return waktuTransaksi
                .toLocalDate()
                .atTime(jam, 0);
    }

    // method
    @Override
    public DashboardTrafikResponse getTrafikTransaksiMingguan() {

        LocalDate hariIni = LocalDate.now();

        LocalDate tanggalAwal = hariIni.minusDays(6);

        LocalDateTime startDate = tanggalAwal.atStartOfDay();

        LocalDateTime endDate = hariIni.atTime(LocalTime.MAX);

        LocalDate previousStart = tanggalAwal.minusDays(7);

        LocalDate previousEnd = tanggalAwal.minusDays(1);

        LocalDateTime previousStartDate = previousStart.atStartOfDay();

        LocalDateTime previousEndDate = previousEnd.atTime(LocalTime.MAX);

        Map<LocalDateTime, DashboardTrafikTransaksiResponse> buckets = buildEmptyBuckets();

        List<Transaksi> transaksiList = transaksiRepository.getTrafikTransaksi(
                startDate,
                endDate);

        Map<LocalDate, LocalDateTime> transaksiTerakhirPerHari = new HashMap<>();

        for (Transaksi transaksi : transaksiList) {

            LocalDateTime bucketTime = getBucketTime(transaksi.getTanggalTransaksi());

            DashboardTrafikTransaksiResponse bucket = buckets.get(bucketTime);

            LocalDate tanggal = transaksi.getTanggalTransaksi()
                    .toLocalDate();

            transaksiTerakhirPerHari.merge(
                    tanggal,
                    transaksi.getTanggalTransaksi(),
                    (lama, baru) -> baru.isAfter(lama)
                            ? baru
                            : lama);

            if (bucket == null) {
                continue;
            }

            // Konversi nominal sekali saja
            double nominal = transaksi.getTotalPesanan().doubleValue();

            // Total transaksi
            bucket.setTotalTransaksi(
                    bucket.getTotalTransaksi() + 1);

            // Total omzet
            bucket.setTotalOmzet(
                    bucket.getTotalOmzet() + nominal);

            // Cash / Cashless
            if ("CASH".equalsIgnoreCase(transaksi.getMetodePembayaran())) {

                bucket.setTotalCash(
                        bucket.getTotalCash() + nominal);

            } else {

                bucket.setTotalCashless(
                        bucket.getTotalCashless() + nominal);
            }

        }

        // Hitung rata-rata transaksi

        for (DashboardTrafikTransaksiResponse bucket : buckets.values()) {

            LocalDateTime waktu = bucket.getWaktu();

            LocalTime jamMulai = waktu.toLocalTime();

            LocalTime jamSelesai = jamMulai.plusHours(2);

            bucket.setTanggal(waktu.toLocalDate());

            bucket.setHari(
                    getNamaHari(waktu.getDayOfWeek()));

            bucket.setIntervalJam(
                    formatIntervalJam(
                            jamMulai,
                            jamSelesai));

            if (bucket.getTotalTransaksi() > 0) {

                bucket.setRataRataTransaksi(
                        bucket.getTotalOmzet()
                                / bucket.getTotalTransaksi());

            } else {

                bucket.setRataRataTransaksi(0.0);
            }

            bucket.setTransaksiTerakhir(
                    transaksiTerakhirPerHari.get(
                            waktu.toLocalDate()));
        }

        List<DashboardTrafikTransaksiResponse> chart = new ArrayList<>(buckets.values());

        DashboardTrafikSummaryResponse summary = new DashboardTrafikSummaryResponse();

        int totalTransaksi = 0;
        double totalOmzet = 0;

        for (DashboardTrafikTransaksiResponse bucket : chart) {

            totalTransaksi += bucket.getTotalTransaksi();

            totalOmzet += bucket.getTotalOmzet();
        }

        summary.setTotalTransaksi(totalTransaksi);
        summary.setTotalOmzet(totalOmzet);

        DashboardTrafikTransaksiResponse peakBucket = null;

        for (DashboardTrafikTransaksiResponse bucket : chart) {

            if (peakBucket == null
                    || bucket.getTotalTransaksi() > peakBucket.getTotalTransaksi()) {

                peakBucket = bucket;
            }
        }
        if (peakBucket != null) {

            summary.setPeakHari(
                    peakBucket.getHari());

            summary.setPeakInterval(
                    peakBucket.getIntervalJam());

            summary.setPeakTransaksi(
                    peakBucket.getTotalTransaksi());

            summary.setPeakOmzet(
                    peakBucket.getTotalOmzet());
        }

        Long previousTotal = transaksiRepository.countTransaksiBerhasil(
                previousStartDate,
                previousEndDate);

        double growth;

        if (previousTotal == null || previousTotal == 0) {

            growth = totalTransaksi > 0 ? 100.0 : 0.0;

        } else {

            growth = ((double) (totalTransaksi - previousTotal)
                    / previousTotal)
                    * 100.0;
        }

        summary.setPersentasePertumbuhan(growth);

        DashboardTrafikResponse response = new DashboardTrafikResponse();

        response.setSummary(summary);
        response.setChart(chart);

        return response;
    }
}