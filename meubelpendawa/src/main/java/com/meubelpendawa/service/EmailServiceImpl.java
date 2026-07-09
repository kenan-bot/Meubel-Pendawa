package com.meubelpendawa.service;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class EmailServiceImpl implements EmailService {

        @Value("${brevo.api.key}")
        private String apiKey;

        @Value("${spring.mail.from}")
        private String fromEmail;

        @Value("${spring.mail.from.name}")
        private String fromName;

        private final RestTemplate restTemplate = new RestTemplate();

        @Override
        public void sendEmail(
                        String to,
                        String subject,
                        String htmlContent) {

                try {

                        HttpHeaders headers = new HttpHeaders();
                        headers.setContentType(MediaType.APPLICATION_JSON);
                        headers.set("api-key", apiKey);

                        Map<String, Object> body = new HashMap<>();

                        body.put("sender", Map.of(
                                        "name", fromName,
                                        "email", fromEmail));

                        body.put("to", List.of(
                                        Map.of("email", to)));

                        body.put("subject", subject);
                        body.put("htmlContent", htmlContent);

                        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

                        restTemplate.postForEntity(
                                        "https://api.brevo.com/v3/smtp/email",
                                        request,
                                        String.class);

                } catch (Exception e) {

                        throw new RuntimeException(
                                        "Gagal mengirim email ke " + to,
                                        e);

                }
        }

        @Override
        public void sendEmailWithAttachment(
                        String to,
                        String subject,
                        String htmlContent,
                        String attachmentFilename,
                        byte[] attachmentBytes,
                        String attachmentContentType) {

                try {

                        HttpHeaders headers = new HttpHeaders();
                        headers.setContentType(MediaType.APPLICATION_JSON);
                        headers.set("api-key", apiKey);

                        String encodedFile = Base64.getEncoder()
                                        .encodeToString(attachmentBytes);

                        Map<String, Object> body = new HashMap<>();

                        body.put("sender", Map.of(
                                        "name", fromName,
                                        "email", fromEmail));

                        body.put("to", List.of(
                                        Map.of("email", to)));

                        body.put("subject", subject);
                        body.put("htmlContent", htmlContent);

                        body.put("attachment", List.of(
                                        Map.of(
                                                        "name", attachmentFilename,
                                                        "content", encodedFile)));

                        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

                        restTemplate.postForEntity(
                                        "https://api.brevo.com/v3/smtp/email",
                                        request,
                                        String.class);

                } catch (Exception e) {

                        throw new RuntimeException(
                                        "Gagal mengirim email (lampiran) ke " + to,
                                        e);

                }
        }
}