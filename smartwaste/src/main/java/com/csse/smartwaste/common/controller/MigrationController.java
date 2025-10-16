package com.csse.smartwaste.common.controller;

import com.csse.smartwaste.common.util.PasswordMigrationUtil;
import com.csse.smartwaste.login.entity.User;
import com.csse.smartwaste.login.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
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
    private final UserRepository userRepository;
    
    @Autowired
    public MigrationController(PasswordMigrationUtil migrationUtil, UserRepository userRepository) {
        this.migrationUtil = migrationUtil;
        this.userRepository = userRepository;
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
    
    /**
     * Migrate existing users to new schema with default values
     * This ensures backward compatibility for existing users
     * @return migration results
     */
    @PostMapping("/migrate-user-schema")
    public ResponseEntity<Map<String, Object>> migrateUserSchema() {
        try {
            List<User> allUsers = userRepository.findAll();
            int migratedCount = 0;
            
            for (User user : allUsers) {
                boolean needsMigration = false;
                
                // Set default status if null
                if (user.getStatus() == null) {
                    user.setStatus(User.UserStatus.ACTIVE);
                    needsMigration = true;
                }
                
                // Set updatedAt if null
                if (user.getUpdatedAt() == null) {
                    user.setUpdatedAt(LocalDateTime.now());
                    needsMigration = true;
                }
                
                // Profile remains null for existing users (optional field)
                // This maintains backward compatibility
                
                if (needsMigration) {
                    userRepository.save(user);
                    migratedCount++;
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("migratedUsers", migratedCount);
            response.put("totalUsers", allUsers.size());
            response.put("message", "Successfully migrated " + migratedCount + " users to new schema");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            response.put("message", "User schema migration failed");
            
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * Get user schema migration status
     * @return migration status information
     */
    @GetMapping("/user-schema-status")
    public ResponseEntity<Map<String, Object>> getUserSchemaStatus() {
        try {
            List<User> allUsers = userRepository.findAll();
            int usersNeedingMigration = 0;
            
            for (User user : allUsers) {
                if (user.getStatus() == null || user.getUpdatedAt() == null) {
                    usersNeedingMigration++;
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("usersNeedingMigration", usersNeedingMigration);
            response.put("totalUsers", allUsers.size());
            response.put("migrationRequired", usersNeedingMigration > 0);
            response.put("message", usersNeedingMigration > 0 
                ? "User schema migration required for " + usersNeedingMigration + " users"
                : "All users are up to date with new schema");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            response.put("message", "Failed to check user schema status");
            
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
