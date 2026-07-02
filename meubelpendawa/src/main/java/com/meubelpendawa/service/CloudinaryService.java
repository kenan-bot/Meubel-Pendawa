package com.meubelpendawa.service;

import java.io.IOException;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.cloudinary.Cloudinary;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) throws IOException {

        String contentType = file.getContentType();

        if (contentType == null ||
                (!contentType.equals("image/jpeg")
                        && !contentType.equals("image/png")
                        && !contentType.equals("image/webp"))) {

            throw new RuntimeException(
                    "Format file harus JPG, PNG, atau WEBP");
        }

        long maxSize = 5 * 1024 * 1024; // 5 MB

        if (file.getSize() > maxSize) {
            throw new RuntimeException(
                    "Ukuran file maksimal 5 MB");
        }

        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                Map.of());

        return uploadResult.get("secure_url").toString();
    }
}