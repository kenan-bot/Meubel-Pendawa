package com.meubelpendawa.dto;

public class ResetPasswordRequest {
    private String passwordBaru;

    public ResetPasswordRequest() {
    }

    public String getPasswordBaru() {
        return passwordBaru;
    }

    public void setPasswordBaru(String passwordBaru) {
        this.passwordBaru = passwordBaru;
    }
}
