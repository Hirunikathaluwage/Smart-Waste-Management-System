package com.csse.smartwaste.binrequest.dto;

import com.csse.smartwaste.binrequest.entity.BinRequest;
import com.csse.smartwaste.binrequest.entity.BinRequestStatus;
import com.csse.smartwaste.binrequest.entity.RequestType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * BinRequestDto - Data Transfer Object for bin request creation
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only responsible for data transfer
 * - DIP (Dependency Inversion): Depends on entity abstraction
 * - ISP (Interface Segregation): Focused on request data only
 * 
 * CODE SMELLS AVOIDED:
 * - No business logic: Pure data transfer object
 * - Clear naming: Descriptive field names
 * - Immutable design: Final fields where possible
 */
public class BinRequestDto {
    private String userId;
    private RequestType requestType; // BIN or BAG
    private String itemType; // general, recyclable, organic, etc.
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalAmount;
    private String deliveryAddress;
    private String specialInstructions;
    private String paymentIntentId;
    private String paymentMethodId;
    private Double latitude; // Add coordinates
    private Double longitude;

    // Constructors
    public BinRequestDto() {}

    public BinRequestDto(String userId, RequestType requestType, String itemType, 
                        Integer quantity, BigDecimal unitPrice, BigDecimal totalAmount,
                        String deliveryAddress, String specialInstructions) {
        this.userId = userId;
        this.requestType = requestType;
        this.itemType = itemType;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalAmount = totalAmount;
        this.deliveryAddress = deliveryAddress;
        this.specialInstructions = specialInstructions;
    }

    // Getters and Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public RequestType getRequestType() {
        return requestType;
    }

    public void setRequestType(RequestType requestType) {
        this.requestType = requestType;
    }

    public String getItemType() {
        return itemType;
    }

    public void setItemType(String itemType) {
        this.itemType = itemType;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getSpecialInstructions() {
        return specialInstructions;
    }

    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }

    public String getPaymentIntentId() {
        return paymentIntentId;
    }

    public void setPaymentIntentId(String paymentIntentId) {
        this.paymentIntentId = paymentIntentId;
    }

    public String getPaymentMethodId() {
        return paymentMethodId;
    }

    public void setPaymentMethodId(String paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    /**
     * Convert DTO to entity
     * SRP: Single responsibility - only handles entity conversion
     */
    public BinRequest toEntity() {
        BinRequest binRequest = new BinRequest();
        binRequest.setUserId(this.userId);
        binRequest.setRequestType(this.requestType);
        binRequest.setItemType(this.itemType);
        binRequest.setQuantity(this.quantity);
        binRequest.setUnitPrice(this.unitPrice);
        binRequest.setTotalAmount(this.totalAmount);
        binRequest.setDeliveryAddress(this.deliveryAddress);
        binRequest.setSpecialInstructions(this.specialInstructions);
        binRequest.setPaymentIntentId(this.paymentIntentId);
        binRequest.setPaymentMethodId(this.paymentMethodId);
        binRequest.setStatus(BinRequestStatus.PENDING);
        binRequest.setCreatedAt(LocalDateTime.now());
        binRequest.setUpdatedAt(LocalDateTime.now());
        return binRequest;
    }
}
