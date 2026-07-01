package com.meubelpendawa.controller;

import com.meubelpendawa.service.EmailService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EmailController {

    private final EmailService emailService;

    public EmailController(
            EmailService emailService
    ) {
        this.emailService = emailService;
    }

    @GetMapping("/test-email")
    public String testEmail(
            @RequestParam String email
    ) {

        emailService.sendEmail(
                email,
                "Test Email Meubel Pendawa",
                """
                <h2>Email berhasil dikirim 🎉</h2>
                <p>Integrasi Resend berhasil.</p>
                """
        );

        return "Email terkirim";
    }
}