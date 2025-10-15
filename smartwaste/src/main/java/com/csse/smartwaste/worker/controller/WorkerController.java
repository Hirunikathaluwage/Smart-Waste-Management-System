package com.csse.smartwaste.worker.controller;

import com.csse.smartwaste.common.model.Role;
import com.csse.smartwaste.common.util.UserValidationUtil;
import com.csse.smartwaste.login.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Worker Controller - Handles worker-specific endpoints
 * Follows Single Responsibility Principle - only handles worker operations
 * Demonstrates user identity tracking within same role
 */
@RestController
@RequestMapping("/api/worker")
@CrossOrigin(origins = "http://localhost:5173")
public class WorkerController {
    
    private final UserValidationUtil userValidationUtil;
    
    @Autowired
    public WorkerController(UserValidationUtil userValidationUtil) {
        this.userValidationUtil = userValidationUtil;
    }
    
    /**
     * Get worker's personal dashboard data
     * Demonstrates user identity tracking - each worker sees their own data
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(@RequestParam String userId) {
        // Validate user exists and has Worker role
        User user = userValidationUtil.validateUserAndRole(userId, Role.Worker);
        
        // Return personalized data for this specific worker
        Map<String, Object> dashboardData = new HashMap<>();
        dashboardData.put("userId", user.getUserId());
        dashboardData.put("userName", user.getName());
        dashboardData.put("userEmail", user.getEmail());
        dashboardData.put("role", user.getRole());
        dashboardData.put("message", "Welcome to your personal dashboard, " + user.getName() + "!");
        dashboardData.put("personalData", "This is " + user.getName() + "'s personal work data");
        
        return ResponseEntity.ok(dashboardData);
    }
    
    /**
     * Get worker's assigned routes
     * Each worker sees only their own assigned routes
     */
    @GetMapping("/routes")
    public ResponseEntity<Map<String, Object>> getRoutes(@RequestParam String userId) {
        // Validate user exists and has Worker role
        User user = userValidationUtil.validateUserAndRole(userId, Role.Worker);
        
        Map<String, Object> routes = new HashMap<>();
        routes.put("userId", user.getUserId());
        routes.put("userName", user.getName());
        routes.put("routes", "Assigned routes for " + user.getName());
        routes.put("message", "These are " + user.getName() + "'s personal assigned routes");
        
        return ResponseEntity.ok(routes);
    }
    
    /**
     * Get worker's personal reports
     * Each worker sees only their own reports
     */
    @GetMapping("/reports")
    public ResponseEntity<Map<String, Object>> getReports(@RequestParam String userId) {
        // Validate user exists and has Worker role
        User user = userValidationUtil.validateUserAndRole(userId, Role.Worker);
        
        Map<String, Object> reports = new HashMap<>();
        reports.put("userId", user.getUserId());
        reports.put("userName", user.getName());
        reports.put("reports", "Work reports for " + user.getName());
        reports.put("message", "These are " + user.getName() + "'s personal work reports");
        
        return ResponseEntity.ok(reports);
    }
}
