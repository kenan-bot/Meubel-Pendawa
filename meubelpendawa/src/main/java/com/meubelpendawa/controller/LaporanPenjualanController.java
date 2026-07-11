package com.meubelpendawa.controller;

import com.meubelpendawa.dto.LaporanPenjualanSummaryResponse;
import com.meubelpendawa.service.LaporanPenjualanService;

import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import com.meubelpendawa.dto.LaporanPenjualanDetailResponse;

@RestController
@RequestMapping("/api/laporan-penjualan")
public class LaporanPenjualanController {

    private final LaporanPenjualanService laporanPenjualanService;

    public LaporanPenjualanController(
            LaporanPenjualanService laporanPenjualanService) {

        this.laporanPenjualanService = laporanPenjualanService;
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
}