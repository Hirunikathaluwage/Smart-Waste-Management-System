package com.csse.smartwaste.pickup.repository;

import com.csse.smartwaste.pickup.entity.PickupRequest;
import com.csse.smartwaste.common.model.PickupStatus;
import com.csse.smartwaste.common.model.PaymentStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

/**
 * PickupRequestRepository - Repository interface for pickup request operations
 * Follows Repository Pattern - abstracts data access logic
 */
@Repository
public interface PickupRequestRepository extends MongoRepository<PickupRequest, String> {

    // Find requests by user ID
    List<PickupRequest> findByUserId(String userId);

    // Find requests by status
    List<PickupRequest> findByStatus(PickupStatus status);

    // Find requests by payment status
    List<PickupRequest> findByPaymentStatus(PaymentStatus paymentStatus);

    // Find requests by assigned worker
    List<PickupRequest> findByAssignedWorkerId(String workerId);

    // Find requests within date range
    @Query("{'scheduledDateTime': {$gte: ?0, $lte: ?1}}")
    List<PickupRequest> findByScheduledDateTimeBetween(LocalDateTime startDate, LocalDateTime endDate);

    // Find pending payment requests
    @Query("{'paymentStatus': 'PENDING', 'paymentMethod': 'PayLater'}")
    List<PickupRequest> findPendingPaymentRequests();

    // Find requests by city
    List<PickupRequest> findByCity(String city);

    // Find emergency requests
    @Query("{'pickupType': 'EMERGENCY', 'status': {$in: ['PENDING', 'SCHEDULED']}}")
    List<PickupRequest> findEmergencyRequests();

    // Find requests created after a specific date
    List<PickupRequest> findByCreatedAtAfter(LocalDateTime date);

    // Find requests by user and status
    List<PickupRequest> findByUserIdAndStatus(String userId, PickupStatus status);

    // Find requests by user and payment status
    List<PickupRequest> findByUserIdAndPaymentStatus(String userId, PaymentStatus paymentStatus);

    // Count requests by status
    long countByStatus(PickupStatus status);

    // Count requests by payment status
    long countByPaymentStatus(PaymentStatus paymentStatus);

    // Find requests that need payment reminders
    @Query("{'paymentStatus': 'PENDING', 'paymentMethod': 'PayLater', 'lastReminderSent': {$lt: ?0}}")
    List<PickupRequest> findRequestsNeedingPaymentReminder(LocalDateTime reminderThreshold);

    // Find requests by location proximity (using MongoDB geospatial queries)
    @Query("{'latitude': {$gte: ?0, $lte: ?2}, 'longitude': {$gte: ?1, $lte: ?3}}")
    List<PickupRequest> findByLocationRange(Double minLat, Double minLng, Double maxLat, Double maxLng);
}
