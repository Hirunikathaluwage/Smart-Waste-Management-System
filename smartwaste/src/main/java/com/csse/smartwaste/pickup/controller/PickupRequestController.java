package com.csse.smartwaste.pickup.controller;

import com.csse.smartwaste.pickup.dto.*;
import com.csse.smartwaste.pickup.service.PickupRequestService;
import com.csse.smartwaste.pickup.service.PaymentCalculationService;
import com.csse.smartwaste.common.model.PickupStatus;
import com.csse.smartwaste.common.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * PickupRequestController - REST controller for pickup request operations
 * Follows RESTful API design principles
 */
@RestController
@RequestMapping("/api/pickup-requests")
@CrossOrigin(origins = "http://localhost:5173")
public class PickupRequestController {

    @Autowired
    private PickupRequestService pickupRequestService;

    @Autowired
    private PaymentCalculationService paymentCalculationService;

    /**
     * Create a new pickup request
     */
    @PostMapping
    public ResponseEntity<PickupRequestResponseDTO> createPickupRequest(
            @RequestBody PickupRequestCreateDTO createDTO) {
        try {
            PickupRequestResponseDTO response = pickupRequestService.createPickupRequest(createDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Calculate fees for a pickup request
     */
    @PostMapping("/calculate-fees")
    public ResponseEntity<FeeCalculationDTO> calculateFees(
            @RequestBody PickupRequestCreateDTO createDTO) {
        try {
            FeeCalculationDTO calculation = paymentCalculationService.calculateFees(createDTO);
            return ResponseEntity.ok(calculation);
        } catch (Exception e) {
            e.printStackTrace(); // Log the error
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Get pickup request by ID
     */
    @GetMapping("/{requestId}")
    public ResponseEntity<PickupRequestResponseDTO> getPickupRequestById(
            @PathVariable String requestId) {
        try {
            PickupRequestResponseDTO response = pickupRequestService.getPickupRequestById(requestId);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Get pickup requests by user ID
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PickupRequestResponseDTO>> getPickupRequestsByUserId(
            @PathVariable String userId) {
        try {
            List<PickupRequestResponseDTO> responses = pickupRequestService.getPickupRequestsByUserId(userId);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Update pickup request
     */
    @PutMapping("/{requestId}")
    public ResponseEntity<PickupRequestResponseDTO> updatePickupRequest(
            @PathVariable String requestId,
            @RequestBody PickupRequestUpdateDTO updateDTO) {
        try {
            PickupRequestResponseDTO response = pickupRequestService.updatePickupRequest(requestId, updateDTO);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Process payment for pickup request
     */
    @PostMapping("/{requestId}/payment")
    public ResponseEntity<PickupRequestResponseDTO> processPayment(
            @PathVariable String requestId,
            @RequestBody PaymentRequestDTO paymentDTO) {
        try {
            PickupRequestResponseDTO response = pickupRequestService.processPayment(requestId, paymentDTO);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Cancel pickup request
     */
    @PostMapping("/{requestId}/cancel")
    public ResponseEntity<PickupRequestResponseDTO> cancelPickupRequest(
            @PathVariable String requestId,
            @RequestBody(required = false) String reason) {
        try {
            PickupRequestResponseDTO response = pickupRequestService.cancelPickupRequest(requestId, reason);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Get all pickup requests (Admin only)
     */
    @GetMapping
    public ResponseEntity<List<PickupRequestResponseDTO>> getAllPickupRequests() {
        try {
            List<PickupRequestResponseDTO> responses = pickupRequestService.getAllPickupRequests();
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get pickup requests by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<PickupRequestResponseDTO>> getPickupRequestsByStatus(
            @PathVariable PickupStatus status) {
        try {
            List<PickupRequestResponseDTO> responses = pickupRequestService.getPickupRequestsByStatus(status);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Get emergency pickup requests
     */
    @GetMapping("/emergency")
    public ResponseEntity<List<PickupRequestResponseDTO>> getEmergencyPickupRequests() {
        try {
            List<PickupRequestResponseDTO> responses = pickupRequestService.getEmergencyPickupRequests();
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get pending payment requests
     */
    @GetMapping("/pending-payment")
    public ResponseEntity<List<PickupRequestResponseDTO>> getPendingPaymentRequests() {
        try {
            List<PickupRequestResponseDTO> responses = pickupRequestService.getPendingPaymentRequests();
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Reschedule pickup request
     */
    @PostMapping("/{requestId}/reschedule")
    public ResponseEntity<PickupRequestResponseDTO> reschedulePickupRequest(
            @PathVariable String requestId,
            @RequestBody PickupRequestUpdateDTO updateDTO) {
        try {
            // Set status to rescheduled
            updateDTO.setStatus(PickupStatus.RESCHEDULED);
            PickupRequestResponseDTO response = pickupRequestService.updatePickupRequest(requestId, updateDTO);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Get pickup request statistics (Admin only)
     */
    @GetMapping("/stats")
    public ResponseEntity<PickupStatsDTO> getPickupStats() {
        try {
            PickupStatsDTO stats = pickupRequestService.getPickupStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
