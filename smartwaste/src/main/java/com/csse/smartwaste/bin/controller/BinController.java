package com.csse.smartwaste.bin.controller;

import com.csse.smartwaste.bin.entity.Bin;
import com.csse.smartwaste.bin.service.BinService;
import com.csse.smartwaste.bin.dto.BinRequest;
import com.csse.smartwaste.bin.dto.BinResponse;
import com.csse.smartwaste.common.exception.DuplicateResourceException;
import com.csse.smartwaste.common.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * Bin Controller - Handles HTTP requests for bin operations
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
@RequestMapping("/api/bins")
@CrossOrigin(origins = "*")
public class BinController {

    private final BinService binService;

    /**
     * Constructor injection - follows Dependency Injection best practice
     * DIP: Depends on abstraction (BinService) not concrete implementation
     */
    @Autowired
    public BinController(BinService binService) {
        this.binService = binService;
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
            "service", "Bin Service",
            "timestamp", java.time.LocalDateTime.now().toString()
        );
        return ResponseEntity.ok(response);
    }

    /**
     * Create a new bin
     * SRP: Single responsibility - only handles bin creation HTTP request
     * 
     * @param binRequest the bin creation request
     * @return ResponseEntity containing the created bin
     */
    @PostMapping
    public ResponseEntity<BinResponse> createBin(@RequestBody BinRequest binRequest) {
        try {
            BinResponse createdBin = binService.createBin(binRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdBin);
        } catch (DuplicateResourceException e) {
            throw e; // Let global exception handler handle it
        }
    }

    /**
     * Get bin by binId
     * SRP: Single responsibility - only handles bin retrieval HTTP request
     * 
     * @param binId the unique bin identifier
     * @return ResponseEntity containing the bin
     */
    @GetMapping("/{binId}")
    public ResponseEntity<BinResponse> getBinByBinId(@PathVariable String binId) {
        BinResponse bin = binService.getBinByBinId(binId);
        return ResponseEntity.ok(bin);
    }

    /**
     * Get all bins
     * SRP: Single responsibility - only handles all bins retrieval HTTP request
     * 
     * @return ResponseEntity containing list of all bins
     */
    @GetMapping
    public ResponseEntity<List<BinResponse>> getAllBins() {
        List<BinResponse> bins = binService.getAllBins();
        return ResponseEntity.ok(bins);
    }

    /**
     * Get bins by owner ID
     * SRP: Single responsibility - only handles bins by owner retrieval HTTP request
     * 
     * @param ownerId the owner identifier
     * @return ResponseEntity containing list of bins owned by the specified owner
     */
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<BinResponse>> getBinsByOwnerId(@PathVariable String ownerId) {
        List<BinResponse> bins = binService.getBinsByOwnerId(ownerId);
        return ResponseEntity.ok(bins);
    }

    /**
     * Get bins by status
     * SRP: Single responsibility - only handles bins by status retrieval HTTP request
     * 
     * @param status the bin status
     * @return ResponseEntity containing list of bins with the specified status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<BinResponse>> getBinsByStatus(@PathVariable Bin.BinStatus status) {
        List<BinResponse> bins = binService.getBinsByStatus(status);
        return ResponseEntity.ok(bins);
    }

    /**
     * Update bin status
     * SRP: Single responsibility - only handles bin status update HTTP request
     * 
     * @param binId the unique bin identifier
     * @param statusUpdate the status update request
     * @return ResponseEntity containing the updated bin
     */
    @PutMapping("/{binId}/status")
    public ResponseEntity<BinResponse> updateBinStatus(
            @PathVariable String binId,
            @RequestBody Map<String, Bin.BinStatus> statusUpdate) {
        
        Bin.BinStatus newStatus = statusUpdate.get("status");
        BinResponse updatedBin = binService.updateBinStatus(binId, newStatus);
        return ResponseEntity.ok(updatedBin);
    }

    /**
     * Delete bin by binId
     * SRP: Single responsibility - only handles bin deletion HTTP request
     * 
     * @param binId the unique bin identifier
     * @return ResponseEntity with no content
     */
    @DeleteMapping("/{binId}")
    public ResponseEntity<Void> deleteBin(@PathVariable String binId) {
        binService.deleteBin(binId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Check if bin exists
     * SRP: Single responsibility - only handles bin existence check HTTP request
     * 
     * @param binId the unique bin identifier
     * @return ResponseEntity containing existence status
     */
    @GetMapping("/{binId}/exists")
    public ResponseEntity<Map<String, Boolean>> checkBinExists(@PathVariable String binId) {
        boolean exists = binService.binExists(binId);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    /**
     * Get bin statistics
     * SRP: Single responsibility - only handles bin statistics HTTP request
     * 
     * @return ResponseEntity containing bin statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getBinStats() {
        long totalBins = binService.getAllBins().size();
        long activeBins = binService.getBinCountByStatus(Bin.BinStatus.ACTIVE);
        long damagedBins = binService.getBinCountByStatus(Bin.BinStatus.DAMAGED);
        long maintenanceBins = binService.getBinCountByStatus(Bin.BinStatus.MAINTENANCE);
        long lostBins = binService.getBinCountByStatus(Bin.BinStatus.LOST);

        Map<String, Object> stats = Map.of(
            "totalBins", totalBins,
            "activeBins", activeBins,
            "damagedBins", damagedBins,
            "maintenanceBins", maintenanceBins,
            "lostBins", lostBins
        );

        return ResponseEntity.ok(stats);
    }

    /**
     * Get activity summary grouped by zones
     * SRP: Single responsibility - only handles activity summary HTTP request
     * 
     * @return ResponseEntity containing zone-wise activity summary
     */
    @GetMapping("/activity-summary")
    public ResponseEntity<Map<String, Map<String, Object>>> getActivitySummary() {
        Map<String, Map<String, Object>> activitySummary = binService.getActivitySummary();
        return ResponseEntity.ok(activitySummary);
    }
}
