package com.meubelpendawa.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.meubelpendawa.service.CloudinaryService;

@RestController
@RequestMapping("/upload")
@CrossOrigin("*")
public class UploadController {

    @Autowired
    private CloudinaryService cloudinaryService;

    @PostMapping
    public Map<String, String> upload(@RequestParam("file") MultipartFile file) throws IOException {
        String url = cloudinaryService.uploadFile(file);

        return Map.of("url", url);
    }
}