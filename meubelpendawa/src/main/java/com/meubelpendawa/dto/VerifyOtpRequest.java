package com.meubelpendawa.dto;

public class VerifyOtpRequest {

    private String email;
    private String kodeOtp;

    public VerifyOtpRequest() {
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
}