package com.csse.smartwaste.login.service.impl;

import com.csse.smartwaste.common.exception.DuplicateResourceException;
import com.csse.smartwaste.common.exception.InvalidCredentialsException;
import com.csse.smartwaste.common.exception.ResourceNotFoundException;
import com.csse.smartwaste.common.util.PasswordUtil;
import com.csse.smartwaste.login.dto.SignInRequest;
import com.csse.smartwaste.login.dto.SignUpRequest;
import com.csse.smartwaste.login.dto.UserResponse;
import com.csse.smartwaste.login.entity.User;
import com.csse.smartwaste.login.repository.UserRepository;
import com.csse.smartwaste.login.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * AuthService Implementation
 * Follows Single Responsibility Principle - only handles authentication logic
 * Follows Dependency Inversion Principle - depends on UserRepository abstraction
 * Follows Open/Closed Principle - closed for modification, open for extension
 */
@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordUtil passwordUtil;

    /**
     * Constructor injection - follows Dependency Injection best practice
     * Preferred over @Autowired field injection
     */
    @Autowired
    public AuthServiceImpl(UserRepository userRepository, PasswordUtil passwordUtil) {
        this.userRepository = userRepository;
        this.passwordUtil = passwordUtil;
    }

    /**
     * Register a new user
     * @param request SignUpRequest with user details
     * @return UserResponse with created user
     * @throws DuplicateResourceException if email already exists
     */
    @Override
    public UserResponse signUp(SignUpRequest request) {
        // Validate email uniqueness
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateResourceException("User", "email", request.getEmail());
        }

        // Create and save new user
        User user = createUserFromRequest(request);
        user = userRepository.save(user);

        return mapToUserResponse(user);
    }

    /**
     * Authenticate user
     * @param request SignInRequest with credentials
     * @return UserResponse with authenticated user
     * @throws ResourceNotFoundException if user not found
     * @throws InvalidCredentialsException if password incorrect
     */
    @Override
    public UserResponse signIn(SignInRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        // Validate password
        if (!validatePassword(user, request.getPassword())) {
            throw new InvalidCredentialsException();
        }

        return mapToUserResponse(user);
    }

    /**
     * Helper method to create User entity from SignUpRequest
     * Follows Single Responsibility - dedicated to user creation
     */
    private User createUserFromRequest(SignUpRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordUtil.hashPassword(request.getPassword())); // Hash password securely
        user.setRole(request.getRole());
        return user;
    }

    /**
     * Helper method to validate password
     * Follows Single Responsibility - dedicated to password validation
     * Handles both hashed and plain text passwords for migration compatibility
     */
    private boolean validatePassword(User user, String password) {
        String storedPassword = user.getPasswordHash();
        
        // Check if password is already hashed (migrated user)
        if (passwordUtil.isPasswordHashed(storedPassword)) {
            return passwordUtil.verifyPassword(password, storedPassword);
        }
        
        // Legacy plain text password (for existing users during migration)
        boolean isValid = storedPassword.equals(password);
        
        // If password is valid and stored as plain text, hash it for security
        if (isValid) {
            user.setPasswordHash(passwordUtil.hashPassword(password));
            userRepository.save(user); // Update with hashed password
        }
        
        return isValid;
    }

    /**
     * Helper method to map User entity to UserResponse DTO
     * Follows Single Responsibility - dedicated to DTO mapping
     */
    private UserResponse mapToUserResponse(User user) {
        return new UserResponse(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}
