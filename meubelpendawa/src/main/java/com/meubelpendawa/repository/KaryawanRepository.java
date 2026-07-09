package com.meubelpendawa.repository;

import com.meubelpendawa.model.Karyawan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface KaryawanRepository extends JpaRepository<Karyawan, String> {

    Optional<Karyawan> findByUsername(String username);
    List<Karyawan> findByNamaKaryawanContainingIgnoreCase(String namaKaryawan);
    Optional<Karyawan> findByEmailAndAksesSistemTrue(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Karyawan findFirstByOrderByIdKaryawanDesc();
}