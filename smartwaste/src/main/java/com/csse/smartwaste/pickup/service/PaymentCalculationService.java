package com.csse.smartwaste.pickup.service;

import com.csse.smartwaste.pickup.dto.FeeCalculationDTO;
import com.csse.smartwaste.pickup.dto.PickupRequestCreateDTO;
import com.csse.smartwaste.common.model.PickupType;
import com.csse.smartwaste.common.model.WasteType;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;

/**
 * PaymentCalculationService - Service for calculating pickup fees
 * Follows Single Responsibility Principle - only handles fee calculations
 */
@Service
public class PaymentCalculationService {

    // Fee calculation constants
    private static final BigDecimal BASE_FEE_BULKY = new BigDecimal("25.00");
    private static final BigDecimal BASE_FEE_E_WASTE = new BigDecimal("15.00");
    private static final BigDecimal BASE_FEE_GENERAL = new BigDecimal("10.00");
    private static final BigDecimal EMERGENCY_MULTIPLIER = new BigDecimal("1.5");
    private static final BigDecimal EXTRA_MULTIPLIER = new BigDecimal("1.2");
    private static final BigDecimal REWARD_POINT_VALUE = new BigDecimal("0.01");

    /**
     * Calculate fees for a pickup request
     */
    public FeeCalculationDTO calculateFees(PickupRequestCreateDTO createDTO) {
        FeeCalculationDTO calculation = new FeeCalculationDTO();

        // Calculate base amount based on waste type
        BigDecimal baseAmount = calculateBaseAmount(createDTO.getWasteType(), createDTO.getEstimatedWeight());
        calculation.setBaseAmount(baseAmount);

        // Calculate urgency fee
        BigDecimal urgencyFee = calculateUrgencyFee(baseAmount, createDTO.getPickupType());
        calculation.setUrgencyFee(urgencyFee);

        // Calculate total amount
        BigDecimal totalAmount = baseAmount.add(urgencyFee);
        calculation.setTotalAmount(totalAmount);

        // Calculate reward points deduction
        BigDecimal rewardPointsUsed = createDTO.getRewardPointsUsed() != null ? 
                createDTO.getRewardPointsUsed() : BigDecimal.ZERO;
        BigDecimal rewardDeduction = rewardPointsUsed.multiply(REWARD_POINT_VALUE);
        calculation.setRewardPointsUsed(rewardPointsUsed);

        // Calculate final amount
        BigDecimal finalAmount = totalAmount.subtract(rewardDeduction);
        if (finalAmount.compareTo(BigDecimal.ZERO) < 0) {
            finalAmount = BigDecimal.ZERO;
        }
        calculation.setFinalAmount(finalAmount);

        // Create breakdown description
        String breakdown = String.format(
                "Base Amount: $%.2f, Urgency Fee: $%.2f, Reward Points Used: %.0f points ($%.2f), Final Amount: $%.2f",
                baseAmount, urgencyFee, rewardPointsUsed, rewardDeduction, finalAmount
        );
        calculation.setCalculationBreakdown(breakdown);

        return calculation;
    }

    /**
     * Calculate base amount based on waste type and weight
     */
    private BigDecimal calculateBaseAmount(WasteType wasteType, BigDecimal weight) {
        BigDecimal baseFee;
        switch (wasteType) {
            case BULKY_WASTE:
                baseFee = BASE_FEE_BULKY;
                break;
            case E_WASTE:
                baseFee = BASE_FEE_E_WASTE;
                break;
            default:
                baseFee = BASE_FEE_GENERAL;
                break;
        }

        // Add weight-based pricing if weight is provided
        if (weight != null && weight.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal weightFee = weight.multiply(new BigDecimal("2.00")); // $2 per kg
            baseFee = baseFee.add(weightFee);
        }

        return baseFee;
    }

    /**
     * Calculate urgency fee based on pickup type
     */
    private BigDecimal calculateUrgencyFee(BigDecimal baseAmount, PickupType pickupType) {
        switch (pickupType) {
            case EMERGENCY:
                return baseAmount.multiply(EMERGENCY_MULTIPLIER).subtract(baseAmount);
            case EXTRA:
                return baseAmount.multiply(EXTRA_MULTIPLIER).subtract(baseAmount);
            default:
                return BigDecimal.ZERO;
        }
    }

    /**
     * Get reward point value
     */
    public BigDecimal getRewardPointValue() {
        return REWARD_POINT_VALUE;
    }
}
