package com.example.taskManager.model;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Document(collection = "otps")
@Getter
@Setter
@NoArgsConstructor
public class Otp {
    @Id
    private String id;
    private String email;
    private String otp;
    private Date createdAt; // Store creation time

    public Otp(String email, String otp) {
        this.email = email;
        this.otp = otp;
        this.createdAt = new Date(); // Set current time
    }
}
