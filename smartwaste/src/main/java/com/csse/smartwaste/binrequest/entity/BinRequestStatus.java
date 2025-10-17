package com.csse.smartwaste.binrequest.entity;

/**
 * BinRequestStatus Enum - Defines the status of a bin request
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only responsible for status definition
 * - OCP (Open/Closed): Open for extension with new statuses, closed for modification
 * 
 * CODE SMELLS AVOIDED:
 * - No magic strings: Enum values instead of string literals
 * - Clear naming: Descriptive enum values
 */
public enum BinRequestStatus {
    PENDING("Pending"),
    CONFIRMED("Confirmed"),
    PROCESSING("Processing"),
    SHIPPED("Shipped"),
    DELIVERED("Delivered"),
    CANCELLED("Cancelled"),
    REFUNDED("Refunded");

    private final String displayName;

    BinRequestStatus(String displayName) {
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

