package com.meubelpendawa.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.meubelpendawa.model.LoginLog;

public interface LoginLogRepository extends JpaRepository<LoginLog, String> {

        //digunakan untuk riwayat per karyawan
        List<LoginLog> findByKaryawan_IdKaryawan(String idKaryawan);

        //dipakai saat logout
        Optional<LoginLog> findTopByKaryawan_IdKaryawanAndLogoutAtIsNullOrderByLoginAtDesc(
                        String idKaryawan);

        //dipakai halaman owner kalau mau pake
        List<LoginLog> findAllByOrderByLoginAtDesc();

        //tambahan jika nanti ingin filter hanya login yang masih aktif
        List<LoginLog> findByLogoutAtIsNullOrderByLoginAtDesc();

        //tambahan jika nanti ingin filter login aktif per karyawan
        List<LoginLog> findByKaryawan_IdKaryawanAndLogoutAtIsNullOrderByLoginAtDesc(
                        String idKaryawan);

        LoginLog findFirstByOrderByIdLogDesc();
}