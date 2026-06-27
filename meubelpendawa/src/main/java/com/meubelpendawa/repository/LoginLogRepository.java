package com.meubelpendawa.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.meubelpendawa.model.LoginLog;

public interface LoginLogRepository extends JpaRepository<LoginLog, String> {

    List<LoginLog> findByKaryawan_IdKaryawan(String idKaryawan);

    Optional<LoginLog> findTopByKaryawan_IdKaryawanAndLogoutAtIsNullOrderByLoginAtDesc(
            String idKaryawan);
            
    List<LoginLog> findAllByOrderByLoginAtDesc();

}