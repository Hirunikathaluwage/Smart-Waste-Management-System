package com.csse.smartwaste.binrequest.dto;

import com.csse.smartwaste.binrequest.entity.BinRequest;
import com.csse.smartwaste.binrequest.entity.BinRequestStatus;
import com.csse.smartwaste.binrequest.entity.RequestType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * BinRequestResponseDto - Data Transfer Object for bin request responses
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only responsible for response data transfer
 * - DIP (Dependency Inversion): Depends on entity abstraction
 * - ISP (Interface Segregation): Focused on response data only
 * 
 * CODE SMELLS AVOIDED:
 * - No business logic: Pure data transfer object
 * - Clear naming: Descriptive field names
 * - Immutable design: Final fields where possible
 */
public class BinRequestResponseDto {
    private String requestId;
    private String userId;
    private RequestType requestType;
    private String itemType;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalAmount;
    private String deliveryAddress;
    private String specialInstructions;
    private BinRequestStatus status;
    private String paymentIntentId;
    private String paymentMethodId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deliveredAt;

    // Constructors
    public BinRequestResponseDto() {}

    public BinRequestResponseDto(String requestId, String userId, RequestType requestType, 
                                String itemType, Integer quantity, BigDecimal unitPrice, 
                                BigDecimal totalAmount, String deliveryAddress, 
                                String specialInstructions, BinRequestStatus status,
                                String paymentIntentId, String paymentMethodId,
                                LocalDateTime createdAt, LocalDateTime updatedAt, 
                                LocalDateTime deliveredAt) {
        this.requestId = requestId;
        this.userId = userId;
        this.requestType = requestType;
        this.itemType = itemType;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalAmount = totalAmount;
        this.deliveryAddress = deliveryAddress;
        this.specialInstructions = specialInstructions;
        this.status = status;
        this.paymentIntentId = paymentIntentId;
        this.paymentMethodId = paymentMethodId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deliveredAt = deliveredAt;
    }

    // Getters and Setters
    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

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

    public BinRequestStatus getStatus() {
        return status;
    }

    public void setStatus(BinRequestStatus status) {
        this.status = status;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getDeliveredAt() {
        return deliveredAt;
    }

    public void setDeliveredAt(LocalDateTime deliveredAt) {
        this.deliveredAt = deliveredAt;
    }

    /**
     * Convert entity to response DTO
     * SRP: Single responsibility - only handles DTO conversion
     * 
     * @param binRequest the entity to convert
     * @return BinRequestResponseDto
     */
    public static BinRequestResponseDto fromEntity(BinRequest binRequest) {
        BinRequestResponseDto dto = new BinRequestResponseDto();
        dto.setRequestId(binRequest.getRequestId());
        dto.setUserId(binRequest.getUserId());
        dto.setRequestType(binRequest.getRequestType());
        dto.setItemType(binRequest.getItemType());
        dto.setQuantity(binRequest.getQuantity());
        dto.setUnitPrice(binRequest.getUnitPrice());
        dto.setTotalAmount(binRequest.getTotalAmount());
        dto.setDeliveryAddress(binRequest.getDeliveryAddress());
        dto.setSpecialInstructions(binRequest.getSpecialInstructions());
        dto.setStatus(binRequest.getStatus());
        dto.setPaymentIntentId(binRequest.getPaymentIntentId());
        dto.setPaymentMethodId(binRequest.getPaymentMethodId());
        dto.setCreatedAt(binRequest.getCreatedAt());
        dto.setUpdatedAt(binRequest.getUpdatedAt());
        dto.setDeliveredAt(binRequest.getDeliveredAt());
        return dto;
    }
}

