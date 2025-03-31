package com.example.taskManager.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.taskManager.service.EmailService;
import com.example.taskManager.service.OtpService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/otp")
public class OtpController {
    private final OtpService otpService;
    private final EmailService emailService; // Service to send OTP via email

    public OtpController(OtpService otpService, EmailService emailService) {
        this.otpService = otpService;
        this.emailService = emailService;
    }

    // ✅ Send OTP
    @GetMapping("/send")
    public ResponseEntity<?> sendOtp(@RequestParam String email) {
        String otp = otpService.generateOtp();
        otpService.saveOtp(email, otp);
        emailService.sendOtpEmail(email, otp); // Send OTP via email

        Map<String, String> response = new HashMap<>();
        response.put("message", "OTP sent successfully");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/verify")
    public ResponseEntity<?> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        boolean isValid = otpService.verifyOtp(email, otp);
        if (isValid) {
            return ResponseEntity.ok(Map.of("message", "OTP verified successfully"));
        } else {
            return ResponseEntity.status(400).body(Map.of("message", "Invalid OTP"));
        }
    }
}

