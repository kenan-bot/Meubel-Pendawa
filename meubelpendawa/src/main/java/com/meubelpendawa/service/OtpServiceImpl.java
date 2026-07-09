package com.meubelpendawa.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.meubelpendawa.model.Karyawan;
import com.meubelpendawa.model.OtpResetPassword;
import com.meubelpendawa.repository.KaryawanRepository;
import com.meubelpendawa.repository.OtpResetPasswordRepository;

@Service
@Transactional
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

        SecureRandom random = new SecureRandom();

        int otp = 100000 + random.nextInt(900000);

        return String.valueOf(otp);
    }

    @Override
    public void kirimOtp(String email) {

        // Pastikan email terdaftar
        Karyawan karyawan = karyawanRepository
                .findByEmailAndAksesSistemTrue(email)
                .orElseThrow(() -> new RuntimeException("Email tidak ditemukan"));

        // Nonaktifkan seluruh OTP lama
        List<OtpResetPassword> otpAktif = otpRepository.findByEmailAndUsedFalse(email);

        for (OtpResetPassword otp : otpAktif) {
            otp.setUsed(true);
        }

        otpRepository.saveAll(otpAktif);

        // Generate OTP baru
        String kodeOtp = generateOtp();

        OtpResetPassword otpBaru = new OtpResetPassword();

        otpBaru.setIdOtp(UUID.randomUUID().toString());
        otpBaru.setEmail(email);
        otpBaru.setKodeOtp(kodeOtp);
        otpBaru.setExpiredAt(LocalDateTime.now().plusMinutes(5));
        otpBaru.setUsed(false);
        otpBaru.setVerified(false);

        otpRepository.save(otpBaru);

        // Email
        String subject = "Meubel Pendawa • Reset Password";

        String body = """
                <html>
                    <body style="font-family:Arial,sans-serif;line-height:1.6">
                        <h2 style="color:#FF6B00">
                            Reset Password
                        </h2>

                        <p>
                            Halo <b>%s</b>,
                        </p>

                        <p>
                            Gunakan kode OTP berikut untuk melakukan reset password:
                        </p>

                        <div style="
                            font-size:34px;
                            font-weight:bold;
                            letter-spacing:6px;
                            color:#FF6B00;
                            margin:24px 0;">
                            %s
                        </div>

                        <p>
                            OTP berlaku selama
                            <b>5 menit</b>.
                        </p>

                        <hr>

                        <small style="color:#888">
                            --- Meubel Pendawa ---
                        </small>
                    </body>
                </html>
                """
                .formatted(
                        karyawan.getNamaKaryawan(),
                        kodeOtp);

        emailService.sendEmail(
                email,
                subject,
                body);

        System.out.println("OTP : " + kodeOtp);
        System.out.println("Kirim email ke : " + email);

        emailService.sendEmail(
                email,
                subject,
                body);

        System.out.println("Selesai kirim email");
    }

    @Override
    public boolean verifikasiOtp(
            String email,
            String kodeOtp) {

        OtpResetPassword otp = otpRepository
                .findTopByEmailAndUsedFalseOrderByExpiredAtDesc(email)
                .orElse(null);

        if (otp == null) {
            return false;
        }

        // OTP sudah expired
        if (LocalDateTime.now().isAfter(otp.getExpiredAt())) {

            otp.setUsed(true);

            otpRepository.save(otp);

            return false;
        }

        // OTP salah
        if (!otp.getKodeOtp().equals(kodeOtp)) {
            return false;
        }

        // OTP berhasil digunakan
        otp.setVerified(true);

        otpRepository.save(otp);

        return true;
    }
}