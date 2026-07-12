package com.meubelpendawa.controller;

import com.meubelpendawa.dto.LaporanPenjualanSummaryResponse;
import com.meubelpendawa.dto.LaporanPenjualanTrenResponse;
import com.meubelpendawa.service.LaporanPenjualanEmailService;
import com.meubelpendawa.service.LaporanPenjualanService;

import java.time.LocalDateTime;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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

        private final LaporanPenjualanEmailService laporanEmailService;

        public LaporanPenjualanController(
                        LaporanPenjualanService laporanPenjualanService,
                        LaporanPenjualanEmailService laporanEmailService) {

                this.laporanPenjualanService = laporanPenjualanService;
                this.laporanEmailService = laporanEmailService;
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

        @PostMapping("/export")
        public ResponseEntity<?> exportLaporanPenjualan(
                        @RequestParam String startDate,
                        @RequestParam String endDate) {

                try {

                        laporanEmailService.kirimLaporan(
                                        LocalDateTime.parse(startDate),
                                        LocalDateTime.parse(endDate));

                        return ResponseEntity.ok(
                                        new ApiResponse(
                                                        true,
                                                        "Laporan penjualan berhasil dikirim ke email perusahaan."));

                } catch (Exception e) {

                        return ResponseEntity
                                        .internalServerError()
                                        .body(
                                                        new ApiResponse(
                                                                        false,
                                                                        e.getMessage()));
                }
        }

        static class ApiResponse {

                private boolean success;
                private String message;

                public ApiResponse(boolean success, String message) {
                        this.success = success;
                        this.message = message;
                }

                public boolean isSuccess() {
                        return success;
                }

                public String getMessage() {
                        return message;
                }
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