package com.meubelpendawa.service;

import com.meubelpendawa.dto.LaporanHarianDTO;

public interface LaporanHarianPdfGenerator {

    byte[] generate(LaporanHarianDTO laporan);

}