package com.csse.smartwaste.collection.service;

import com.csse.smartwaste.collection.dto.CollectionRecordRequest;
import com.csse.smartwaste.collection.dto.CollectionRecordResponse;
import com.csse.smartwaste.collection.entity.CollectionRecord;
import com.csse.smartwaste.collection.repository.CollectionRecordRepository;
import com.csse.smartwaste.bin.entity.Bin;
import com.csse.smartwaste.bin.service.BinService;
import com.csse.smartwaste.common.exception.DuplicateResourceException;
import com.csse.smartwaste.common.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Collection Service - Handles business logic for collection operations
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only responsible for collection business logic
 * - DIP (Dependency Inversion): Depends on repository abstraction, not concrete implementation
 * - OCP (Open/Closed): Open for extension with new business logic, closed for modification
 * - ISP (Interface Segregation): Provides focused service methods
 * 
 * CODE SMELLS AVOIDED:
 * - No God class: Focused only on collection business logic
 * - No duplicate code: Reusable methods
 * - No long parameter lists: Uses DTOs for complex data
 * - Proper error handling: Uses custom exceptions
 * - Clear method naming: Descriptive method names
 */
@Service
@Transactional
public class CollectionService {

    private final CollectionRecordRepository collectionRecordRepository;
    private final BinService binService;

    /**
     * Constructor injection - follows Dependency Injection best practice
     * DIP: Depends on abstraction (CollectionRecordRepository interface) not concrete implementation
     */
    @Autowired
    public CollectionService(CollectionRecordRepository collectionRecordRepository, BinService binService) {
        this.collectionRecordRepository = collectionRecordRepository;
        this.binService = binService;
    }

    /**
     * Create a new collection record
     * SRP: Single responsibility - only handles collection record creation logic
     * 
     * @param request the collection record creation request
     * @return CollectionRecordResponse containing the created record
     * @throws DuplicateResourceException if bin was already collected today
     */
    public CollectionRecordResponse createCollectionRecord(CollectionRecordRequest request) {
        // Check if bin was already collected today
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(23, 59, 59);
        
        boolean alreadyCollected = collectionRecordRepository.existsByBinIdAndCollectionDateBetweenAndStatusIn(
            request.getBinId(), startOfDay, endOfDay);
        
        if (alreadyCollected && request.getStatus() == CollectionRecord.CollectionStatus.COLLECTED) {
            throw new DuplicateResourceException("Collection Record", "binId", 
                "Bin " + request.getBinId() + " was already collected today");
        }

        // Validate bin exists and is in correct status
        try {
            var binResponse = binService.getBinByBinId(request.getBinId());
            
            // Check if bin is in correct status for collection
            if (request.getStatus() == CollectionRecord.CollectionStatus.COLLECTED && 
                binResponse.getStatus() != Bin.BinStatus.ACTIVE) {
                throw new IllegalStateException("Bin " + request.getBinId() + 
                    " is not in ACTIVE status. Current status: " + binResponse.getStatus());
            }
            
        } catch (ResourceNotFoundException e) {
            throw new ResourceNotFoundException("Bin", "binId", request.getBinId());
        }

        // Convert DTO to entity
        CollectionRecord record = convertRequestToEntity(request);
        
        // Save record
        CollectionRecord savedRecord = collectionRecordRepository.save(record);
        
        // Update bin status if collection was successful
        if (request.getStatus() == CollectionRecord.CollectionStatus.COLLECTED) {
            try {
                binService.updateBinStatus(request.getBinId(), Bin.BinStatus.COLLECTED);
            } catch (Exception e) {
                // Log error but don't fail the collection record creation
                System.err.println("Warning: Failed to update bin status for " + request.getBinId() + 
                    ": " + e.getMessage());
            }
        }
        
        // Convert entity to response DTO
        return CollectionRecordResponse.fromCollectionRecord(savedRecord);
    }

    /**
     * Get collection records by worker ID
     * SRP: Single responsibility - only handles collection retrieval by worker logic
     * 
     * @param workerId the worker identifier
     * @return List of CollectionRecordResponse containing records for the specified worker
     */
    public List<CollectionRecordResponse> getCollectionRecordsByWorker(String workerId) {
        List<CollectionRecord> records = collectionRecordRepository.findByWorkerId(workerId);
        return records.stream()
                .map(CollectionRecordResponse::fromCollectionRecord)
                .collect(Collectors.toList());
    }

    /**
     * Get today's collection records for a worker
     * SRP: Single responsibility - only handles today's collection retrieval logic
     * 
     * @param workerId the worker identifier
     * @return List of CollectionRecordResponse containing today's records for the specified worker
     */
    public List<CollectionRecordResponse> getTodayCollectionRecordsByWorker(String workerId) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(23, 59, 59);
        
        List<CollectionRecord> records = collectionRecordRepository.findTodayCollectionsByWorker(
            workerId, startOfDay, endOfDay);
        
        return records.stream()
                .map(CollectionRecordResponse::fromCollectionRecord)
                .collect(Collectors.toList());
    }

    /**
     * Get collection records by bin ID
     * SRP: Single responsibility - only handles collection retrieval by bin logic
     * 
     * @param binId the bin identifier
     * @return List of CollectionRecordResponse containing records for the specified bin
     */
    public List<CollectionRecordResponse> getCollectionRecordsByBin(String binId) {
        List<CollectionRecord> records = collectionRecordRepository.findByBinId(binId);
        return records.stream()
                .map(CollectionRecordResponse::fromCollectionRecord)
                .collect(Collectors.toList());
    }

    /**
     * Get collection records by status
     * SRP: Single responsibility - only handles collection retrieval by status logic
     * 
     * @param status the collection status
     * @return List of CollectionRecordResponse containing records with the specified status
     */
    public List<CollectionRecordResponse> getCollectionRecordsByStatus(CollectionRecord.CollectionStatus status) {
        List<CollectionRecord> records = collectionRecordRepository.findByStatus(status);
        return records.stream()
                .map(CollectionRecordResponse::fromCollectionRecord)
                .collect(Collectors.toList());
    }

    /**
     * Get collection statistics for a worker
     * SRP: Single responsibility - only handles collection statistics logic
     * 
     * @param workerId the worker identifier
     * @return CollectionStats containing statistics for the specified worker
     */
    public CollectionStats getCollectionStatsByWorker(String workerId) {
        List<CollectionRecord> records = collectionRecordRepository.findByWorkerId(workerId);
        
        long totalCollections = records.size();
        long collectedCount = records.stream()
                .filter(r -> r.getStatus() == CollectionRecord.CollectionStatus.COLLECTED)
                .count();
        long overrideCount = records.stream()
                .filter(r -> r.getStatus() == CollectionRecord.CollectionStatus.OVERRIDE)
                .count();
        long missedCount = records.stream()
                .filter(r -> r.getStatus() == CollectionRecord.CollectionStatus.MISSED)
                .count();
        
        double totalWeight = records.stream()
                .filter(r -> r.getWeight() != null)
                .mapToDouble(CollectionRecord::getWeight)
                .sum();
        
        return new CollectionStats(totalCollections, collectedCount, overrideCount, missedCount, totalWeight);
    }

    /**
     * Check if bin was already collected today
     * SRP: Single responsibility - only handles duplicate check logic
     * 
     * @param binId the bin identifier
     * @return true if bin was collected today, false otherwise
     */
    public boolean isBinAlreadyCollectedToday(String binId) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(23, 59, 59);
        
        return collectionRecordRepository.existsByBinIdAndCollectionDateBetweenAndStatusIn(
            binId, startOfDay, endOfDay);
    }

    /**
     * Get the latest collection record for a bin
     * SRP: Single responsibility - only handles latest record retrieval logic
     * 
     * @param binId the bin identifier
     * @return CollectionRecordResponse containing the latest record for the specified bin
     * @throws ResourceNotFoundException if no records found for the bin
     */
    public CollectionRecordResponse getLatestCollectionRecordByBin(String binId) {
        CollectionRecord record = collectionRecordRepository.findFirstByBinIdOrderByCollectionDateDesc(binId)
                .orElseThrow(() -> new ResourceNotFoundException("Collection Record", "binId", binId));
        
        return CollectionRecordResponse.fromCollectionRecord(record);
    }

    /**
     * Convert CollectionRecordRequest DTO to CollectionRecord entity
     * SRP: Single responsibility - only handles DTO to entity conversion
     * 
     * @param request the collection record request DTO
     * @return CollectionRecord entity
     */
    private CollectionRecord convertRequestToEntity(CollectionRecordRequest request) {
        CollectionRecord record = new CollectionRecord(
            request.getBinId(),
            request.getWorkerId(),
            request.getBinLocation(),
            request.getBinOwner(),
            request.getWeight(),
            request.getFillLevel(),
            request.getWasteType(),
            request.getStatus()
        );
        
        // Set optional fields
        if (request.getReason() != null) {
            record.setReason(request.getReason());
        }
        
        // Convert sensor data if present
        if (request.getSensorData() != null) {
            CollectionRecord.SensorData sensorData = new CollectionRecord.SensorData(
                request.getSensorData().getTemperature(),
                request.getSensorData().getBatteryLevel(),
                request.getSensorData().getSignalStrength()
            );
            record.setSensorData(sensorData);
        }
        
        return record;
    }

    /**
     * Collection Statistics Inner Class
     * SRP: Single responsibility - only represents collection statistics
     */
    public static class CollectionStats {
        private final long totalCollections;
        private final long collectedCount;
        private final long overrideCount;
        private final long missedCount;
        private final double totalWeight;

        public CollectionStats(long totalCollections, long collectedCount, long overrideCount, 
                              long missedCount, double totalWeight) {
            this.totalCollections = totalCollections;
            this.collectedCount = collectedCount;
            this.overrideCount = overrideCount;
            this.missedCount = missedCount;
            this.totalWeight = totalWeight;
        }

        // Getters
        public long getTotalCollections() {
            return totalCollections;
        }

        public long getCollectedCount() {
            return collectedCount;
        }

        public long getOverrideCount() {
            return overrideCount;
        }

        public long getMissedCount() {
            return missedCount;
        }

        public double getTotalWeight() {
            return totalWeight;
        }
    }
}
