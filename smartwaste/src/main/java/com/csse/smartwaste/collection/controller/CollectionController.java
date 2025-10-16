package com.csse.smartwaste.collection.controller;

import com.csse.smartwaste.collection.dto.CollectionRecordRequest;
import com.csse.smartwaste.collection.dto.CollectionRecordResponse;
import com.csse.smartwaste.collection.entity.CollectionRecord;
import com.csse.smartwaste.collection.service.CollectionService;
import com.csse.smartwaste.common.exception.DuplicateResourceException;
import com.csse.smartwaste.common.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Collection Controller - Handles HTTP requests for collection operations
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only responsible for handling HTTP requests/responses
 * - OCP (Open/Closed): Open for extension with new endpoints, closed for modification
 * - DIP (Dependency Inversion): Depends on service abstraction, not concrete implementation
 * - ISP (Interface Segregation): Provides focused REST endpoints
 * 
 * CODE SMELLS AVOIDED:
 * - No God class: Focused only on HTTP request handling
 * - No business logic: Delegates to service layer
 * - Proper error handling: Uses global exception handler
 * - Clear endpoint naming: RESTful endpoint names
 * - Consistent response format: Standardized response structure
 */
@RestController
@RequestMapping("/api/collections")
public class CollectionController {

    private final CollectionService collectionService;

    /**
     * Constructor injection - follows Dependency Injection best practice
     * DIP: Depends on abstraction (CollectionService) not concrete implementation
     */
    @Autowired
    public CollectionController(CollectionService collectionService) {
        this.collectionService = collectionService;
    }

    /**
     * Create a new collection record
     * SRP: Single responsibility - only handles collection creation HTTP request
     * 
     * @param request the collection record creation request
     * @return ResponseEntity containing the created collection record
     */
    @PostMapping
    public ResponseEntity<CollectionRecordResponse> createCollectionRecord(@RequestBody CollectionRecordRequest request) {
        try {
            CollectionRecordResponse createdRecord = collectionService.createCollectionRecord(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRecord);
        } catch (DuplicateResourceException e) {
            throw e; // Let global exception handler handle it
        }
    }

    /**
     * Get collection records by worker ID
     * SRP: Single responsibility - only handles collection retrieval by worker HTTP request
     * 
     * @param workerId the worker identifier
     * @return ResponseEntity containing list of collection records for the specified worker
     */
    @GetMapping("/worker/{workerId}")
    public ResponseEntity<List<CollectionRecordResponse>> getCollectionRecordsByWorker(@PathVariable String workerId) {
        List<CollectionRecordResponse> records = collectionService.getCollectionRecordsByWorker(workerId);
        return ResponseEntity.ok(records);
    }

    /**
     * Get today's collection records for a worker
     * SRP: Single responsibility - only handles today's collection retrieval HTTP request
     * 
     * @param workerId the worker identifier
     * @return ResponseEntity containing list of today's collection records for the specified worker
     */
    @GetMapping("/worker/{workerId}/today")
    public ResponseEntity<List<CollectionRecordResponse>> getTodayCollectionRecordsByWorker(@PathVariable String workerId) {
        List<CollectionRecordResponse> records = collectionService.getTodayCollectionRecordsByWorker(workerId);
        return ResponseEntity.ok(records);
    }

    /**
     * Get collection records by bin ID
     * SRP: Single responsibility - only handles collection retrieval by bin HTTP request
     * 
     * @param binId the bin identifier
     * @return ResponseEntity containing list of collection records for the specified bin
     */
    @GetMapping("/bin/{binId}")
    public ResponseEntity<List<CollectionRecordResponse>> getCollectionRecordsByBin(@PathVariable String binId) {
        List<CollectionRecordResponse> records = collectionService.getCollectionRecordsByBin(binId);
        return ResponseEntity.ok(records);
    }

    /**
     * Get collection records by status
     * SRP: Single responsibility - only handles collection retrieval by status HTTP request
     * 
     * @param status the collection status
     * @return ResponseEntity containing list of collection records with the specified status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<CollectionRecordResponse>> getCollectionRecordsByStatus(@PathVariable CollectionRecord.CollectionStatus status) {
        List<CollectionRecordResponse> records = collectionService.getCollectionRecordsByStatus(status);
        return ResponseEntity.ok(records);
    }

    /**
     * Get collection statistics for a worker
     * SRP: Single responsibility - only handles collection statistics HTTP request
     * 
     * @param workerId the worker identifier
     * @return ResponseEntity containing collection statistics for the specified worker
     */
    @GetMapping("/worker/{workerId}/stats")
    public ResponseEntity<CollectionService.CollectionStats> getCollectionStatsByWorker(@PathVariable String workerId) {
        CollectionService.CollectionStats stats = collectionService.getCollectionStatsByWorker(workerId);
        return ResponseEntity.ok(stats);
    }

    /**
     * Check if bin was already collected today
     * SRP: Single responsibility - only handles duplicate check HTTP request
     * 
     * @param binId the bin identifier
     * @return ResponseEntity containing boolean indicating if bin was collected today
     */
    @GetMapping("/bin/{binId}/collected-today")
    public ResponseEntity<Map<String, Object>> isBinAlreadyCollectedToday(@PathVariable String binId) {
        boolean alreadyCollected = collectionService.isBinAlreadyCollectedToday(binId);
        Map<String, Object> response = Map.of(
            "binId", binId,
            "alreadyCollected", alreadyCollected,
            "date", java.time.LocalDate.now().toString()
        );
        return ResponseEntity.ok(response);
    }

    /**
     * Get the latest collection record for a bin
     * SRP: Single responsibility - only handles latest record retrieval HTTP request
     * 
     * @param binId the bin identifier
     * @return ResponseEntity containing the latest collection record for the specified bin
     */
    @GetMapping("/bin/{binId}/latest")
    public ResponseEntity<CollectionRecordResponse> getLatestCollectionRecordByBin(@PathVariable String binId) {
        try {
            CollectionRecordResponse record = collectionService.getLatestCollectionRecordByBin(binId);
            return ResponseEntity.ok(record);
        } catch (ResourceNotFoundException e) {
            throw e; // Let global exception handler handle it
        }
    }

    /**
     * Health check endpoint
     * SRP: Single responsibility - only handles health check
     * 
     * @return ResponseEntity containing health status
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = Map.of(
            "status", "UP",
            "service", "Collection Service",
            "timestamp", java.time.LocalDateTime.now().toString()
        );
        return ResponseEntity.ok(response);
    }
}
