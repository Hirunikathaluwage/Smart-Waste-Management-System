package com.csse.smartwaste.common.model;

/**
 * PickupStatus Enum - Represents the status of a pickup request
 */
public enum PickupStatus {
    DRAFT,          // Request is being created
    PENDING,        // Request submitted, awaiting admin approval
    SCHEDULED,      // Request approved and scheduled
    IN_PROGRESS,    // Worker is on the way or collecting
    COMPLETED,      // Pickup completed successfully
    CANCELLED,      // Request cancelled by user or admin
    FAILED,         // Pickup failed due to various reasons
    RESCHEDULED     // Request has been rescheduled
}
