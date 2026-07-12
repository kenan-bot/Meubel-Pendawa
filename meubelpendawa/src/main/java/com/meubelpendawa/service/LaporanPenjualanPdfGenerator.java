package com.meubelpendawa.service;

import com.meubelpendawa.dto.LaporanPenjualanPdfData;

public interface LaporanPenjualanPdfGenerator {

    byte[] generate(LaporanPenjualanPdfData data);

}