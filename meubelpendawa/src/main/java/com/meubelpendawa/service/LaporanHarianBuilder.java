package com.meubelpendawa.service;

import com.meubelpendawa.dto.LaporanHarianDTO;

public interface LaporanHarianBuilder {

    byte[] generatePdf(LaporanHarianDTO laporan);

}