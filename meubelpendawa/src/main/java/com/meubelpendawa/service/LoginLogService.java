package com.meubelpendawa.service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;
import com.meubelpendawa.dto.LoginLogResponse;
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

    public void autoLogoutIfStillActive(String idKaryawan) {

        loginLogRepository
                .findTopByKaryawan_IdKaryawanAndLogoutAtIsNullOrderByLoginAtDesc(idKaryawan)
                .ifPresent(log -> {

                    log.setLogoutAt(LocalDateTime.now());

                    loginLogRepository.save(log);

                });
    }

    public List<LoginLogResponse> getAllLog() {

        return loginLogRepository.findAllByOrderByLoginAtDesc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<LoginLogResponse> getLogByKaryawan(String idKaryawan) {

        return loginLogRepository.findByKaryawan_IdKaryawan(idKaryawan)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private LoginLogResponse convertToResponse(LoginLog log) {

        String status;
        String durasi;

        if (log.getLogoutAt() == null) {

            status = "Aktif";
            durasi = formatDurasi(
                    log.getLoginAt(),
                    LocalDateTime.now());

        } else {

            status = "Logout";
            durasi = formatDurasi(
                    log.getLoginAt(),
                    log.getLogoutAt());
        }

        Boolean logoutDiluarJamOperasional = null;

        if (log.getLogoutAt() != null) {

            LocalTime jamLogout = log.getLogoutAt().toLocalTime();

            logoutDiluarJamOperasional = jamLogout.isBefore(LocalTime.of(8, 0))
                    || jamLogout.isAfter(LocalTime.of(18, 0));
        }

        return new LoginLogResponse(

                log.getIdLog(),
                log.getKaryawan().getIdKaryawan(),
                log.getKaryawan().getNamaKaryawan(),
                log.getKaryawan().getRole().name(),
                log.getLoginAt(),
                log.getLogoutAt(),
                log.getLoginDiluarJamOperasional(),
                logoutDiluarJamOperasional,
                status,
                durasi);
    }

    private String formatDurasi(LocalDateTime mulai, LocalDateTime selesai) {

        java.time.Duration duration = java.time.Duration.between(mulai, selesai);

        long totalDetik = duration.getSeconds();

        long jam = totalDetik / 3600;
        long menit = (totalDetik % 3600) / 60;
        long detik = totalDetik % 60;

        StringBuilder hasil = new StringBuilder();

        if (jam > 0) {
            hasil.append(jam).append(" jam ");
        }

        if (menit > 0) {
            hasil.append(menit).append(" menit ");
        }

        if (detik > 0 || hasil.length() == 0) {
            hasil.append(detik).append(" detik");
        }

        return hasil.toString().trim();
    }

}