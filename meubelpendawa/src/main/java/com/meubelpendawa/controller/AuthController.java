package com.meubelpendawa.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.meubelpendawa.dto.LoginRequest;
import com.meubelpendawa.dto.LoginResponse;
import com.meubelpendawa.dto.RequestOtpRequest;
import com.meubelpendawa.dto.ResetPasswordRequest;
import com.meubelpendawa.service.AuthService;
import com.meubelpendawa.service.OtpService;
import com.meubelpendawa.dto.VerifyOtpRequest;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final OtpService otpService;

    public AuthController(
            AuthService authService,
            OtpService otpService) {

        this.authService = authService;
        this.otpService = otpService;
    }

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request) {

        return authService.login(request);
    }

    @PostMapping("/request-otp")
    public ResponseEntity<?> requestOtp(
            @RequestBody RequestOtpRequest request) {

        otpService.kirimOtp(request.getEmail());

        return ResponseEntity.ok(
                "OTP berhasil dikirim");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestBody VerifyOtpRequest request) {

        boolean valid = otpService.verifikasiOtp(
                request.getEmail(),
                request.getKodeOtp());

        if (!valid) {
            return ResponseEntity.badRequest()
                    .body("OTP tidak valid atau sudah kadaluarsa");
        }

        return ResponseEntity.ok("OTP valid");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        authService.resetPassword(
                request.getEmail(),
                request.getPasswordBaru());

        return ResponseEntity.ok("Password berhasil diubah");
    }

    @PostMapping("/logout/{idKaryawan}")
    public String logout(
            @PathVariable String idKaryawan) {

        authService.logout(idKaryawan);

        return "Logout berhasil";
    }

    @GetMapping("/me")
    public LoginResponse me(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");

        return authService.getCurrentUser(token);
    }

}