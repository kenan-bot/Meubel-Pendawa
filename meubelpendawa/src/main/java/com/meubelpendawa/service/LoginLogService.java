package com.meubelpendawa.service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.meubelpendawa.model.Karyawan;
import com.meubelpendawa.model.LoginLog;
import com.meubelpendawa.repository.LoginLogRepository;

@Service
public class LoginLogService {

    @Autowired
    private LoginLogRepository loginLogRepository;

    @Autowired
    private IdGeneratorService idGeneratorService;

    public LoginLog catatLogin(Karyawan karyawan) {

        long nomor = loginLogRepository.count() + 1;

        LocalTime sekarang = LocalTime.now();

        boolean diluarJamOperasional = sekarang.isBefore(LocalTime.of(8, 0))
                || sekarang.isAfter(LocalTime.of(18, 0));

        LoginLog log = new LoginLog();

        log.setIdLog(
                idGeneratorService.generateLoginLogId(nomor));

        log.setKaryawan(karyawan);
        log.setLoginAt(LocalDateTime.now());
        log.setLoginDiluarJamOperasional(diluarJamOperasional);

        return loginLogRepository.save(log);
    }

    public LoginLog catatLogout(String idKaryawan) {

        LoginLog log = loginLogRepository
                .findTopByKaryawan_IdKaryawanAndLogoutAtIsNullOrderByLoginAtDesc(idKaryawan)
                .orElseThrow(() -> new RuntimeException("Sesi login tidak ditemukan"));

        log.setLogoutAt(LocalDateTime.now());

        return loginLogRepository.save(log);
    }

    public List<LoginLog> getAllLog() {
        return loginLogRepository.findAllByOrderByLoginAtDesc();
    }

    public List<LoginLog> getLogByKaryawan(String idKaryawan) {
        return loginLogRepository.findByKaryawan_IdKaryawan(idKaryawan);
    }

}