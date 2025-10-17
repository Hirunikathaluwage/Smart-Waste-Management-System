package com.csse.smartwaste.binrequest.repository;

import com.csse.smartwaste.binrequest.entity.BinRequest;
import com.csse.smartwaste.binrequest.entity.BinRequestStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * BinRequestRepository - Repository interface for bin request operations
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only responsible for data access
 * - DIP (Dependency Inversion): Depends on MongoDB abstraction
 * - ISP (Interface Segregation): Focused on bin request data access
 * 
 * CODE SMELLS AVOIDED:
 * - No business logic: Pure data access interface
 * - Clear naming: Descriptive method names
 * - Proper annotations: MongoDB repository annotations
 */
@Repository
public interface BinRequestRepository extends MongoRepository<BinRequest, String> {

    /**
     * Find bin request by request ID
     * SRP: Single responsibility - only handles request ID queries
     * 
     * @param requestId the request identifier
     * @return Optional bin request with the request ID
     */
    Optional<BinRequest> findByRequestId(String requestId);

    /**
     * Find all bin requests by user ID
     * SRP: Single responsibility - only handles user-based queries
     * 
     * @param userId the user identifier
     * @return List of bin requests for the user
     */
    List<BinRequest> findByUserIdOrderByCreatedAtDesc(String userId);

    /**
     * Find all bin requests by status
     * SRP: Single responsibility - only handles status-based queries
     * 
     * @param status the request status
     * @return List of bin requests with the specified status
     */
    List<BinRequest> findByStatusOrderByCreatedAtDesc(BinRequestStatus status);

    /**
     * Find bin requests by user ID and status
     * SRP: Single responsibility - only handles user and status-based queries
     * 
     * @param userId the user identifier
     * @param status the request status
     * @return List of bin requests for the user with the specified status
     */
    List<BinRequest> findByUserIdAndStatusOrderByCreatedAtDesc(String userId, BinRequestStatus status);

    /**
     * Count bin requests by status
     * SRP: Single responsibility - only handles status counting
     * 
     * @param status the request status
     * @return Count of bin requests with the specified status
     */
    long countByStatus(BinRequestStatus status);

    /**
     * Count bin requests by user ID
     * SRP: Single responsibility - only handles user counting
     * 
     * @param userId the user identifier
     * @return Count of bin requests for the user
     */
    long countByUserId(String userId);

    /**
     * Find bin requests created between dates
     * SRP: Single responsibility - only handles date range queries
     * 
     * @param startDate the start date
     * @param endDate the end date
     * @return List of bin requests created between the dates
     */
    List<BinRequest> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find bin requests by user ID created between dates
     * SRP: Single responsibility - only handles user and date range queries
     * 
     * @param userId the user identifier
     * @param startDate the start date
     * @param endDate the end date
     * @return List of bin requests for the user created between the dates
     */
    List<BinRequest> findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(
            String userId, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Get total revenue from completed requests
     * SRP: Single responsibility - only handles revenue calculation
     * 
     * @return Total revenue from delivered requests
     */
    @Query("{ 'status': 'DELIVERED' }")
    List<BinRequest> findDeliveredRequests();

    /**
     * Get total revenue from completed requests for a specific user
     * SRP: Single responsibility - only handles user revenue calculation
     * 
     * @param userId the user identifier
     * @return Total revenue from delivered requests for the user
     */
    @Query("{ 'userId': ?0, 'status': 'DELIVERED' }")
    List<BinRequest> findDeliveredRequestsByUserId(String userId);

    /**
     * Find bin requests by payment intent ID
     * SRP: Single responsibility - only handles payment-based queries
     * 
     * @param paymentIntentId the payment intent identifier
     * @return Optional bin request with the payment intent ID
     */
    Optional<BinRequest> findByPaymentIntentId(String paymentIntentId);

    /**
     * Check if bin request exists by payment intent ID
     * SRP: Single responsibility - only handles existence checking
     * 
     * @param paymentIntentId the payment intent identifier
     * @return true if bin request exists with the payment intent ID
     */
    boolean existsByPaymentIntentId(String paymentIntentId);
}
