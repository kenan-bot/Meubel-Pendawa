package com.meubelpendawa.service;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.meubelpendawa.dto.LoginRequest;
import com.meubelpendawa.dto.LoginResponse;
import com.meubelpendawa.model.Karyawan;
import com.meubelpendawa.repository.KaryawanRepository;
import com.meubelpendawa.security.JwtService;
import com.meubelpendawa.service.LoginLogService;

@Service
public class AuthService {

    @Autowired
    private KaryawanRepository karyawanRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private LoginLogService loginLogService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public LoginResponse login(LoginRequest request) {

        Optional<Karyawan> optionalKaryawan = karyawanRepository.findByUsername(request.getUsername());

        if (optionalKaryawan.isEmpty()) {
            return new LoginResponse(false, "Username atau password salah", null, null, null, null);
        }

        Karyawan karyawan = optionalKaryawan.get();

        if (!karyawan.getStatusAktif()) {
            return new LoginResponse(false, "Akun tidak aktif", null, null, null, null);
        }

        if (!karyawan.getAksesSistem()) {
            return new LoginResponse(false, "Akses sistem ditolak", null, null, null, null);
        }

        boolean cocok = passwordEncoder.matches(request.getPassword(), karyawan.getPassword());

        if (!cocok) {
            return new LoginResponse(false, "Username atau password salah", null, null, null, null);
        }

        String token = jwtService.generateToken(
                karyawan.getIdKaryawan(),
                karyawan.getRole().name());

        loginLogService.catatLogin(karyawan);

        return new LoginResponse(true, "Login berhasil", token, karyawan.getIdKaryawan(), karyawan.getNamaKaryawan(),
                karyawan.getRole().name());

    }

    public void logout(String idKaryawan) {
        loginLogService.catatLogout(idKaryawan);
    }

    public LoginResponse getCurrentUser(String token) {

        String idKaryawan = jwtService.extractIdKaryawan(token);

        Karyawan karyawan = karyawanRepository.findById(idKaryawan)
                .orElseThrow(() -> new RuntimeException("Karyawan tidak ditemukan"));

        return new LoginResponse(
                true,
                "User ditemukan",
                null,
                karyawan.getIdKaryawan(),
                karyawan.getNamaKaryawan(),
                karyawan.getRole().name());
    }
}
