package com.example.taskManager.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AuthResponse {
	// jwtToken
	private String token;
	// UserDetailsDTO contains id, firstName, lastName, email
	private UserDetailsDTO userDetails;
}
