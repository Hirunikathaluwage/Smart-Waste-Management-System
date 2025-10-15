package com.csse.smartwaste.common.util;

import com.csse.smartwaste.common.exception.ResourceNotFoundException;
import com.csse.smartwaste.common.exception.UnauthorizedException;
import com.csse.smartwaste.common.model.Role;
import com.csse.smartwaste.login.entity.User;
import com.csse.smartwaste.login.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * User Validation Utility - Validates user identity and role
 * Follows Single Responsibility Principle - only handles user validation
 * Follows Open/Closed Principle - can be extended with more validation rules
 */
@Component
public class UserValidationUtil {
    
    private final UserRepository userRepository;
    
    @Autowired
    public UserValidationUtil(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    /**
     * Validate user exists and has the required role
     * @param userId the user ID to validate
     * @param requiredRole the role the user must have
     * @return the validated user
     * @throws ResourceNotFoundException if user not found
     * @throws UnauthorizedException if user doesn't have required role
     */
    public User validateUserAndRole(String userId, Role requiredRole) {
        if (userId == null || userId.trim().isEmpty()) {
            throw new UnauthorizedException("User ID is required");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));
        
        if (user.getRole() != requiredRole) {
            throw new UnauthorizedException("User does not have required role: " + requiredRole);
        }
        
        return user;
    }
    
    /**
     * Validate user exists (any role)
     * @param userId the user ID to validate
     * @return the validated user
     * @throws ResourceNotFoundException if user not found
     */
    public User validateUserExists(String userId) {
        if (userId == null || userId.trim().isEmpty()) {
            throw new UnauthorizedException("User ID is required");
        }
        
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));
    }
    
    /**
     * Check if user has specific role
     * @param userId the user ID to check
     * @param role the role to check for
     * @return true if user has the role, false otherwise
     */
    public boolean userHasRole(String userId, Role role) {
        try {
            User user = validateUserExists(userId);
            return user.getRole() == role;
        } catch (Exception e) {
            return false;
        }
    }
}
