package com.meubelpendawa.model;

import java.time.LocalDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
@Table(name = "loginlog")
public class LoginLog {

    @Id
    private String idLog;

    @ManyToOne
    @JoinColumn(name = "idKaryawan")
    private Karyawan karyawan;

    private LocalDateTime loginAt;

    private LocalDateTime logoutAt;

    private Boolean loginDiluarJamOperasional;

    public LoginLog() {
    }

    public LoginLog(Karyawan karyawan,
                    LocalDateTime loginAt,
                    LocalDateTime logoutAt,
                    Boolean loginDiluarJamOperasional) {

        this.karyawan = karyawan;
        this.loginAt = loginAt;
        this.logoutAt = logoutAt;
        this.loginDiluarJamOperasional = loginDiluarJamOperasional;
    }

    public String getIdLog() {
        return idLog;
    }

    public void setIdLog(String idLog) {
        this.idLog = idLog;
    }

    public Karyawan getKaryawan() {
        return karyawan;
    }

    public void setKaryawan(Karyawan karyawan) {
        this.karyawan = karyawan;
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
}