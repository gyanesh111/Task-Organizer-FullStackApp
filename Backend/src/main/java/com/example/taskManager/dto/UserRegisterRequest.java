package com.example.taskManager.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class UserRegisterRequest {
	private String firstName;
	private String lastName;
	private String email;
	private String password;
}
