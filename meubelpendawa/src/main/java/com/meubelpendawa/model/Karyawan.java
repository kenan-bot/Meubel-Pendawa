package com.meubelpendawa.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.EnumType;


import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "karyawan")
@Getter 
@Setter 
@NoArgsConstructor
public class Karyawan {

    @Id
    private String idKaryawan;

    private String namaKaryawan;

    @Column(unique = true)
    private String email;

    private Boolean aksesSistem;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(unique = true)
    private String username;

    private String password;

    private Boolean statusAktif;

    private LocalDateTime tanggalNonaktif;

    // 2. TETAP PERTAHANKAN Constructor utama Anda ini agar kode di
    // Service/Controller tidak error
    public Karyawan(String namaKaryawan, String email, Boolean aksesSistem, Role role, String username,
            String password, Boolean statusAktif, LocalDateTime tanggalNonaktif) {
        this.namaKaryawan = namaKaryawan;
        this.email = email;
        this.aksesSistem = aksesSistem;
        this.role = role;
        this.username = username;
        this.password = password;
        this.statusAktif = statusAktif;
        this.tanggalNonaktif = tanggalNonaktif;
    }

    // Semua Getter & Setter manual di bawah ini SUDAH AMAN DIHAPUS TOTAL.
}
