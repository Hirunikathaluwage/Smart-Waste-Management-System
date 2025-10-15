package com.csse.smartwaste.common.exception;

/**
 * Custom exception for invalid credentials scenarios
 * Follows Single Responsibility Principle - only represents invalid credentials error
 */
public class InvalidCredentialsException extends RuntimeException {
    
    public InvalidCredentialsException(String message) {
        super(message);
    }
    
    public InvalidCredentialsException() {
        super("Invalid email or password");
    }
}

