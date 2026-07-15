package com.meubelpendawa.service;

import java.util.List;

import com.meubelpendawa.dto.dashboard.DashboardDeliveryResponse;
import com.meubelpendawa.dto.dashboard.DashboardMerekPopulerResponse;
import com.meubelpendawa.dto.dashboard.DashboardPengirimanResponse;
import com.meubelpendawa.dto.dashboard.DashboardProdukTerlarisResponse;
import com.meubelpendawa.dto.dashboard.DashboardStokMenipisResponse;
import com.meubelpendawa.dto.dashboard.DashboardTrafikTransaksiResponse;
import com.meubelpendawa.dto.dashboard.DashboardTransaksiTerbaruResponse;
import com.meubelpendawa.dto.dashboard.DashboardTransaksiTerbesarResponse;
import com.meubelpendawa.dto.dashboard.DashboardWilayahPelangganResponse;

public interface DashboardService {

    DashboardPengirimanResponse getPengirimanBelumSelesai();

    DashboardTransaksiTerbesarResponse getTransaksiTerbesarHariIni();

    List<DashboardProdukTerlarisResponse> getProdukTerlarisBulanIni();

    List<DashboardMerekPopulerResponse> getMerekPopulerBulanIni();

    List<DashboardTransaksiTerbaruResponse> getTransaksiTerbaru();

    List<DashboardWilayahPelangganResponse> getTopWilayahPelanggan();

    DashboardDeliveryResponse getDeliveryVsPickup();

    List<DashboardStokMenipisResponse> getStokMenipis();

    List<DashboardTrafikTransaksiResponse> getTrafikTransaksiMingguan();
}