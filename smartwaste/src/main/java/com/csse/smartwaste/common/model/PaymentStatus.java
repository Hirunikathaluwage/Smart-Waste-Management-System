package com.csse.smartwaste.common.model;

/**
 * PaymentStatus Enum - Represents the payment status of a pickup request
 */
public enum PaymentStatus {
    PENDING,        // Payment not yet made
    COMPLETED,      // Payment completed successfully
    DECLINED,       // Payment was declined
    MISSED,         // Payment deadline missed
    REFUNDED,       // Payment was refunded
    PARTIAL         // Partial payment made
}
