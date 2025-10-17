package com.csse.smartwaste.binrequest.entity;

/**
 * RequestType Enum - Defines the type of request
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only responsible for request type definition
 * - OCP (Open/Closed): Open for extension with new types, closed for modification
 * 
 * CODE SMELLS AVOIDED:
 * - No magic strings: Enum values instead of string literals
 * - Clear naming: Descriptive enum values
 */
public enum RequestType {
    BIN("Bin"),
    BAG("Bag");

    private final String displayName;

    RequestType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }
}

