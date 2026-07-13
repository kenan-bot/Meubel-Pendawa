package com.meubelpendawa.controller;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.meubelpendawa.dto.dashboard.DashboardMerekPopulerResponse;
import com.meubelpendawa.dto.dashboard.DashboardPengirimanResponse;
import com.meubelpendawa.dto.dashboard.DashboardProdukTerlarisResponse;
import com.meubelpendawa.dto.dashboard.DashboardTransaksiTerbesarResponse;
import com.meubelpendawa.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(
            DashboardService dashboardService) {

        this.dashboardService = dashboardService;
    }

    @GetMapping("/pengiriman-belum-selesai")
    public DashboardPengirimanResponse getPengirimanBelumSelesai() {

        return dashboardService
                .getPengirimanBelumSelesai();
    }

    @GetMapping("/transaksi-terbesar")
    public DashboardTransaksiTerbesarResponse getTransaksiTerbesarHariIni() {

        return dashboardService
                .getTransaksiTerbesarHariIni();
    }

    @GetMapping("/produk-terlaris")
    public List<DashboardProdukTerlarisResponse> getProdukTerlarisBulanIni() {

        return dashboardService.getProdukTerlarisBulanIni();
    }

    @GetMapping("/merek-populer")
    public List<DashboardMerekPopulerResponse> getMerekPopulerBulanIni() {

        return dashboardService
                .getMerekPopulerBulanIni();
    }
}