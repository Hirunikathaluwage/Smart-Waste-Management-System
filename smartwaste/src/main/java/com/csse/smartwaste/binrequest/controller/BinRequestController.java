package com.csse.smartwaste.binrequest.controller;

import com.csse.smartwaste.binrequest.dto.BinRequestDto;
import com.csse.smartwaste.binrequest.dto.BinRequestResponseDto;
import com.csse.smartwaste.binrequest.service.BinRequestService;
import com.csse.smartwaste.bin.service.BinService;
import com.csse.smartwaste.bin.dto.BinRequest;
import com.csse.smartwaste.bin.entity.Bin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

/**
 * Bin Request Controller - Handles HTTP requests for bin/bag requests
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only handles HTTP request/response for bin requests
 * - DIP (Dependency Inversion): Depends on service abstractions
 * - OCP (Open/Closed): Open for extension with new endpoints, closed for modification
 * - ISP (Interface Segregation): Provides focused REST endpoints
 * 
 * CODE SMELLS AVOIDED:
 * - No God class: Focused only on HTTP handling
 * - No duplicate code: Reusable response patterns
 * - Proper error handling: Uses ResponseEntity for proper HTTP status codes
 * - Clear method naming: RESTful endpoint naming
 */
@RestController
@RequestMapping("/api/bin-requests")
@CrossOrigin(origins = "*")
public class BinRequestController {

    @Autowired
    private BinRequestService binRequestService;
    
    @Autowired
    private BinService binService;

    /**
     * Create a new bin/bag request
     * SRP: Single responsibility - only handles bin request creation
     * 
     * @param binRequestDto the bin request data
     * @return ResponseEntity containing the created request
     */
    @PostMapping
    public ResponseEntity<?> createBinRequest(@RequestBody BinRequestDto binRequestDto) {
        try {
            System.out.println("🎉 Creating bin request: " + binRequestDto);
            
            // Save the request to BinRequest collection
            BinRequestResponseDto savedRequest = binRequestService.createBinRequest(binRequestDto);
            
            // If it's a BIN request, also create a Bin entity
            if (binRequestDto.getRequestType() == com.csse.smartwaste.binrequest.entity.RequestType.BIN) {
                try {
                    createBinEntity(binRequestDto);
                    System.out.println("✅ Bin entity created successfully");
                } catch (Exception e) {
                    System.err.println("⚠️ Failed to create Bin entity: " + e.getMessage());
                    // Continue even if Bin entity creation fails
                }
            }
            
            return ResponseEntity.ok(savedRequest);
        } catch (Exception e) {
            System.err.println("❌ Error creating bin request: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create bin request: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Create a Bin entity from bin request
     * SRP: Single responsibility - only handles Bin entity creation
     * 
     * @param binRequestDto the bin request data
     */
    private void createBinEntity(BinRequestDto binRequestDto) {
        // Generate unique bin ID
        String binId = "BIN-" + System.currentTimeMillis();
        
        // Create BinRequest DTO for BinService
        BinRequest binRequest = new BinRequest();
        binRequest.setBinId(binId);
        binRequest.setOwnerId("RES-001"); // Use your existing ownerId format
        binRequest.setStatus(Bin.BinStatus.ACTIVE);
        binRequest.setAddress(binRequestDto.getDeliveryAddress());
        
        // Set coordinates from map selection or default to Colombo
        binRequest.setLatitude(binRequestDto.getLatitude() != null ? binRequestDto.getLatitude() : 6.9271);
        binRequest.setLongitude(binRequestDto.getLongitude() != null ? binRequestDto.getLongitude() : 79.8612);
        
        // Create bin tag
        BinRequest.BinTagRequest tag = new BinRequest.BinTagRequest();
        tag.setType("QR");
        tag.setValue(binId);
        binRequest.setTag(tag);
        
        // Create the bin using BinService
        binService.createBin(binRequest);
        
        System.out.println("✅ Created Bin entity with ID: " + binId);
    }

    /**
     * Get bin request by ID
     * SRP: Single responsibility - only handles bin request retrieval by ID
     * 
     * @param id the request ID
     * @return ResponseEntity containing the request
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getBinRequestById(@PathVariable String id) {
        try {
            BinRequestResponseDto request = binRequestService.getBinRequestById(id);
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Request not found: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * Get all bin requests
     * SRP: Single responsibility - only handles all bin requests retrieval
     * 
     * @return ResponseEntity containing all requests
     */
    @GetMapping
    public ResponseEntity<?> getAllBinRequests() {
        try {
            List<BinRequestResponseDto> requests = binRequestService.getAllBinRequests();
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch requests: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get bin requests by user ID
     * SRP: Single responsibility - only handles user-specific bin requests retrieval
     * 
     * @param userId the user ID
     * @return ResponseEntity containing user's requests
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getBinRequestsByUserId(@PathVariable String userId) {
        try {
            List<BinRequestResponseDto> requests = binRequestService.getBinRequestsByUserId(userId);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch user requests: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Update bin request status
     * SRP: Single responsibility - only handles bin request status updates
     * 
     * @param id the request ID
     * @param status the new status
     * @return ResponseEntity containing the updated request
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBinRequestStatus(@PathVariable String id, @RequestBody Map<String, String> status) {
        try {
            BinRequestResponseDto updatedRequest = binRequestService.updateBinRequestStatus(id, status.get("status"));
            return ResponseEntity.ok(updatedRequest);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Cancel bin request
     * SRP: Single responsibility - only handles bin request cancellation
     * 
     * @param id the request ID
     * @return ResponseEntity containing the cancelled request
     */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBinRequest(@PathVariable String id) {
        try {
            BinRequestResponseDto cancelledRequest = binRequestService.cancelBinRequest(id);
            return ResponseEntity.ok(cancelledRequest);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to cancel request: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get bin request statistics
     * SRP: Single responsibility - only handles statistics retrieval
     * 
     * @return ResponseEntity containing statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<?> getBinRequestStatistics() {
        try {
            Map<String, Object> statistics = binRequestService.getBinRequestStatistics();
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch statistics: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get user bin request statistics
     * SRP: Single responsibility - only handles user statistics retrieval
     * 
     * @param userId the user ID
     * @return ResponseEntity containing user statistics
     */
    @GetMapping("/user/{userId}/statistics")
    public ResponseEntity<?> getUserBinRequestStatistics(@PathVariable String userId) {
        try {
            Map<String, Object> statistics = binRequestService.getUserBinRequestStatistics(userId);
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch user statistics: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}