package com.csse.smartwaste.common.controller;

import com.csse.smartwaste.common.util.PasswordMigrationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Migration Controller - Handles password migration endpoints
 * Follows Single Responsibility Principle - only handles migration operations
 * Follows Open/Closed Principle - can be extended with more migration endpoints
 */
@RestController
@RequestMapping("/api/migration")
public class MigrationController {
    
    private final PasswordMigrationUtil migrationUtil;
    
    @Autowired
    public MigrationController(PasswordMigrationUtil migrationUtil) {
        this.migrationUtil = migrationUtil;
    }
    
    /**
     * Get migration status - how many users need password migration
     * @return migration status information
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getMigrationStatus() {
        long usersNeedingMigration = migrationUtil.getUsersNeedingMigration();
        
        Map<String, Object> response = new HashMap<>();
        response.put("usersNeedingMigration", usersNeedingMigration);
        response.put("migrationRequired", usersNeedingMigration > 0);
        response.put("message", usersNeedingMigration > 0 
            ? "Password migration required for " + usersNeedingMigration + " users"
            : "All passwords are already hashed");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Run password migration for all users with plain text passwords
     * @return migration results
     */
    @PostMapping("/migrate-passwords")
    public ResponseEntity<Map<String, Object>> migratePasswords() {
        try {
            int migratedCount = migrationUtil.migrateAllPasswords();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("migratedUsers", migratedCount);
            response.put("message", "Successfully migrated " + migratedCount + " user passwords");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            response.put("message", "Password migration failed");
            
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
