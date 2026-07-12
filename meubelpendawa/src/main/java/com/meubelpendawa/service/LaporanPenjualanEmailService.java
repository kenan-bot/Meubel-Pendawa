package com.meubelpendawa.service;

import java.time.LocalDateTime;

public interface LaporanPenjualanEmailService {

    void kirimLaporan(
            String emailTujuan,
            LocalDateTime startDate,
            LocalDateTime endDate);

}