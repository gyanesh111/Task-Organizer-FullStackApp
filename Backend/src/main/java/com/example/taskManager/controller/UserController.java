package com.example.taskManager.controller;

import java.util.Collection;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.taskManager.dto.AuthResponse;
import com.example.taskManager.dto.ResetPasswordRequest;
import com.example.taskManager.dto.UpdateUserRequest;
import com.example.taskManager.dto.UserDetailsDTO;
import com.example.taskManager.dto.UserRegisterRequest;
import com.example.taskManager.dto.UserSigninRequest;
import com.example.taskManager.service.UserService;

@RestController
@RequestMapping("/user")
public class UserController {

	private UserService userService;

	@Autowired
	public UserController(UserService userService) {
		this.userService = userService;
	}

	@PostMapping("/signup")
	public ResponseEntity<?> signUp(@RequestBody UserRegisterRequest userReigsterRequest) {
		userService.signUp(userReigsterRequest);
		return ResponseEntity.ok("User registeredSuccessfull");
	}

	@PostMapping("/signin")
	public ResponseEntity<AuthResponse> signIn(@RequestBody UserSigninRequest userSigninRequest) {
		AuthResponse response = userService.signIn(userSigninRequest);
		System.out.println("The user logged in succesfully");
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PutMapping("/update")
	public ResponseEntity<UserDetailsDTO> updateUser(@RequestBody UpdateUserRequest updateUser) {
		UserDetailsDTO updatedUser = userService.updateUser(updateUser);
		return new ResponseEntity<>(updatedUser, HttpStatus.OK);
	}

	@GetMapping("/verify/{email}")
	public ResponseEntity<?> verifyEmail(@PathVariable("email") String email) {
		System.out.println(email);
		return userService.verifyEmail(email);
	}

	@PostMapping("/reset-password")
	public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
		String response = userService.resetPassword(request.getEmail(), request.getPassword());
		return ResponseEntity.ok(response);
	}

}
