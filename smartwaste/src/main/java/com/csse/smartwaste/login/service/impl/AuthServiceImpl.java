package com.csse.smartwaste.login.service.impl;

import com.csse.smartwaste.login.dto.SignInRequest;
import com.csse.smartwaste.login.dto.SignUpRequest;
import com.csse.smartwaste.login.dto.UserResponse;
import com.csse.smartwaste.login.entity.User;
import com.csse.smartwaste.login.repository.UserRepository;
import com.csse.smartwaste.login.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserResponse signUp(SignUpRequest request) {
        // Check if email already exists
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Create new user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(request.getPassword()); // Ideally, hash it later
        user.setRole(request.getRole());

        // Save user to MongoDB
        user = userRepository.save(user);

        return new UserResponse(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    @Override
    public UserResponse signIn(SignInRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Simple password check (you can add hashing later)
        if (!user.getPasswordHash().equals(request.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return new UserResponse(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}
