package com.meubelpendawa.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private static final String SECRET = "meubelpendawa-secret-key-minimal-32-character";

    private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    public String generateToken(String idKaryawan, String role) {

        return Jwts.builder()
                .claim("idKaryawan", idKaryawan)
                .claim("role", role)
                .subject(idKaryawan)
                .issuedAt(new Date())
                .expiration(
                new Date(System.currentTimeMillis() + 86400000))
                .signWith(key)
                .compact();
    }
}