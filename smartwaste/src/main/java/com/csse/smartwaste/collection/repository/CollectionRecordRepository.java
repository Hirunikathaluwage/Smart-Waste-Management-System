package com.csse.smartwaste.collection.repository;

import com.csse.smartwaste.collection.entity.CollectionRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * CollectionRecord Repository - Handles data access operations for CollectionRecord entities
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only responsible for data access operations
 * - DIP (Dependency Inversion): Depends on abstraction (MongoRepository) not concrete implementation
 * - ISP (Interface Segregation): Provides focused, specific methods for collection operations
 * 
 * CODE SMELLS AVOIDED:
 * - No fat interfaces: Methods are focused and specific
 * - No data access logic in service layer: Repository handles all data operations
 * - Clear method naming: Descriptive method names
 * - Proper abstraction: Uses Spring Data MongoDB abstractions
 */
@Repository
public interface CollectionRecordRepository extends MongoRepository<CollectionRecord, String> {

    /**
     * Find collection records by worker ID
     * SRP: Single responsibility - only finds by workerId
     * 
     * @param workerId the worker identifier
     * @return List of collection records for the specified worker
     */
    List<CollectionRecord> findByWorkerId(String workerId);

    /**
     * Find collection records by bin ID
     * SRP: Single responsibility - only finds by binId
     * 
     * @param binId the bin identifier
     * @return List of collection records for the specified bin
     */
    List<CollectionRecord> findByBinId(String binId);

    /**
     * Find collection records by status
     * SRP: Single responsibility - only finds by status
     * 
     * @param status the collection status
     * @return List of collection records with the specified status
     */
    List<CollectionRecord> findByStatus(CollectionRecord.CollectionStatus status);

    /**
     * Find collection records by worker ID and date range
     * SRP: Single responsibility - only finds by worker and date range
     * 
     * @param workerId the worker identifier
     * @param startDate the start date
     * @param endDate the end date
     * @return List of collection records for the specified worker within date range
     */
    List<CollectionRecord> findByWorkerIdAndCollectionDateBetween(String workerId, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find today's collection records for a worker
     * SRP: Single responsibility - only finds today's records for worker
     * 
     * @param workerId the worker identifier
     * @param startOfDay the start of today
     * @param endOfDay the end of today
     * @return List of today's collection records for the specified worker
     */
    @Query("{'workerId': ?0, 'collectionDate': {$gte: ?1, $lte: ?2}}")
    List<CollectionRecord> findTodayCollectionsByWorker(String workerId, LocalDateTime startOfDay, LocalDateTime endOfDay);

    /**
     * Check if bin was already collected today
     * SRP: Single responsibility - only checks if bin was collected today
     * 
     * @param binId the bin identifier
     * @param startOfDay the start of today
     * @param endOfDay the end of today
     * @return true if bin was collected today, false otherwise
     */
    @Query(value = "{'binId': ?0, 'collectionDate': {$gte: ?1, $lte: ?2}, 'status': {$in: ['COLLECTED', 'OVERRIDE']}}", exists = true)
    boolean existsByBinIdAndCollectionDateBetweenAndStatusIn(String binId, LocalDateTime startOfDay, LocalDateTime endOfDay);

    /**
     * Count collection records by worker ID
     * SRP: Single responsibility - only counts by worker
     * 
     * @param workerId the worker identifier
     * @return count of collection records for the specified worker
     */
    long countByWorkerId(String workerId);

    /**
     * Count collection records by status
     * SRP: Single responsibility - only counts by status
     * 
     * @param status the collection status
     * @return count of collection records with the specified status
     */
    long countByStatus(CollectionRecord.CollectionStatus status);

    /**
     * Find the latest collection record for a bin
     * SRP: Single responsibility - only finds latest record for bin
     * 
     * @param binId the bin identifier
     * @return Optional containing the latest collection record for the specified bin
     */
    Optional<CollectionRecord> findFirstByBinIdOrderByCollectionDateDesc(String binId);
}
