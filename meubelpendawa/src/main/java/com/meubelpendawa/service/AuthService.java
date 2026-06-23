package com.meubelpendawa.service;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.meubelpendawa.dto.LoginRequest;
import com.meubelpendawa.dto.LoginResponse;
import com.meubelpendawa.model.Karyawan;
import com.meubelpendawa.repository.KaryawanRepository;

@Service
public class AuthService {

    @Autowired
    private KaryawanRepository karyawanRepository;

    private final BCryptPasswordEncoder passwordEncoder = 
    new BCryptPasswordEncoder();

    public LoginResponse login(LoginRequest request) {

    Optional<Karyawan> optionalKaryawan = karyawanRepository.findByUsername(request.getUsername());

    if (optionalKaryawan.isEmpty()) {
        return new LoginResponse(false,"Username atau password salah",null,null,null);
    }

    Karyawan karyawan = optionalKaryawan.get();

    if (!karyawan.getStatusAktif()) {
        return new LoginResponse(false,"Akun tidak aktif",null,null,null);
    }

    if (!karyawan.getAksesSistem()) {
        return new LoginResponse(false,"Akses sistem ditolak",null,null,null);
    }

    boolean cocok = passwordEncoder.matches(request.getPassword(),karyawan.getPassword());

    if (!cocok) {
        return new LoginResponse(false,"Username atau password salah",null,null,null);
    }

    return new LoginResponse(true,"Login berhasil",karyawan.getIdKaryawan(),karyawan.getNamaKaryawan(),karyawan.getRole());
    }
}
