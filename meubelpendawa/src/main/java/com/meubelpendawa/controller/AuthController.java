package com.meubelpendawa.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.meubelpendawa.dto.LoginRequest;
import com.meubelpendawa.dto.LoginResponse;
import com.meubelpendawa.service.AuthService;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request) {

        return authService.login(request);
    }

    @PostMapping("/logout/{idKaryawan}")
    public String logout(
            @PathVariable String idKaryawan) {

        authService.logout(idKaryawan);

        return "Logout berhasil";
    }
}