package com.example.taskManager.service;

import org.springframework.stereotype.Service;
import com.example.taskManager.model.Otp;
import com.example.taskManager.repository.OtpRepository;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
public class OtpService {
    private final OtpRepository otpRepository;
    private static final SecureRandom random = new SecureRandom();
    private static final long OTP_EXPIRATION_MINUTES = 5; // OTP expiry time

    public OtpService(OtpRepository otpRepository) {
        this.otpRepository = otpRepository;
    }

    // ✅ Generate a 6-digit OTP
    public String generateOtp() {
        return String.format("%06d", random.nextInt(1000000));
    }

    // ✅ Save OTP for user (deletes old OTPs before saving new)
    public void saveOtp(String email, String otp) {
        otpRepository.deleteByEmail(email); // Ensure only latest OTP exists
        otpRepository.save(new Otp(email, otp));
    }

    // ✅ Verify OTP
    public boolean verifyOtp(String email, String otp) {
        Optional<Otp> otpRecord = otpRepository.findFirstByEmailOrderByCreatedAtDesc(email);

        if (otpRecord.isPresent()) {
            Otp storedOtp = otpRecord.get();
            Instant otpTime = storedOtp.getCreatedAt().toInstant();
            Instant expirationTime = otpTime.plus(OTP_EXPIRATION_MINUTES, ChronoUnit.MINUTES);
            Instant now = Instant.now();

            // Check if OTP matches & has not expired
            if (storedOtp.getOtp().equals(otp) && now.isBefore(expirationTime)) {
                otpRepository.delete(storedOtp); // Delete OTP after successful verification
                return true;
            }
        }
        return false;
    }
}
