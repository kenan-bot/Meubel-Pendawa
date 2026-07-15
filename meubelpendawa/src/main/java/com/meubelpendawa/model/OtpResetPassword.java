package com.meubelpendawa.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "otp_reset_password")
@Getter             
@Setter             
@NoArgsConstructor  
public class OtpResetPassword {

    @Id
    private String idOtp;

    private String email;

    private String kodeOtp;

    private LocalDateTime expiredAt;

    private Boolean used;

    private Boolean verified;

}
