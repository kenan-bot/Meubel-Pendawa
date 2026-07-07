package com.meubelpendawa.service;

public interface LaporanHarianService {

    /**
     * Membuat laporan harian dalam bentuk PDF
     * kemudian mengirimkannya ke email perusahaan.
     */
    void exportLaporanHarian();

}