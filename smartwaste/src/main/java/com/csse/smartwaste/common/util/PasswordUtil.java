package com.csse.smartwaste.common.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Password Utility - Handles password hashing and verification
 * Follows Single Responsibility Principle - only handles password operations
 * Follows Open/Closed Principle - can be extended with different hashing algorithms
 */
@Component
public class PasswordUtil {
    
    private final BCryptPasswordEncoder passwordEncoder;
    
    public PasswordUtil() {
        this.passwordEncoder = new BCryptPasswordEncoder(12); // Higher strength for better security
    }
    
    /**
     * Hash a plain text password
     * @param plainPassword the plain text password to hash
     * @return the hashed password
     */
    public String hashPassword(String plainPassword) {
        return passwordEncoder.encode(plainPassword);
    }
    
    /**
     * Verify a plain text password against a hashed password
     * @param plainPassword the plain text password to verify
     * @param hashedPassword the hashed password to compare against
     * @return true if passwords match, false otherwise
     */
    public boolean verifyPassword(String plainPassword, String hashedPassword) {
        return passwordEncoder.matches(plainPassword, hashedPassword);
    }
    
    /**
     * Check if a password is already hashed (starts with $2a$)
     * @param password the password to check
     * @return true if password is hashed, false if it's plain text
     */
    public boolean isPasswordHashed(String password) {
        return password != null && password.startsWith("$2a$");
    }
}
