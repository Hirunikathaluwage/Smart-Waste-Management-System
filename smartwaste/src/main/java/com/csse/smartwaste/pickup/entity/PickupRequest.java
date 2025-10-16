package com.csse.smartwaste.pickup.entity;

import com.csse.smartwaste.common.model.PickupType;
import com.csse.smartwaste.common.model.PickupStatus;
import com.csse.smartwaste.common.model.PaymentStatus;
import com.csse.smartwaste.common.model.WasteType;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * PickupRequest Entity - Represents a waste pickup request in the system
 * Follows Single Responsibility Principle - only represents pickup request data
 */
@Document(collection = "pickup_requests")
public class PickupRequest {

    @Id
    private String requestId;

    private String userId;
    private String userName;
    private String userEmail;
    private String userPhone;

    // Waste Details
    private WasteType wasteType;
    private String itemDescription;
    private List<String> itemImages; // URLs to uploaded images
    private BigDecimal estimatedWeight; // in kg
    private String specialInstructions;

    // Pickup Details
    private PickupType pickupType; // Emergency, Extra, Regular
    private LocalDateTime preferredDateTime;
    private LocalDateTime scheduledDateTime;
    private String pickupLocation;
    private String address;
    private String city;
    private String postalCode;
    private Double latitude;
    private Double longitude;

    // Payment Details
    private BigDecimal baseAmount;
    private BigDecimal urgencyFee;
    private BigDecimal totalAmount;
    private BigDecimal rewardPointsUsed;
    private BigDecimal finalAmount;
    private PaymentStatus paymentStatus;
    private String paymentMethod; // Cash, Card, Points, PayLater
    private String paymentReference;
    private LocalDateTime paymentDate;

    // System Details
    private PickupStatus status;
    private String assignedWorkerId;
    private String assignedWorkerName;
    private String adminNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;

    // Notification tracking
    private boolean emailNotificationSent;
    private boolean smsNotificationSent;
    private boolean appNotificationSent;
    private LocalDateTime lastReminderSent;

    // Constructor
    public PickupRequest() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = PickupStatus.DRAFT;
        this.paymentStatus = PaymentStatus.PENDING;
    }

    // Getters & Setters
    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getUserPhone() { return userPhone; }
    public void setUserPhone(String userPhone) { this.userPhone = userPhone; }

    public WasteType getWasteType() { return wasteType; }
    public void setWasteType(WasteType wasteType) { this.wasteType = wasteType; }

    public String getItemDescription() { return itemDescription; }
    public void setItemDescription(String itemDescription) { this.itemDescription = itemDescription; }

    public List<String> getItemImages() { return itemImages; }
    public void setItemImages(List<String> itemImages) { this.itemImages = itemImages; }

    public BigDecimal getEstimatedWeight() { return estimatedWeight; }
    public void setEstimatedWeight(BigDecimal estimatedWeight) { this.estimatedWeight = estimatedWeight; }

    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }

    public PickupType getPickupType() { return pickupType; }
    public void setPickupType(PickupType pickupType) { this.pickupType = pickupType; }

    public LocalDateTime getPreferredDateTime() { return preferredDateTime; }
    public void setPreferredDateTime(LocalDateTime preferredDateTime) { this.preferredDateTime = preferredDateTime; }

    public LocalDateTime getScheduledDateTime() { return scheduledDateTime; }
    public void setScheduledDateTime(LocalDateTime scheduledDateTime) { this.scheduledDateTime = scheduledDateTime; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public BigDecimal getBaseAmount() { return baseAmount; }
    public void setBaseAmount(BigDecimal baseAmount) { this.baseAmount = baseAmount; }

    public BigDecimal getUrgencyFee() { return urgencyFee; }
    public void setUrgencyFee(BigDecimal urgencyFee) { this.urgencyFee = urgencyFee; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public BigDecimal getRewardPointsUsed() { return rewardPointsUsed; }
    public void setRewardPointsUsed(BigDecimal rewardPointsUsed) { this.rewardPointsUsed = rewardPointsUsed; }

    public BigDecimal getFinalAmount() { return finalAmount; }
    public void setFinalAmount(BigDecimal finalAmount) { this.finalAmount = finalAmount; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentReference() { return paymentReference; }
    public void setPaymentReference(String paymentReference) { this.paymentReference = paymentReference; }

    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }

    public PickupStatus getStatus() { return status; }
    public void setStatus(PickupStatus status) { this.status = status; }

    public String getAssignedWorkerId() { return assignedWorkerId; }
    public void setAssignedWorkerId(String assignedWorkerId) { this.assignedWorkerId = assignedWorkerId; }

    public String getAssignedWorkerName() { return assignedWorkerName; }
    public void setAssignedWorkerName(String assignedWorkerName) { this.assignedWorkerName = assignedWorkerName; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public boolean isEmailNotificationSent() { return emailNotificationSent; }
    public void setEmailNotificationSent(boolean emailNotificationSent) { this.emailNotificationSent = emailNotificationSent; }

    public boolean isSmsNotificationSent() { return smsNotificationSent; }
    public void setSmsNotificationSent(boolean smsNotificationSent) { this.smsNotificationSent = smsNotificationSent; }

    public boolean isAppNotificationSent() { return appNotificationSent; }
    public void setAppNotificationSent(boolean appNotificationSent) { this.appNotificationSent = appNotificationSent; }

    public LocalDateTime getLastReminderSent() { return lastReminderSent; }
    public void setLastReminderSent(LocalDateTime lastReminderSent) { this.lastReminderSent = lastReminderSent; }
}
