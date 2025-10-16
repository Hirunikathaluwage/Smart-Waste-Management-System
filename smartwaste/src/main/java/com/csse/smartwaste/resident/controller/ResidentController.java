package com.csse.smartwaste.resident.controller;

import com.csse.smartwaste.common.model.Role;
import com.csse.smartwaste.common.util.UserValidationUtil;
import com.csse.smartwaste.login.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Resident Controller - Handles resident-specific endpoints
 * Follows Single Responsibility Principle - only handles resident operations
 * Demonstrates user identity tracking within same role
 */
@RestController
@RequestMapping("/api/resident")
public class ResidentController {
    
    private final UserValidationUtil userValidationUtil;
    
    @Autowired
    public ResidentController(UserValidationUtil userValidationUtil) {
        this.userValidationUtil = userValidationUtil;
    }
    
    /**
     * Get resident's personal dashboard data
     * Demonstrates user identity tracking - each resident sees their own data
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(@RequestParam String userId) {
        // Validate user exists and has Resident role
        User user = userValidationUtil.validateUserAndRole(userId, Role.Resident);
        
        // Return personalized data for this specific resident
        Map<String, Object> dashboardData = new HashMap<>();
        dashboardData.put("userId", user.getUserId());
        dashboardData.put("userName", user.getName());
        dashboardData.put("userEmail", user.getEmail());
        dashboardData.put("role", user.getRole());
        dashboardData.put("message", "Welcome to your personal dashboard, " + user.getName() + "!");
        dashboardData.put("personalData", "This is " + user.getName() + "'s personal data");
        
        return ResponseEntity.ok(dashboardData);
    }
    
    /**
     * Get resident's personal pickup requests
     * Each resident sees only their own pickup requests
     */
    @GetMapping("/pickups")
    public ResponseEntity<Map<String, Object>> getPickups(@RequestParam String userId) {
        // Validate user exists and has Resident role
        User user = userValidationUtil.validateUserAndRole(userId, Role.Resident);
        
        Map<String, Object> pickups = new HashMap<>();
        pickups.put("userId", user.getUserId());
        pickups.put("userName", user.getName());
        pickups.put("pickups", "Pickup requests for " + user.getName());
        pickups.put("message", "These are " + user.getName() + "'s personal pickup requests");
        
        return ResponseEntity.ok(pickups);
    }
    
    /**
     * Get resident's personal payments
     * Each resident sees only their own payment history
     */
    @GetMapping("/payments")
    public ResponseEntity<Map<String, Object>> getPayments(@RequestParam String userId) {
        // Validate user exists and has Resident role
        User user = userValidationUtil.validateUserAndRole(userId, Role.Resident);
        
        Map<String, Object> payments = new HashMap<>();
        payments.put("userId", user.getUserId());
        payments.put("userName", user.getName());
        payments.put("payments", "Payment history for " + user.getName());
        payments.put("message", "These are " + user.getName() + "'s personal payment records");
        
        return ResponseEntity.ok(payments);
    }
}
