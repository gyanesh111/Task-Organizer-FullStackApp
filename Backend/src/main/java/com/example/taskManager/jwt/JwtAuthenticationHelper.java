package com.example.taskManager.jwt;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtAuthenticationHelper {

    private final SecretKey secretKey;

    @Value("${jwt.token.validity}")
    private long jwtTokenValidity;

    @Value("${jwt.refresh.token.validity}")
    private long refreshTokenValidity;

    public JwtAuthenticationHelper(@Value("${jwt.secret}") String secretKeyString) {
        this.secretKey = generateSecretKey(secretKeyString);
    }

    private SecretKey generateSecretKey(String secret) {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            throw new IllegalArgumentException("Secret key must be at least 32 bytes for HS256");
        }
        return Keys.hmacShaKeyFor(keyBytes); // Secure key generation for HS256
    }

    public String generateToken(String email, String userId) {
        return createToken(email, userId, jwtTokenValidity);
    }

    public String generateRefreshToken(String email, String userId) {
        return createToken(email, userId, refreshTokenValidity);
    }

    private String createToken(String email, String userId, long validity) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + validity))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    public String getUserIdFromToken(String token) {
        return getClaimsFromToken(token).get("userId", String.class);
    }

    private Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isTokenExpired(String token) {
        return getClaimsFromToken(token).getExpiration().before(new Date());
    }

    public boolean isTokenValid(String token) {
        try {
            getClaimsFromToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
