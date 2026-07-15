package com.meubelpendawa.service;

import java.util.List;

import com.meubelpendawa.dto.dashboard.DashboardTrafikTransaksiResponse;

public interface DashboardTrafikService {

    List<DashboardTrafikTransaksiResponse> getTrafikTransaksiMingguan();

}