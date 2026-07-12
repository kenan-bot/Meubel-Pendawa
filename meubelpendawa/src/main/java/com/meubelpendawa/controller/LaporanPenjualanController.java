package com.meubelpendawa.controller;

import com.meubelpendawa.dto.LaporanPenjualanSummaryResponse;
import com.meubelpendawa.dto.LaporanPenjualanTrenResponse;
import com.meubelpendawa.service.LaporanPenjualanPdfGenerator;
import org.springframework.http.MediaType;
import com.meubelpendawa.service.LaporanPenjualanService;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.meubelpendawa.dto.LaporanPenjualanPdfData;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Locale;

import com.meubelpendawa.dto.KontribusiProdukResponse;
import com.meubelpendawa.dto.LaporanPenjualanDetailResponse;

@RestController
@RequestMapping("/api/laporan-penjualan")
public class LaporanPenjualanController {

        private final LaporanPenjualanService laporanPenjualanService;

        private final LaporanPenjualanPdfGenerator pdfGenerator;

        public LaporanPenjualanController(
                        LaporanPenjualanService laporanPenjualanService,
                        LaporanPenjualanPdfGenerator pdfGenerator) {

                this.laporanPenjualanService = laporanPenjualanService;
                this.pdfGenerator = pdfGenerator;
        }

        @GetMapping("/summary")
        public ResponseEntity<LaporanPenjualanSummaryResponse> getSummary(
                        @RequestParam(required = false) String startDate,
                        @RequestParam(required = false) String endDate) {

                if (startDate == null || endDate == null) {
                        return ResponseEntity.ok(
                                        laporanPenjualanService.getSummary());
                }

                return ResponseEntity.ok(
                                laporanPenjualanService.getSummary(
                                                LocalDateTime.parse(startDate),
                                                LocalDateTime.parse(endDate)));
        }

        @GetMapping("/detail")
        public ResponseEntity<List<LaporanPenjualanDetailResponse>> getDetailPenjualan(
                        @RequestParam String startDate,
                        @RequestParam String endDate) {

                return ResponseEntity.ok(
                                laporanPenjualanService.getDetailPenjualan(
                                                LocalDateTime.parse(startDate),
                                                LocalDateTime.parse(endDate)));
        }

        @GetMapping("/export-pdf")
        public ResponseEntity<byte[]> exportPdf(
                        @RequestParam String startDate,
                        @RequestParam String endDate) {

                LocalDateTime start = LocalDateTime.parse(startDate);
                LocalDateTime end = LocalDateTime.parse(endDate);

                LaporanPenjualanPdfData data = new LaporanPenjualanPdfData();

                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM yyyy", new Locale("id", "ID"));

                data.setPeriode(
                                start.format(formatter)
                                                + " s/d "
                                                + end.format(formatter));

                DateTimeFormatter cetakFormatter = DateTimeFormatter.ofPattern(
                                "dd MMMM yyyy HH:mm",
                                Locale.forLanguageTag("id-ID"));

                data.setTanggalCetak(
                                LocalDateTime.now()
                                                .format(cetakFormatter));

                data.setSummary(
                                laporanPenjualanService.getSummary(
                                                start,
                                                end));

                data.setTopProduk(
                                laporanPenjualanService.getKontribusiProduk(
                                                start,
                                                end));

                data.setTrenPenjualan(
                                laporanPenjualanService.getTrenPenjualan(
                                                start,
                                                end));

                data.setDetailPenjualan(
                                laporanPenjualanService.getDetailPenjualan(
                                                start,
                                                end));

                byte[] pdf = pdfGenerator.generate(data);

                return ResponseEntity.ok()
                                .header(
                                                "Content-Disposition",
                                                "attachment; filename=laporan-penjualan.pdf")
                                .contentType(MediaType.APPLICATION_PDF)
                                .body(pdf);
        }

        @GetMapping("/kontribusi-produk")
        public ResponseEntity<List<KontribusiProdukResponse>> getKontribusiProduk(
                        @RequestParam String startDate,
                        @RequestParam String endDate) {

                return ResponseEntity.ok(
                                laporanPenjualanService.getKontribusiProduk(
                                                LocalDateTime.parse(startDate),
                                                LocalDateTime.parse(endDate)));
        }

        @GetMapping("/tren")
        public ResponseEntity<List<LaporanPenjualanTrenResponse>> getTrenPenjualan(
                        @RequestParam String startDate,
                        @RequestParam String endDate) {

                return ResponseEntity.ok(
                                laporanPenjualanService.getTrenPenjualan(
                                                LocalDateTime.parse(startDate),
                                                LocalDateTime.parse(endDate)));
        }

}