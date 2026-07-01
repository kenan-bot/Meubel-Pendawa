package com.meubelpendawa.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "otp_reset_password")
public class OtpResetPassword {

    @Id
    private String idOtp;

    private String email;

    private String kodeOtp;

    private LocalDateTime expiredAt;

    private Boolean used;

    private Boolean verified;

    public OtpResetPassword() {
    }

    public String getIdOtp() {
        return idOtp;
    }

    public void setIdOtp(String idOtp) {
        this.idOtp = idOtp;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getKodeOtp() {
        return kodeOtp;
    }

    public void setKodeOtp(String kodeOtp) {
        this.kodeOtp = kodeOtp;
    }

    public LocalDateTime getExpiredAt() {
        return expiredAt;
    }

    public void setExpiredAt(LocalDateTime expiredAt) {
        this.expiredAt = expiredAt;
    }

    public Boolean getUsed() {
        return used;
    }

    public void setUsed(Boolean used) {
        this.used = used;
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }
}