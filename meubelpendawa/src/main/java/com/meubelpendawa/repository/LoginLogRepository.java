package com.meubelpendawa.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.meubelpendawa.model.LoginLog;

public interface LoginLogRepository extends JpaRepository<LoginLog, String> {

        // Digunakan untuk riwayat per karyawan
        List<LoginLog> findByKaryawan_IdKaryawan(String idKaryawan);

        // Dipakai saat logout
        Optional<LoginLog> findTopByKaryawan_IdKaryawanAndLogoutAtIsNullOrderByLoginAtDesc(
                        String idKaryawan);

        // Dipakai halaman owner kalau mau pake
        List<LoginLog> findAllByOrderByLoginAtDesc();

        // Tambahan jika nanti ingin filter hanya login yang masih aktif
        List<LoginLog> findByLogoutAtIsNullOrderByLoginAtDesc();

        // Tambahan jika nanti ingin filter login aktif per karyawan
        List<LoginLog> findByKaryawan_IdKaryawanAndLogoutAtIsNullOrderByLoginAtDesc(
                        String idKaryawan);

        LoginLog findFirstByOrderByIdLogDesc();
}