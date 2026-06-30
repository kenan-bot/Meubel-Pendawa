package com.meubelpendawa.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.EnumType;

@Entity
@Table(name = "karyawan")
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

    public Karyawan() {
    }

    public Karyawan(String namaKaryawan, String email, Boolean aksesSistem, Role role, String username,
            String password, Boolean statusAktif) {
        this.namaKaryawan = namaKaryawan;
        this.email = email;
        this.aksesSistem = aksesSistem;
        this.role = role;
        this.username = username;
        this.password = password;
        this.statusAktif = statusAktif;
    }

    public String getIdKaryawan() {
        return idKaryawan;
    }

    public void setIdKaryawan(String idKaryawan) {
        this.idKaryawan = idKaryawan;
    }

    public String getNamaKaryawan() {
        return namaKaryawan;
    }

    public void setNamaKaryawan(String namaKaryawan) {
        this.namaKaryawan = namaKaryawan;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getAksesSistem() {
        return aksesSistem;
    }

    public void setAksesSistem(Boolean aksesSistem) {
        this.aksesSistem = aksesSistem;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Boolean getStatusAktif() {
        return statusAktif;
    }

    public void setStatusAktif(Boolean statusAktif) {
        this.statusAktif = statusAktif;
    }

}