package com.meubelpendawa.dto.dashboard;

import java.util.List;

public class DashboardTrafikResponse {

    // Ringkasan statistik
    private DashboardTrafikSummaryResponse summary;

    // Data line chart
    private List<DashboardTrafikTransaksiResponse> chart;

    public DashboardTrafikResponse() {
    }

    public DashboardTrafikResponse(
            DashboardTrafikSummaryResponse summary,
            List<DashboardTrafikTransaksiResponse> chart) {

        this.summary = summary;
        this.chart = chart;
    }

    public DashboardTrafikSummaryResponse getSummary() {
        return summary;
    }

    public void setSummary(DashboardTrafikSummaryResponse summary) {
        this.summary = summary;
    }

    public List<DashboardTrafikTransaksiResponse> getChart() {
        return chart;
    }

    public void setChart(List<DashboardTrafikTransaksiResponse> chart) {
        this.chart = chart;
    }

}