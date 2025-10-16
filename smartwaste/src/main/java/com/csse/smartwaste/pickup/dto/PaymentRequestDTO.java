package com.csse.smartwaste.pickup.dto;

import java.math.BigDecimal;

/**
 * PaymentRequestDTO - DTO for payment processing
 */
public class PaymentRequestDTO {
    
    private String requestId;
    private String paymentMethod; // Cash, Card, Points, PayLater
    private BigDecimal amount;
    private BigDecimal rewardPointsUsed;
    private String paymentReference;
    private String cardToken; // For card payments
    private String cardLastFour; // For card payments

    // Constructors
    public PaymentRequestDTO() {}

    // Getters & Setters
    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public BigDecimal getRewardPointsUsed() { return rewardPointsUsed; }
    public void setRewardPointsUsed(BigDecimal rewardPointsUsed) { this.rewardPointsUsed = rewardPointsUsed; }

    public String getPaymentReference() { return paymentReference; }
    public void setPaymentReference(String paymentReference) { this.paymentReference = paymentReference; }

    public String getCardToken() { return cardToken; }
    public void setCardToken(String cardToken) { this.cardToken = cardToken; }

    public String getCardLastFour() { return cardLastFour; }
    public void setCardLastFour(String cardLastFour) { this.cardLastFour = cardLastFour; }
}
