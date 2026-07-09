package com.meubelpendawa.service;

import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    public void sendEmail(
            String to,
            String subject,
            String htmlContent) {

        try {

            System.out.println("======================================");
            System.out.println("EMAIL SERVICE");
            System.out.println("FROM    : " + fromEmail);
            System.out.println("TO      : " + to);
            System.out.println("SUBJECT : " + subject);
            System.out.println("======================================");

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);

            System.out.println("EMAIL BERHASIL DIKIRIM");

        } catch (Exception e) {

            System.out.println("EMAIL GAGAL DIKIRIM");
            e.printStackTrace();

            throw new RuntimeException("Gagal mengirim email ke " + to, e);
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

            System.out.println("======================================");
            System.out.println("EMAIL ATTACHMENT");
            System.out.println("FROM    : " + fromEmail);
            System.out.println("TO      : " + to);
            System.out.println("SUBJECT : " + subject);
            System.out.println("FILE    : " + attachmentFilename);
            System.out.println("SIZE    : " + attachmentBytes.length + " bytes");
            System.out.println("======================================");

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            helper.addAttachment(
                    attachmentFilename,
                    new ByteArrayDataSource(
                            attachmentBytes,
                            attachmentContentType));

            mailSender.send(message);

            System.out.println("EMAIL ATTACHMENT BERHASIL DIKIRIM");

        } catch (Exception e) {

            System.out.println("EMAIL ATTACHMENT GAGAL");
            e.printStackTrace();

            throw new RuntimeException(
                    "Gagal mengirim email (dengan lampiran) ke " + to,
                    e);
        }
    }
}