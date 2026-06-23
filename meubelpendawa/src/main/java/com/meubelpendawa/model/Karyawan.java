package com.meubelpendawa.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "karyawan")
public class Karyawan {

    @Id
    private String idKaryawan;

    private String namaKaryawan;

    private String noHp;

    private String alamat;

    private Boolean aksesSistem;

    private String role;

    private String username;

    private String password;

    private Boolean statusAktif;

    public Karyawan() {
    }

    public Karyawan(String namaKaryawan, String noHp, String alamat, Boolean aksesSistem, String role, String username, String password, Boolean statusAktif) {
        this.namaKaryawan = namaKaryawan;
        this.noHp = noHp;
        this.alamat = alamat;
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

    public String getNoHp() {
        return noHp;
    }

    public void setNoHp(String noHp) {
        this.noHp = noHp;
    }

    public String getAlamat() {
        return alamat;
    }

    public void setAlamat(String alamat) {
        this.alamat = alamat;
    }

    public Boolean getAksesSistem() {
        return aksesSistem;
    }

    public void setAksesSistem(Boolean aksesSistem) {
        this.aksesSistem = aksesSistem;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
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