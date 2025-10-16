package com.csse.smartwaste.pickup.service;

import com.csse.smartwaste.pickup.entity.PickupRequest;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * NotificationService - Service for sending notifications
 * Follows Single Responsibility Principle - only handles notifications
 */
@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    /**
     * Send pickup request confirmation
     */
    public void sendPickupRequestConfirmation(PickupRequest pickupRequest) {
        logger.info("Sending pickup request confirmation for request ID: {}", pickupRequest.getRequestId());
        
        // Send email notification
        sendEmailNotification(pickupRequest, "Pickup Request Confirmation", 
                buildConfirmationMessage(pickupRequest));
        
        // Send SMS notification
        if (pickupRequest.getUserPhone() != null) {
            sendSmsNotification(pickupRequest.getUserPhone(), 
                    "Your pickup request has been submitted. Request ID: " + pickupRequest.getRequestId());
        }
        
        // Send app notification
        sendAppNotification(pickupRequest.getUserId(), 
                "Pickup Request Submitted", 
                "Your pickup request has been submitted successfully.");
        
        // Update notification flags
        pickupRequest.setEmailNotificationSent(true);
        pickupRequest.setSmsNotificationSent(true);
        pickupRequest.setAppNotificationSent(true);
    }

    /**
     * Send payment confirmation
     */
    public void sendPaymentConfirmation(PickupRequest pickupRequest) {
        logger.info("Sending payment confirmation for request ID: {}", pickupRequest.getRequestId());
        
        String message = String.format(
                "Payment confirmed for pickup request %s. Amount: $%.2f. Pickup scheduled for %s.",
                pickupRequest.getRequestId(),
                pickupRequest.getFinalAmount(),
                pickupRequest.getScheduledDateTime()
        );
        
        sendEmailNotification(pickupRequest, "Payment Confirmation", message);
        
        if (pickupRequest.getUserPhone() != null) {
            sendSmsNotification(pickupRequest.getUserPhone(), message);
        }
        
        sendAppNotification(pickupRequest.getUserId(), "Payment Confirmed", message);
    }

    /**
     * Send cancellation notification
     */
    public void sendCancellationNotification(PickupRequest pickupRequest) {
        logger.info("Sending cancellation notification for request ID: {}", pickupRequest.getRequestId());
        
        String message = String.format(
                "Your pickup request %s has been cancelled. Reason: %s",
                pickupRequest.getRequestId(),
                pickupRequest.getAdminNotes()
        );
        
        sendEmailNotification(pickupRequest, "Pickup Request Cancelled", message);
        
        if (pickupRequest.getUserPhone() != null) {
            sendSmsNotification(pickupRequest.getUserPhone(), message);
        }
        
        sendAppNotification(pickupRequest.getUserId(), "Request Cancelled", message);
    }

    /**
     * Send payment reminder
     */
    public void sendPaymentReminder(PickupRequest pickupRequest) {
        logger.info("Sending payment reminder for request ID: {}", pickupRequest.getRequestId());
        
        String message = String.format(
                "Payment reminder: Your pickup request %s requires payment of $%.2f. Please complete payment to schedule your pickup.",
                pickupRequest.getRequestId(),
                pickupRequest.getFinalAmount()
        );
        
        sendEmailNotification(pickupRequest, "Payment Reminder", message);
        
        if (pickupRequest.getUserPhone() != null) {
            sendSmsNotification(pickupRequest.getUserPhone(), message);
        }
        
        sendAppNotification(pickupRequest.getUserId(), "Payment Reminder", message);
        
        pickupRequest.setLastReminderSent(java.time.LocalDateTime.now());
    }

    /**
     * Send worker assignment notification
     */
    public void sendWorkerAssignmentNotification(PickupRequest pickupRequest) {
        logger.info("Sending worker assignment notification for request ID: {}", pickupRequest.getRequestId());
        
        String message = String.format(
                "You have been assigned to pickup request %s. Location: %s. Scheduled time: %s",
                pickupRequest.getRequestId(),
                pickupRequest.getAddress(),
                pickupRequest.getScheduledDateTime()
        );
        
        // Send notification to assigned worker
        sendAppNotification(pickupRequest.getAssignedWorkerId(), "New Pickup Assignment", message);
        
        // Send notification to user
        String userMessage = String.format(
                "Your pickup request %s has been assigned to worker %s. Pickup scheduled for %s.",
                pickupRequest.getRequestId(),
                pickupRequest.getAssignedWorkerName(),
                pickupRequest.getScheduledDateTime()
        );
        
        sendEmailNotification(pickupRequest, "Worker Assigned", userMessage);
        sendAppNotification(pickupRequest.getUserId(), "Worker Assigned", userMessage);
    }

    /**
     * Send admin notification for new requests
     */
    public void sendAdminNotification(PickupRequest pickupRequest) {
        logger.info("Sending admin notification for new request ID: {}", pickupRequest.getRequestId());
        
        String message = String.format(
                "New pickup request received: %s. Type: %s, Location: %s, Amount: $%.2f",
                pickupRequest.getRequestId(),
                pickupRequest.getPickupType(),
                pickupRequest.getAddress(),
                pickupRequest.getFinalAmount()
        );
        
        // Send to all admin users
        sendAppNotification("admin", "New Pickup Request", message);
    }

    // Private helper methods

    private void sendEmailNotification(PickupRequest pickupRequest, String subject, String message) {
        // In a real implementation, integrate with email service (SendGrid, AWS SES, etc.)
        logger.info("Email sent to {}: Subject: {}, Message: {}", 
                pickupRequest.getUserEmail(), subject, message);
    }

    private void sendSmsNotification(String phoneNumber, String message) {
        // In a real implementation, integrate with SMS service (Twilio, AWS SNS, etc.)
        logger.info("SMS sent to {}: {}", phoneNumber, message);
    }

    private void sendAppNotification(String userId, String title, String message) {
        // In a real implementation, integrate with push notification service (FCM, etc.)
        logger.info("App notification sent to user {}: Title: {}, Message: {}", 
                userId, title, message);
    }

    private String buildConfirmationMessage(PickupRequest pickupRequest) {
        return String.format(
                "Dear %s,\n\n" +
                "Your pickup request has been submitted successfully.\n\n" +
                "Request Details:\n" +
                "Request ID: %s\n" +
                "Waste Type: %s\n" +
                "Pickup Type: %s\n" +
                "Location: %s\n" +
                "Preferred Date: %s\n" +
                "Total Amount: $%.2f\n" +
                "Payment Status: %s\n\n" +
                "We will contact you soon to confirm the pickup schedule.\n\n" +
                "Thank you for using Smart Waste Management System!",
                pickupRequest.getUserName(),
                pickupRequest.getRequestId(),
                pickupRequest.getWasteType(),
                pickupRequest.getPickupType(),
                pickupRequest.getAddress(),
                pickupRequest.getPreferredDateTime(),
                pickupRequest.getFinalAmount(),
                pickupRequest.getPaymentStatus()
        );
    }
}
