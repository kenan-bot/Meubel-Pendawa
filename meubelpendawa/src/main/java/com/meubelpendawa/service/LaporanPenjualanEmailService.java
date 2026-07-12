package com.meubelpendawa.service;

import java.time.LocalDateTime;

public interface LaporanPenjualanEmailService {

    void kirimLaporan(
            LocalDateTime startDate,
            LocalDateTime endDate);

}