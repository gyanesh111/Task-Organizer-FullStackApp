package com.example.taskManager.service;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.taskManager.dto.AuthResponse;
import com.example.taskManager.dto.UpdateUserRequest;
import com.example.taskManager.dto.UserDetailsDTO;
import com.example.taskManager.dto.UserRegisterRequest;
import com.example.taskManager.dto.UserSigninRequest;
import com.example.taskManager.exception.UserAlreadyExistsException;
import com.example.taskManager.exception.UserNotFoundException;
import com.example.taskManager.jwt.JwtAuthenticationHelper;
import com.example.taskManager.model.User;
import com.example.taskManager.repository.UserRepository;

@Service
public class UserService {
	
	UserRepository userRepository;
	
	JwtAuthenticationHelper jwtTokenProvider;
	
	@Autowired
	public UserService(UserRepository userRepository,  JwtAuthenticationHelper jwtTokenProvider) {
		this.userRepository = userRepository;
		this.jwtTokenProvider = jwtTokenProvider;
	}
	
	// Service for the sign up method
	public void signUp(UserRegisterRequest userRegisterRequest) {
	    // Check if the user already exists based on email
	    Optional<User> existingUser = userRepository.findByEmail(userRegisterRequest.getEmail());
	    
	    // if the user is already exist then return new exception
	    if (existingUser.isPresent()) {
	        throw new UserAlreadyExistsException("User with email " + userRegisterRequest.getEmail() + " already exists.");
	    }
	    
	    // Encrypt the string password
	    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
	    String encoderPassword = passwordEncoder.encode(userRegisterRequest.getPassword());
	    
	    // Create a new user object and populate fields
	    User newUser = new User();
	    newUser.setFirstName(userRegisterRequest.getFirstName());
	    newUser.setLastName(userRegisterRequest.getLastName());
	    newUser.setEmail(userRegisterRequest.getEmail());
	    newUser.setPassword(encoderPassword); // Ensure password is encrypted

	    // Save the new user in the database
	    userRepository.save(newUser);
	}


	// Service for the sign in method
	public AuthResponse signIn(UserSigninRequest userSigninRequest) {
	    // Fetch user by email
	    User user = userRepository.findByEmail(userSigninRequest.getEmail())
	            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userSigninRequest.getEmail()));
	    
	    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
	    // Verify password
	    if (!passwordEncoder.matches(userSigninRequest.getPassword(), user.getPassword())) {
	        throw new UserNotFoundException("Invalid credentials. Please try again.");
	    }

	    // Generate JWT token
	    String token = jwtTokenProvider.generateToken(user.getEmail(), user.getId());

	    // Map User entity to UserDetailsDTO
	    UserDetailsDTO userDetails = new UserDetailsDTO();
	    userDetails.setId(user.getId());
	    userDetails.setFirstName(user.getFirstName());
	    userDetails.setLastName(user.getLastName());
	    userDetails.setEmail(user.getEmail());

	    // Prepare AuthResponse
	    AuthResponse authResponse = new AuthResponse();
	    authResponse.setToken(token);
	    authResponse.setUserDetails(userDetails);

	    return authResponse;
	}

	public UserDetailsDTO updateUser(UpdateUserRequest updateUser) {
		User user = userRepository.findByEmail(updateUser.getEmail())
	            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + updateUser.getEmail()));
		user.setFirstName(updateUser.getFirstName());
		user.setLastName(updateUser.getLastName());
		userRepository.save(user);
		UserDetailsDTO userDetails = new UserDetailsDTO();
		userDetails.setId(user.getId());
		userDetails.setFirstName(user.getFirstName());
		userDetails.setLastName(user.getLastName());
		userDetails.setEmail(user.getEmail());
		return userDetails;
	}

	public ResponseEntity<?> verifyEmail(String email) {
	    // Check if the user exists by email
	    Optional<User> existingUser = userRepository.findByEmail(email);

	    if (existingUser.isPresent()) {
	        return ResponseEntity.ok("Email is verified.");
	    } else {
	        throw new UserNotFoundException("User with email " + email + " not found.");
	    }
	}
	
	public String resetPassword(String email, String newPassword) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (!optionalUser.isPresent()) {
            throw new UserNotFoundException("User with email " + email + " not found.");
        }
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        User user = optionalUser.get();
        user.setPassword(passwordEncoder.encode(newPassword)); // Encrypt the new password
        userRepository.save(user);

        return "Password reset successfully.";
    }

}
