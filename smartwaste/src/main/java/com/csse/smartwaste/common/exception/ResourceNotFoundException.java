package com.csse.smartwaste.common.exception;

/**
 * Custom exception for resource not found scenarios
 * Follows Single Responsibility Principle - only represents resource not found error
 */
public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s: '%s'", resourceName, fieldName, fieldValue));
    }
}

