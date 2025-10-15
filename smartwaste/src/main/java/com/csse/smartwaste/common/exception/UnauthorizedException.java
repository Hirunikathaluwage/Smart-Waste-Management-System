package com.csse.smartwaste.common.exception;

/**
 * UnauthorizedException - Thrown when user doesn't have required permissions
 * Follows Single Responsibility Principle - only represents unauthorized access
 */
public class UnauthorizedException extends RuntimeException {
    
    public UnauthorizedException(String message) {
        super(message);
    }
    
    public UnauthorizedException(String message, Throwable cause) {
        super(message, cause);
    }
}
