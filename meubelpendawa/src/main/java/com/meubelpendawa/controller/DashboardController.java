package com.meubelpendawa.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.meubelpendawa.dto.dashboard.DashboardDeliveryResponse;
import com.meubelpendawa.dto.dashboard.DashboardMerekPopulerResponse;
import com.meubelpendawa.dto.dashboard.DashboardPengirimanResponse;
import com.meubelpendawa.dto.dashboard.DashboardProdukTerlarisResponse;
import com.meubelpendawa.dto.dashboard.DashboardStokMenipisResponse;
import com.meubelpendawa.dto.dashboard.DashboardTrafikTransaksiResponse;
import com.meubelpendawa.dto.dashboard.DashboardTransaksiTerbaruResponse;
import com.meubelpendawa.dto.dashboard.DashboardTransaksiTerbesarResponse;
import com.meubelpendawa.dto.dashboard.DashboardWilayahPelangganResponse;
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

    @GetMapping("/transaksi-terbaru")
    public List<DashboardTransaksiTerbaruResponse> getTransaksiTerbaru() {

        return dashboardService
                .getTransaksiTerbaru();
    }

    @GetMapping("/wilayah-pelanggan")
    public List<DashboardWilayahPelangganResponse> getTopWilayahPelanggan() {

        return dashboardService.getTopWilayahPelanggan();
    }

    @GetMapping("/delivery-vs-pickup")
    public ResponseEntity<DashboardDeliveryResponse> getDeliveryVsPickup() {

        return ResponseEntity.ok(
                dashboardService.getDeliveryVsPickup());
    }

    @GetMapping("/stok-menipis")
    public ResponseEntity<List<DashboardStokMenipisResponse>> getStokMenipis() {

        return ResponseEntity.ok(
                dashboardService.getStokMenipis());
    }

    @GetMapping("/trafik-mingguan")
    public List<DashboardTrafikTransaksiResponse> getTrafikTransaksiMingguan() {

        return dashboardService.getTrafikTransaksiMingguan();
    }
}