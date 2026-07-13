package com.meubelpendawa.service;

import java.util.List;

import com.meubelpendawa.dto.dashboard.DashboardMerekPopulerResponse;
import com.meubelpendawa.dto.dashboard.DashboardPengirimanResponse;
import com.meubelpendawa.dto.dashboard.DashboardProdukTerlarisResponse;
import com.meubelpendawa.dto.dashboard.DashboardTransaksiTerbesarResponse;

public interface DashboardService {

    DashboardPengirimanResponse getPengirimanBelumSelesai();

    DashboardTransaksiTerbesarResponse getTransaksiTerbesarHariIni();

    List<DashboardProdukTerlarisResponse> getProdukTerlarisBulanIni();

    List<DashboardMerekPopulerResponse> getMerekPopulerBulanIni();
}