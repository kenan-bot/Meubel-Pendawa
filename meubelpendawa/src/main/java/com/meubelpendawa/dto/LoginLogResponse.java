package com.meubelpendawa.dto;

import java.time.LocalDateTime;

public class LoginLogResponse {

    private String idLog;
    private String idKaryawan;
    private String namaKaryawan;
    private String role;

    private LocalDateTime loginAt;
    private LocalDateTime logoutAt;

    private Boolean loginDiluarJamOperasional;
    private Boolean logoutDiluarJamOperasional;

    private String status;
    private String durasi;

    public LoginLogResponse() {
    }

    public LoginLogResponse(
            String idLog,
            String idKaryawan,
            String namaKaryawan,
            String role,
            LocalDateTime loginAt,
            LocalDateTime logoutAt,
            Boolean loginDiluarJamOperasional,
            Boolean logoutDiluarJamOperasional,
            String status,
            String durasi) {

        this.idLog = idLog;
        this.idKaryawan = idKaryawan;
        this.namaKaryawan = namaKaryawan;
        this.role = role;
        this.loginAt = loginAt;
        this.logoutAt = logoutAt;
        this.loginDiluarJamOperasional = loginDiluarJamOperasional;
        this.logoutDiluarJamOperasional = logoutDiluarJamOperasional;
        this.status = status;
        this.durasi = durasi;
    }

    public String getIdLog() {
        return idLog;
    }

    public void setIdLog(String idLog) {
        this.idLog = idLog;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getLoginAt() {
        return loginAt;
    }

    public void setLoginAt(LocalDateTime loginAt) {
        this.loginAt = loginAt;
    }

    public LocalDateTime getLogoutAt() {
        return logoutAt;
    }

    public void setLogoutAt(LocalDateTime logoutAt) {
        this.logoutAt = logoutAt;
    }

    public Boolean getLoginDiluarJamOperasional() {
        return loginDiluarJamOperasional;
    }

    public void setLoginDiluarJamOperasional(Boolean loginDiluarJamOperasional) {
        this.loginDiluarJamOperasional = loginDiluarJamOperasional;
    }

    public Boolean getLogoutDiluarJamOperasional() {
        return logoutDiluarJamOperasional;
    }

    public void setLogoutDiluarJamOperasional(Boolean logoutDiluarJamOperasional) {
        this.logoutDiluarJamOperasional = logoutDiluarJamOperasional;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDurasi() {
        return durasi;
    }

    public void setDurasi(String durasi) {
        this.durasi = durasi;
    }
}