package com.csse.smartwaste.admin.controller;

import com.csse.smartwaste.common.model.Role;
import com.csse.smartwaste.common.util.UserValidationUtil;
import com.csse.smartwaste.login.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Admin Controller - Handles admin-specific endpoints
 * Follows Single Responsibility Principle - only handles admin operations
 * Demonstrates user identity tracking within same role
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    private final UserValidationUtil userValidationUtil;
    
    @Autowired
    public AdminController(UserValidationUtil userValidationUtil) {
        this.userValidationUtil = userValidationUtil;
    }
    
    /**
     * Get admin's personal dashboard data
     * Demonstrates user identity tracking - each admin sees their own data
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(@RequestParam String userId) {
        // Validate user exists and has Admin role
        User user = userValidationUtil.validateUserAndRole(userId, Role.Admin);
        
        // Return personalized data for this specific admin
        Map<String, Object> dashboardData = new HashMap<>();
        dashboardData.put("userId", user.getUserId());
        dashboardData.put("userName", user.getName());
        dashboardData.put("userEmail", user.getEmail());
        dashboardData.put("role", user.getRole());
        dashboardData.put("message", "Welcome to your personal dashboard, " + user.getName() + "!");
        dashboardData.put("personalData", "This is " + user.getName() + "'s personal admin data");
        
        return ResponseEntity.ok(dashboardData);
    }
    
    /**
     * Get admin's user management data
     * Each admin sees their own management scope
     */
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getUsers(@RequestParam String userId) {
        // Validate user exists and has Admin role
        User user = userValidationUtil.validateUserAndRole(userId, Role.Admin);
        
        Map<String, Object> users = new HashMap<>();
        users.put("userId", user.getUserId());
        users.put("userName", user.getName());
        users.put("users", "User management for " + user.getName());
        users.put("message", "These are users managed by " + user.getName());
        
        return ResponseEntity.ok(users);
    }
    
    /**
     * Get admin's analytics data
     * Each admin sees their own analytics scope
     */
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics(@RequestParam String userId) {
        // Validate user exists and has Admin role
        User user = userValidationUtil.validateUserAndRole(userId, Role.Admin);
        
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("userId", user.getUserId());
        analytics.put("userName", user.getName());
        analytics.put("analytics", "Analytics data for " + user.getName());
        analytics.put("message", "These are analytics managed by " + user.getName());
        
        return ResponseEntity.ok(analytics);
    }
}
