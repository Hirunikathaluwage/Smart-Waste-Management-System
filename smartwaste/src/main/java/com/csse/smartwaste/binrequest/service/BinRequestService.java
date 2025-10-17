package com.csse.smartwaste.binrequest.service;

import com.csse.smartwaste.binrequest.dto.BinRequestDto;
import com.csse.smartwaste.binrequest.dto.BinRequestResponseDto;
import com.csse.smartwaste.binrequest.entity.BinRequest;
import com.csse.smartwaste.binrequest.entity.BinRequestStatus;
import com.csse.smartwaste.binrequest.repository.BinRequestRepository;
import com.csse.smartwaste.common.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * BinRequestService - Handles business logic for bin request operations
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only responsible for bin request business logic
 * - DIP (Dependency Inversion): Depends on repository abstraction, not concrete implementation
 * - OCP (Open/Closed): Open for extension with new business logic, closed for modification
 * - ISP (Interface Segregation): Provides focused service methods
 * 
 * CODE SMELLS AVOIDED:
 * - No God class: Focused only on bin request business logic
 * - No duplicate code: Reusable methods
 * - No long parameter lists: Uses DTOs for complex data
 * - Proper error handling: Uses custom exceptions
 * - Clear method naming: Descriptive method names
 */
@Service
@Transactional
public class BinRequestService {

    private final BinRequestRepository binRequestRepository;

    /**
     * Constructor injection - follows Dependency Injection best practice
     * DIP: Depends on abstraction (BinRequestRepository interface) not concrete implementation
     */
    @Autowired
    public BinRequestService(BinRequestRepository binRequestRepository) {
        this.binRequestRepository = binRequestRepository;
    }

    /**
     * Create a new bin request
     * SRP: Single responsibility - only handles bin request creation logic
     * 
     * @param binRequestDto the bin request creation request
     * @return BinRequestResponseDto containing the created request
     */
    public BinRequestResponseDto createBinRequest(BinRequestDto binRequestDto) {
        // Generate unique request ID
        String requestId = "BR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        // Convert DTO to entity
        BinRequest binRequest = binRequestDto.toEntity();
        binRequest.setRequestId(requestId);
        
        // Save bin request
        BinRequest savedRequest = binRequestRepository.save(binRequest);
        
        // Convert entity to response DTO
        return BinRequestResponseDto.fromEntity(savedRequest);
    }

    /**
     * Get bin request by ID
     * SRP: Single responsibility - only handles bin request retrieval logic
     * 
     * @param requestId the unique request identifier
     * @return BinRequestResponseDto containing the request
     * @throws ResourceNotFoundException if request not found
     */
    public BinRequestResponseDto getBinRequestById(String requestId) {
        BinRequest binRequest = binRequestRepository.findByRequestId(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("BinRequest", "requestId", requestId));
        
        return BinRequestResponseDto.fromEntity(binRequest);
    }

    /**
     * Get all bin requests
     * SRP: Single responsibility - only handles bin request retrieval logic
     * 
     * @return List of BinRequestResponseDto containing all requests
     */
    public List<BinRequestResponseDto> getAllBinRequests() {
        List<BinRequest> binRequests = binRequestRepository.findAll();
        return binRequests.stream()
                .map(BinRequestResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get bin requests by user ID
     * SRP: Single responsibility - only handles user-based request retrieval logic
     * 
     * @param userId the user identifier
     * @return List of BinRequestResponseDto containing requests for the user
     */
    public List<BinRequestResponseDto> getBinRequestsByUserId(String userId) {
        List<BinRequest> binRequests = binRequestRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return binRequests.stream()
                .map(BinRequestResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Update bin request status
     * SRP: Single responsibility - only handles bin request status update logic
     * 
     * @param requestId the unique request identifier
     * @param status the new status
     * @return BinRequestResponseDto containing the updated request
     * @throws ResourceNotFoundException if request not found
     */
    public BinRequestResponseDto updateBinRequestStatus(String requestId, String status) {
        BinRequest binRequest = binRequestRepository.findByRequestId(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("BinRequest", "requestId", requestId));
        
        BinRequestStatus newStatus = BinRequestStatus.valueOf(status.toUpperCase());
        binRequest.setStatus(newStatus);
        binRequest.setUpdatedAt(LocalDateTime.now());
        
        // Set delivered date if status is DELIVERED
        if (newStatus == BinRequestStatus.DELIVERED) {
            binRequest.setDeliveredAt(LocalDateTime.now());
        }
        
        BinRequest updatedRequest = binRequestRepository.save(binRequest);
        
        return BinRequestResponseDto.fromEntity(updatedRequest);
    }

    /**
     * Cancel bin request
     * SRP: Single responsibility - only handles bin request cancellation logic
     * 
     * @param requestId the unique request identifier
     * @return BinRequestResponseDto containing the cancelled request
     * @throws ResourceNotFoundException if request not found
     */
    public BinRequestResponseDto cancelBinRequest(String requestId) {
        BinRequest binRequest = binRequestRepository.findByRequestId(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("BinRequest", "requestId", requestId));
        
        // Only allow cancellation if request is not already delivered
        if (binRequest.getStatus() == BinRequestStatus.DELIVERED) {
            throw new IllegalStateException("Cannot cancel a delivered request");
        }
        
        binRequest.setStatus(BinRequestStatus.CANCELLED);
        binRequest.setUpdatedAt(LocalDateTime.now());
        
        BinRequest cancelledRequest = binRequestRepository.save(binRequest);
        
        return BinRequestResponseDto.fromEntity(cancelledRequest);
    }

    /**
     * Get bin request statistics
     * SRP: Single responsibility - only handles statistics calculation logic
     * 
     * @return Map containing request statistics
     */
    public Map<String, Object> getBinRequestStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        // Total requests
        long totalRequests = binRequestRepository.count();
        statistics.put("totalRequests", totalRequests);
        
        // Status counts
        Map<String, Long> statusCounts = new HashMap<>();
        for (BinRequestStatus status : BinRequestStatus.values()) {
            long count = binRequestRepository.countByStatus(status);
            statusCounts.put(status.name(), count);
        }
        statistics.put("statusCounts", statusCounts);
        
        // Total revenue
        List<BinRequest> deliveredRequests = binRequestRepository.findDeliveredRequests();
        Double totalRevenue = deliveredRequests.stream()
                .mapToDouble(req -> req.getTotalAmount().doubleValue())
                .sum();
        statistics.put("totalRevenue", totalRevenue);
        
        // Recent requests (last 30 days)
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<BinRequest> recentRequests = binRequestRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(
                thirtyDaysAgo, LocalDateTime.now());
        statistics.put("recentRequests", recentRequests.size());
        
        return statistics;
    }

    /**
     * Get bin request statistics for a specific user
     * SRP: Single responsibility - only handles user statistics calculation logic
     * 
     * @param userId the user identifier
     * @return Map containing user request statistics
     */
    public Map<String, Object> getBinRequestStatisticsByUserId(String userId) {
        Map<String, Object> statistics = new HashMap<>();
        
        // Total requests for user
        long totalRequests = binRequestRepository.countByUserId(userId);
        statistics.put("totalRequests", totalRequests);
        
        // Status counts for user
        Map<String, Long> statusCounts = new HashMap<>();
        for (BinRequestStatus status : BinRequestStatus.values()) {
            long count = binRequestRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, status).size();
            statusCounts.put(status.name(), count);
        }
        statistics.put("statusCounts", statusCounts);
        
        // Total revenue for user
        List<BinRequest> deliveredRequests = binRequestRepository.findDeliveredRequestsByUserId(userId);
        Double totalRevenue = deliveredRequests.stream()
                .mapToDouble(req -> req.getTotalAmount().doubleValue())
                .sum();
        statistics.put("totalRevenue", totalRevenue);
        
        // Recent requests for user (last 30 days)
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<BinRequest> recentRequests = binRequestRepository.findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(
                userId, thirtyDaysAgo, LocalDateTime.now());
        statistics.put("recentRequests", recentRequests.size());
        
        return statistics;
    }

    /**
     * Find bin request by payment intent ID
     * SRP: Single responsibility - only handles payment-based request retrieval logic
     * 
     * @param paymentIntentId the payment intent identifier
     * @return BinRequestResponseDto containing the request
     * @throws ResourceNotFoundException if request not found
     */
    public BinRequestResponseDto getBinRequestByPaymentIntentId(String paymentIntentId) {
        BinRequest binRequest = binRequestRepository.findByPaymentIntentId(paymentIntentId)
                .orElseThrow(() -> new ResourceNotFoundException("BinRequest", "paymentIntentId", paymentIntentId));
        
        return BinRequestResponseDto.fromEntity(binRequest);
    }

    /**
     * Update bin request payment information
     * SRP: Single responsibility - only handles payment information update logic
     * 
     * @param requestId the unique request identifier
     * @param paymentIntentId the payment intent identifier
     * @param paymentMethodId the payment method identifier
     * @return BinRequestResponseDto containing the updated request
     * @throws ResourceNotFoundException if request not found
     */
    public BinRequestResponseDto updateBinRequestPaymentInfo(String requestId, String paymentIntentId, String paymentMethodId) {
        BinRequest binRequest = binRequestRepository.findByRequestId(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("BinRequest", "requestId", requestId));
        
        binRequest.setPaymentIntentId(paymentIntentId);
        binRequest.setPaymentMethodId(paymentMethodId);
        binRequest.setStatus(BinRequestStatus.CONFIRMED);
        binRequest.setUpdatedAt(LocalDateTime.now());
        
        BinRequest updatedRequest = binRequestRepository.save(binRequest);
        
        return BinRequestResponseDto.fromEntity(updatedRequest);
    }

    /**
     * Get user bin request statistics
     * SRP: Single responsibility - only handles user statistics calculation
     * 
     * @param userId the user identifier
     * @return Map containing user statistics
     */
    public Map<String, Object> getUserBinRequestStatistics(String userId) {
        List<BinRequest> userRequests = binRequestRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("totalRequests", userRequests.size());
        statistics.put("pendingRequests", userRequests.stream()
                .filter(req -> req.getStatus() == BinRequestStatus.PENDING)
                .count());
        statistics.put("confirmedRequests", userRequests.stream()
                .filter(req -> req.getStatus() == BinRequestStatus.CONFIRMED)
                .count());
        statistics.put("deliveredRequests", userRequests.stream()
                .filter(req -> req.getStatus() == BinRequestStatus.DELIVERED)
                .count());
        statistics.put("cancelledRequests", userRequests.stream()
                .filter(req -> req.getStatus() == BinRequestStatus.CANCELLED)
                .count());
        
        // Calculate total amount spent
        double totalAmount = userRequests.stream()
                .filter(req -> req.getStatus() == BinRequestStatus.DELIVERED)
                .mapToDouble(req -> req.getTotalAmount().doubleValue())
                .sum();
        statistics.put("totalAmountSpent", totalAmount);
        
        return statistics;
    }
}
