package com.meubelpendawa.service;

public interface EmailService {

    void sendEmail(
            String to,
            String subject,
            String htmlContent
    );

    // [BARU] Kirim email dengan 1 lampiran file (dipakai untuk kirim struk PDF).
    void sendEmailWithAttachment(
            String to,
            String subject,
            String htmlContent,
            String attachmentFilename,
            byte[] attachmentBytes,
            String attachmentContentType
    );
}
