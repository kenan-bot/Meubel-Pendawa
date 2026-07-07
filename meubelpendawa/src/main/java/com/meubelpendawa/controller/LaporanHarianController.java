package com.meubelpendawa.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.meubelpendawa.service.LaporanHarianService;

@RestController
@RequestMapping("/api/laporan-harian")
public class LaporanHarianController {

    private final LaporanHarianService laporanHarianService;

    public LaporanHarianController(
            LaporanHarianService laporanHarianService) {

        this.laporanHarianService = laporanHarianService;
    }

    @PostMapping("/export")
    public ResponseEntity<?> exportLaporanHarian() {

        try {

            laporanHarianService.exportLaporanHarian();

            return ResponseEntity.ok(
                    new ApiResponse(
                            true,
                            "Laporan harian berhasil dikirim ke email perusahaan."));

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

        public ApiResponse(
                boolean success,
                String message) {

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
}