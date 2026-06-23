package com.meubelpendawa.dto;

public class LoginResponse {

    private Boolean success;
    private String message;
    private String idKaryawan;
    private String namaKaryawan;
    private String role;

    public LoginResponse() {
    }

    public LoginResponse(Boolean success, String message, String idKaryawan, String namaKaryawan, String role) {
        this.success = success;
        this.message = message;
        this.idKaryawan = idKaryawan;
        this.namaKaryawan = namaKaryawan;
        this.role = role;
    }

    public Boolean isSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
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

}
