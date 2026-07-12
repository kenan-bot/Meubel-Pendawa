package com.meubelpendawa.service;

import java.time.LocalDateTime;

public interface LaporanPenjualanPdfService {

    /**
     * Membuat laporan penjualan dalam bentuk PDF
     * kemudian mengirimkannya ke email perusahaan.
     */
    void exportLaporanPenjualan(
            LocalDateTime startDate,
            LocalDateTime endDate);

}