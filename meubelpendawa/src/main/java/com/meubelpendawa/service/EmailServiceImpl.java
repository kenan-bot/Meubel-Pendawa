package com.meubelpendawa.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;

@Service
public class EmailServiceImpl implements EmailService {

    private final Resend resend;

    public EmailServiceImpl(
            @Value("${resend.api.key}") String apiKey) {

        this.resend = new Resend(apiKey);
    }

    @Override
    public void sendEmail(
            String to,
            String subject,
            String htmlContent) {

        try {

            CreateEmailOptions params = CreateEmailOptions.builder()
                    .from("onboarding@resend.dev")
                    .to(to)
                    .subject(subject)
                    .html(htmlContent)
                    .build();

            resend.emails().send(params);

        } catch (Exception e) {
            throw new RuntimeException(
                    "Gagal mengirim email ke " + to,
                    e);
        }
    }
    
}