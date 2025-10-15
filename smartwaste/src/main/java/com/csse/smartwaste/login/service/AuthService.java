package com.csse.smartwaste.login.service;

import com.csse.smartwaste.login.dto.SignInRequest;
import com.csse.smartwaste.login.dto.SignUpRequest;
import com.csse.smartwaste.login.dto.UserResponse;

/**
 * AuthService Interface
 * Follows Interface Segregation Principle - clean, focused interface
 * Follows Dependency Inversion Principle - high-level abstraction
 */
public interface AuthService {
    /**
     * Register a new user
     * @param request SignUpRequest containing user details
     * @return UserResponse with created user details
     * @throws DuplicateResourceException if email already exists
     */
    UserResponse signUp(SignUpRequest request);
    
    /**
     * Authenticate user
     * @param request SignInRequest containing credentials
     * @return UserResponse with authenticated user details
     * @throws ResourceNotFoundException if user not found
     * @throws InvalidCredentialsException if password is incorrect
     */
    UserResponse signIn(SignInRequest request);
}
