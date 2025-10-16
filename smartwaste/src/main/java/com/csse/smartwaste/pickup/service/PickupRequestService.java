package com.csse.smartwaste.pickup.service;

import com.csse.smartwaste.pickup.dto.*;
import com.csse.smartwaste.pickup.entity.PickupRequest;
import com.csse.smartwaste.pickup.repository.PickupRequestRepository;
import com.csse.smartwaste.login.entity.User;
import com.csse.smartwaste.login.repository.UserRepository;
import com.csse.smartwaste.common.model.*;
import com.csse.smartwaste.common.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * PickupRequestService - Service layer for pickup request business logic
 * Follows Service Layer Pattern - encapsulates business logic
 */
@Service
@Transactional
public class PickupRequestService {

    @Autowired
    private PickupRequestRepository pickupRequestRepository;

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private NotificationService notificationService;

    // Fee calculation constants
    private static final BigDecimal BASE_FEE_BULKY = new BigDecimal("25.00");
    private static final BigDecimal BASE_FEE_E_WASTE = new BigDecimal("15.00");
    private static final BigDecimal BASE_FEE_GENERAL = new BigDecimal("10.00");
    private static final BigDecimal EMERGENCY_MULTIPLIER = new BigDecimal("1.5");
    private static final BigDecimal EXTRA_MULTIPLIER = new BigDecimal("1.2");
    private static final BigDecimal REWARD_POINT_VALUE = new BigDecimal("0.01"); // 1 point = $0.01

    /**
     * Create a new pickup request
     */
    public PickupRequestResponseDTO createPickupRequest(PickupRequestCreateDTO createDTO) {
        // Validate user exists
        User user = userRepository.findById(createDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + createDTO.getUserId()));

        // Create pickup request entity
        PickupRequest pickupRequest = new PickupRequest();
        pickupRequest.setRequestId(UUID.randomUUID().toString());
        pickupRequest.setUserId(createDTO.getUserId());
        pickupRequest.setUserName(user.getName());
        pickupRequest.setUserEmail(user.getEmail());
        pickupRequest.setUserPhone(user.getPhone());

        // Set waste details
        pickupRequest.setWasteType(createDTO.getWasteType());
        pickupRequest.setItemDescription(createDTO.getItemDescription());
        pickupRequest.setItemImages(createDTO.getItemImages());
        pickupRequest.setEstimatedWeight(createDTO.getEstimatedWeight());
        pickupRequest.setSpecialInstructions(createDTO.getSpecialInstructions());

        // Set pickup details
        pickupRequest.setPickupType(createDTO.getPickupType());
        pickupRequest.setPreferredDateTime(createDTO.getPreferredDateTime());
        pickupRequest.setPickupLocation(createDTO.getPickupLocation());
        pickupRequest.setAddress(createDTO.getAddress());
        pickupRequest.setCity(createDTO.getCity());
        pickupRequest.setPostalCode(createDTO.getPostalCode());
        pickupRequest.setLatitude(createDTO.getLatitude());
        pickupRequest.setLongitude(createDTO.getLongitude());

        // Calculate fees
        FeeCalculationDTO feeCalculation = calculateFees(createDTO);
        pickupRequest.setBaseAmount(feeCalculation.getBaseAmount());
        pickupRequest.setUrgencyFee(feeCalculation.getUrgencyFee());
        pickupRequest.setTotalAmount(feeCalculation.getTotalAmount());
        pickupRequest.setRewardPointsUsed(createDTO.getRewardPointsUsed());
        pickupRequest.setFinalAmount(feeCalculation.getFinalAmount());

        // Set payment details
        pickupRequest.setPaymentMethod(createDTO.getPaymentMethod());
        if ("PayLater".equals(createDTO.getPaymentMethod())) {
            pickupRequest.setPaymentStatus(PaymentStatus.PENDING);
        } else {
            pickupRequest.setPaymentStatus(PaymentStatus.COMPLETED);
            pickupRequest.setPaymentDate(LocalDateTime.now());
        }

        // Set initial status
        pickupRequest.setStatus(PickupStatus.DRAFT);

        // Save the request
        PickupRequest savedRequest = pickupRequestRepository.save(pickupRequest);

        // Send notifications
        notificationService.sendPickupRequestConfirmation(savedRequest);

        return convertToResponseDTO(savedRequest);
    }

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
     * Get pickup request by ID
     */
    public PickupRequestResponseDTO getPickupRequestById(String requestId) {
        PickupRequest pickupRequest = pickupRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup request not found with ID: " + requestId));
        return convertToResponseDTO(pickupRequest);
    }

    /**
     * Get pickup requests by user ID
     */
    public List<PickupRequestResponseDTO> getPickupRequestsByUserId(String userId) {
        List<PickupRequest> requests = pickupRequestRepository.findByUserId(userId);
        return requests.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Update pickup request
     */
    public PickupRequestResponseDTO updatePickupRequest(String requestId, PickupRequestUpdateDTO updateDTO) {
        PickupRequest pickupRequest = pickupRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup request not found with ID: " + requestId));

        // Update fields if provided
        if (updateDTO.getItemDescription() != null) {
            pickupRequest.setItemDescription(updateDTO.getItemDescription());
        }
        if (updateDTO.getEstimatedWeight() != null) {
            pickupRequest.setEstimatedWeight(updateDTO.getEstimatedWeight());
        }
        if (updateDTO.getSpecialInstructions() != null) {
            pickupRequest.setSpecialInstructions(updateDTO.getSpecialInstructions());
        }
        if (updateDTO.getPreferredDateTime() != null) {
            pickupRequest.setPreferredDateTime(updateDTO.getPreferredDateTime());
        }
        if (updateDTO.getPickupLocation() != null) {
            pickupRequest.setPickupLocation(updateDTO.getPickupLocation());
        }
        if (updateDTO.getAddress() != null) {
            pickupRequest.setAddress(updateDTO.getAddress());
        }
        if (updateDTO.getCity() != null) {
            pickupRequest.setCity(updateDTO.getCity());
        }
        if (updateDTO.getPostalCode() != null) {
            pickupRequest.setPostalCode(updateDTO.getPostalCode());
        }
        if (updateDTO.getLatitude() != null) {
            pickupRequest.setLatitude(updateDTO.getLatitude());
        }
        if (updateDTO.getLongitude() != null) {
            pickupRequest.setLongitude(updateDTO.getLongitude());
        }
        if (updateDTO.getStatus() != null) {
            pickupRequest.setStatus(updateDTO.getStatus());
        }
        if (updateDTO.getAdminNotes() != null) {
            pickupRequest.setAdminNotes(updateDTO.getAdminNotes());
        }
        if (updateDTO.getAssignedWorkerId() != null) {
            pickupRequest.setAssignedWorkerId(updateDTO.getAssignedWorkerId());
        }
        if (updateDTO.getAssignedWorkerName() != null) {
            pickupRequest.setAssignedWorkerName(updateDTO.getAssignedWorkerName());
        }

        pickupRequest.setUpdatedAt(LocalDateTime.now());

        PickupRequest savedRequest = pickupRequestRepository.save(pickupRequest);
        return convertToResponseDTO(savedRequest);
    }

    /**
     * Process payment for pickup request
     */
    public PickupRequestResponseDTO processPayment(String requestId, PaymentRequestDTO paymentDTO) {
        PickupRequest pickupRequest = pickupRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup request not found with ID: " + requestId));

        // Validate payment amount
        if (paymentDTO.getAmount().compareTo(pickupRequest.getFinalAmount()) != 0) {
            throw new IllegalArgumentException("Payment amount does not match the calculated amount");
        }

        // Process payment based on method
        switch (paymentDTO.getPaymentMethod()) {
            case "Cash":
                processCashPayment(pickupRequest, paymentDTO);
                break;
            case "Card":
                processCardPayment(pickupRequest, paymentDTO);
                break;
            case "Points":
                processPointsPayment(pickupRequest, paymentDTO);
                break;
            case "PayLater":
                processPayLaterPayment(pickupRequest, paymentDTO);
                break;
            default:
                throw new IllegalArgumentException("Invalid payment method: " + paymentDTO.getPaymentMethod());
        }

        pickupRequest.setUpdatedAt(LocalDateTime.now());
        PickupRequest savedRequest = pickupRequestRepository.save(pickupRequest);

        // Send payment confirmation
        notificationService.sendPaymentConfirmation(savedRequest);

        return convertToResponseDTO(savedRequest);
    }

    /**
     * Cancel pickup request
     */
    public PickupRequestResponseDTO cancelPickupRequest(String requestId, String reason) {
        PickupRequest pickupRequest = pickupRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup request not found with ID: " + requestId));

        if (pickupRequest.getStatus() == PickupStatus.COMPLETED) {
            throw new IllegalArgumentException("Cannot cancel a completed pickup request");
        }

        pickupRequest.setStatus(PickupStatus.CANCELLED);
        pickupRequest.setAdminNotes(reason);
        pickupRequest.setUpdatedAt(LocalDateTime.now());

        PickupRequest savedRequest = pickupRequestRepository.save(pickupRequest);

        // Send cancellation notification
        notificationService.sendCancellationNotification(savedRequest);

        return convertToResponseDTO(savedRequest);
    }

    /**
     * Get all pickup requests (for admin)
     */
    public List<PickupRequestResponseDTO> getAllPickupRequests() {
        List<PickupRequest> requests = pickupRequestRepository.findAll();
        return requests.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get pickup requests by status
     */
    public List<PickupRequestResponseDTO> getPickupRequestsByStatus(PickupStatus status) {
        List<PickupRequest> requests = pickupRequestRepository.findByStatus(status);
        return requests.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get emergency pickup requests
     */
    public List<PickupRequestResponseDTO> getEmergencyPickupRequests() {
        List<PickupRequest> requests = pickupRequestRepository.findEmergencyRequests();
        return requests.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get pending payment requests
     */
    public List<PickupRequestResponseDTO> getPendingPaymentRequests() {
        List<PickupRequest> requests = pickupRequestRepository.findPendingPaymentRequests();
        return requests.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get pickup request statistics
     */
    public PickupStatsDTO getPickupStats() {
        PickupStatsDTO stats = new PickupStatsDTO();
        
        // Count requests by status
        stats.setTotalRequests(pickupRequestRepository.count());
        stats.setPendingRequests(pickupRequestRepository.countByStatus(PickupStatus.PENDING));
        stats.setScheduledRequests(pickupRequestRepository.countByStatus(PickupStatus.SCHEDULED));
        stats.setCompletedRequests(pickupRequestRepository.countByStatus(PickupStatus.COMPLETED));
        stats.setCancelledRequests(pickupRequestRepository.countByStatus(PickupStatus.CANCELLED));
        
        // Count emergency requests
        stats.setEmergencyRequests(pickupRequestRepository.findEmergencyRequests().size());
        
        // Calculate revenue
        List<PickupRequest> allRequests = pickupRequestRepository.findAll();
        BigDecimal totalRevenue = allRequests.stream()
                .filter(req -> req.getPaymentStatus() == PaymentStatus.COMPLETED)
                .map(PickupRequest::getFinalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setTotalRevenue(totalRevenue);
        
        // Calculate pending payments
        BigDecimal pendingPayments = allRequests.stream()
                .filter(req -> req.getPaymentStatus() == PaymentStatus.PENDING)
                .map(PickupRequest::getFinalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setPendingPayments(pendingPayments);
        
        // Count requests this month and week
        LocalDateTime monthAgo = LocalDateTime.now().minusMonths(1);
        LocalDateTime weekAgo = LocalDateTime.now().minusWeeks(1);
        
        stats.setRequestsThisMonth(pickupRequestRepository.findByCreatedAtAfter(monthAgo).size());
        stats.setRequestsThisWeek(pickupRequestRepository.findByCreatedAtAfter(weekAgo).size());
        
        return stats;
    }

    // Private helper methods

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

    private void processCashPayment(PickupRequest pickupRequest, PaymentRequestDTO paymentDTO) {
        pickupRequest.setPaymentStatus(PaymentStatus.COMPLETED);
        pickupRequest.setPaymentDate(LocalDateTime.now());
        pickupRequest.setPaymentReference(paymentDTO.getPaymentReference());
    }

    private void processCardPayment(PickupRequest pickupRequest, PaymentRequestDTO paymentDTO) {
        // In a real implementation, integrate with payment gateway
        pickupRequest.setPaymentStatus(PaymentStatus.COMPLETED);
        pickupRequest.setPaymentDate(LocalDateTime.now());
        pickupRequest.setPaymentReference(paymentDTO.getPaymentReference());
    }

    private void processPointsPayment(PickupRequest pickupRequest, PaymentRequestDTO paymentDTO) {
        // Deduct reward points from user account
        pickupRequest.setPaymentStatus(PaymentStatus.COMPLETED);
        pickupRequest.setPaymentDate(LocalDateTime.now());
        pickupRequest.setPaymentReference("POINTS_" + System.currentTimeMillis());
    }

    private void processPayLaterPayment(PickupRequest pickupRequest, PaymentRequestDTO paymentDTO) {
        pickupRequest.setPaymentStatus(PaymentStatus.PENDING);
        pickupRequest.setPaymentReference("PAYLATER_" + System.currentTimeMillis());
    }

    private PickupRequestResponseDTO convertToResponseDTO(PickupRequest pickupRequest) {
        PickupRequestResponseDTO dto = new PickupRequestResponseDTO();
        dto.setRequestId(pickupRequest.getRequestId());
        dto.setUserId(pickupRequest.getUserId());
        dto.setUserName(pickupRequest.getUserName());
        dto.setUserEmail(pickupRequest.getUserEmail());
        dto.setUserPhone(pickupRequest.getUserPhone());
        dto.setWasteType(pickupRequest.getWasteType());
        dto.setItemDescription(pickupRequest.getItemDescription());
        dto.setItemImages(pickupRequest.getItemImages());
        dto.setEstimatedWeight(pickupRequest.getEstimatedWeight());
        dto.setSpecialInstructions(pickupRequest.getSpecialInstructions());
        dto.setPickupType(pickupRequest.getPickupType());
        dto.setPreferredDateTime(pickupRequest.getPreferredDateTime());
        dto.setScheduledDateTime(pickupRequest.getScheduledDateTime());
        dto.setPickupLocation(pickupRequest.getPickupLocation());
        dto.setAddress(pickupRequest.getAddress());
        dto.setCity(pickupRequest.getCity());
        dto.setPostalCode(pickupRequest.getPostalCode());
        dto.setLatitude(pickupRequest.getLatitude());
        dto.setLongitude(pickupRequest.getLongitude());
        dto.setBaseAmount(pickupRequest.getBaseAmount());
        dto.setUrgencyFee(pickupRequest.getUrgencyFee());
        dto.setTotalAmount(pickupRequest.getTotalAmount());
        dto.setRewardPointsUsed(pickupRequest.getRewardPointsUsed());
        dto.setFinalAmount(pickupRequest.getFinalAmount());
        dto.setPaymentStatus(pickupRequest.getPaymentStatus());
        dto.setPaymentMethod(pickupRequest.getPaymentMethod());
        dto.setPaymentReference(pickupRequest.getPaymentReference());
        dto.setPaymentDate(pickupRequest.getPaymentDate());
        dto.setStatus(pickupRequest.getStatus());
        dto.setAssignedWorkerId(pickupRequest.getAssignedWorkerId());
        dto.setAssignedWorkerName(pickupRequest.getAssignedWorkerName());
        dto.setAdminNotes(pickupRequest.getAdminNotes());
        dto.setCreatedAt(pickupRequest.getCreatedAt());
        dto.setUpdatedAt(pickupRequest.getUpdatedAt());
        dto.setCompletedAt(pickupRequest.getCompletedAt());
        return dto;
    }
}
