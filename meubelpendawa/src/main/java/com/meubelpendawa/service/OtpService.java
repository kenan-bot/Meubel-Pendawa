package com.meubelpendawa.service;

public interface OtpService {

    void kirimOtp(String email);

    boolean verifikasiOtp(
            String email,
            String kodeOtp);
}
