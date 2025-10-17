package com.csse.smartwaste.binrequest.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * BinRequest Entity - Represents a bin or bag request
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only responsible for bin request data
 * - OCP (Open/Closed): Open for extension with new fields, closed for modification
 * - DIP (Dependency Inversion): Depends on MongoDB abstraction
 * 
 * CODE SMELLS AVOIDED:
 * - No business logic: Pure data entity
 * - Clear naming: Descriptive field names
 * - Proper annotations: MongoDB annotations for persistence
 */
@Document(collection = "bin_requests")
@JsonIgnoreProperties(ignoreUnknown = true)
public class BinRequest {
    
    @Id
    private String id;
    
    @Field("request_id")
    private String requestId;
    
    @Field("user_id")
    private String userId;
    
    @Field("request_type")
    private RequestType requestType;
    
    @Field("item_type")
    private String itemType;
    
    @Field("quantity")
    private Integer quantity;
    
    @Field("unit_price")
    private BigDecimal unitPrice;
    
    @Field("total_amount")
    private BigDecimal totalAmount;
    
    @Field("delivery_address")
    private String deliveryAddress;
    
    @Field("special_instructions")
    private String specialInstructions;
    
    @Field("status")
    private BinRequestStatus status;
    
    @Field("payment_intent_id")
    private String paymentIntentId;
    
    @Field("payment_method_id")
    private String paymentMethodId;
    
    @Field("created_at")
    private LocalDateTime createdAt;
    
    @Field("updated_at")
    private LocalDateTime updatedAt;
    
    @Field("delivered_at")
    private LocalDateTime deliveredAt;

    // Constructors
    public BinRequest() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public BinRequest(String userId, RequestType requestType, String itemType, 
                     Integer quantity, BigDecimal unitPrice, BigDecimal totalAmount,
                     String deliveryAddress, String specialInstructions) {
        this();
        this.userId = userId;
        this.requestType = requestType;
        this.itemType = itemType;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalAmount = totalAmount;
        this.deliveryAddress = deliveryAddress;
        this.specialInstructions = specialInstructions;
        this.status = BinRequestStatus.PENDING;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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
        this.updatedAt = LocalDateTime.now();
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

    @Override
    public String toString() {
        return "BinRequest{" +
                "id='" + id + '\'' +
                ", requestId='" + requestId + '\'' +
                ", userId='" + userId + '\'' +
                ", requestType=" + requestType +
                ", itemType='" + itemType + '\'' +
                ", quantity=" + quantity +
                ", totalAmount=" + totalAmount +
                ", status=" + status +
                '}';
    }
}
