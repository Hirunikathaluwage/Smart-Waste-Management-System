package com.csse.smartwaste.pickup.dto;

import java.math.BigDecimal;

/**
 * FeeCalculationDTO - DTO for fee calculation response
 */
public class FeeCalculationDTO {
    
    private BigDecimal baseAmount;
    private BigDecimal urgencyFee;
    private BigDecimal totalAmount;
    private BigDecimal rewardPointsUsed;
    private BigDecimal finalAmount;
    private String calculationBreakdown;

    // Constructors
    public FeeCalculationDTO() {}

    // Getters & Setters
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

    public String getCalculationBreakdown() { return calculationBreakdown; }
    public void setCalculationBreakdown(String calculationBreakdown) { this.calculationBreakdown = calculationBreakdown; }
}
