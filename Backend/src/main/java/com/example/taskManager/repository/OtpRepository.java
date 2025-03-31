package com.example.taskManager.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.taskManager.model.Otp;

import java.util.Optional;

@Repository
public interface OtpRepository extends MongoRepository<Otp, String> {
	
    Optional<Otp> findByEmail(String email);
    
    Optional<Otp> findFirstByEmailOrderByCreatedAtDesc(String email);
    
    void deleteByEmail(String email);
}
