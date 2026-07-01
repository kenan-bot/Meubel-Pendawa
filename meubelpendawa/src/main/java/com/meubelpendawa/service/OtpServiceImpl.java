package com.meubelpendawa.service;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.meubelpendawa.model.Karyawan;
import com.meubelpendawa.model.OtpResetPassword;
import com.meubelpendawa.repository.KaryawanRepository;
import com.meubelpendawa.repository.OtpResetPasswordRepository;

@Service
public class OtpServiceImpl implements OtpService {

    private final OtpResetPasswordRepository otpRepository;
    private final KaryawanRepository karyawanRepository;
    private final EmailService emailService;

    public OtpServiceImpl(
            OtpResetPasswordRepository otpRepository,
            KaryawanRepository karyawanRepository,
            EmailService emailService) {

        this.otpRepository = otpRepository;
        this.karyawanRepository = karyawanRepository;
        this.emailService = emailService;
    }

    private String generateOtp() {

        int otp = 100000 + new Random().nextInt(900000);

        return String.valueOf(otp);
    }

    @Override
    public void kirimOtp(String email) {

        Karyawan karyawan = karyawanRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email tidak ditemukan"));

        String kodeOtp = generateOtp();

        OtpResetPassword otp = new OtpResetPassword();

        otp.setIdOtp(UUID.randomUUID().toString());
        otp.setEmail(email);
        otp.setKodeOtp(kodeOtp);
        otp.setExpiredAt(
                LocalDateTime.now().plusMinutes(5));
        otp.setUsed(false);
        otp.setVerified(false);

        otpRepository.save(otp);

        String subject = "Kode OTP Reset Password";

        String body = "Halo " + karyawan.getNamaKaryawan() +
                ",\n\nKode OTP Anda adalah: " +
                kodeOtp +
                "\n\nOTP berlaku selama 5 menit.";

        emailService.sendEmail(
                email,
                subject,
                body);
    }

    @Override
    public boolean verifikasiOtp(
            String email,
            String kodeOtp) {

        OtpResetPassword otp = otpRepository
                .findTopByEmailOrderByExpiredAtDesc(email)
                .orElse(null);

        if (otp == null) {
            return false;
        }

        if (otp.getUsed()) {
            return false;
        }

        if (LocalDateTime.now()
                .isAfter(otp.getExpiredAt())) {

            return false;
        }

        if (!otp.getKodeOtp()
                .equals(kodeOtp)) {

            return false;
        }

        otp.setVerified(true);

        otpRepository.save(otp);

        return true;
    }
}