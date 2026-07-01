package com.meubelpendawa.service;

public interface EmailService {

    void sendEmail(
            String to,
            String subject,
            String htmlContent
    );
}