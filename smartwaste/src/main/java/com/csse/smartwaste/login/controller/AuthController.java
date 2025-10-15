package com.csse.smartwaste.login.controller;

import com.csse.smartwaste.login.dto.SignInRequest;
import com.csse.smartwaste.login.dto.SignUpRequest;
import com.csse.smartwaste.login.dto.UserResponse;
import com.csse.smartwaste.login.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * AuthController - Handles authentication REST endpoints
 * Follows Single Responsibility Principle - only handles HTTP requests/responses
 * Follows Dependency Inversion Principle - depends on AuthService abstraction
 */
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public UserResponse signUp(@RequestBody SignUpRequest request) {
        return authService.signUp(request);
    }

    @PostMapping("/signin")
    public UserResponse signIn(@RequestBody SignInRequest request) {
        return authService.signIn(request);
    }
}