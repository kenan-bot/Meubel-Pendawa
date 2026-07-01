package com.meubelpendawa.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.meubelpendawa.model.OtpResetPassword;

public interface OtpResetPasswordRepository
        extends JpaRepository<OtpResetPassword, String> {

    Optional<OtpResetPassword> findTopByEmailOrderByExpiredAtDesc(
            String email);
}