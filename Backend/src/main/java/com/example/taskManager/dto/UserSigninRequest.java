package com.example.taskManager.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserSigninRequest {
	private String email;
	private String password;
}
