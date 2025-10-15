package com.csse.smartwaste.common.util;

import com.csse.smartwaste.login.entity.User;
import com.csse.smartwaste.login.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Password Migration Utility - Migrates existing plain text passwords to hashed passwords
 * Follows Single Responsibility Principle - only handles password migration
 * Follows Open/Closed Principle - can be extended for different migration strategies
 */
@Component
public class PasswordMigrationUtil {
    
    private final UserRepository userRepository;
    private final PasswordUtil passwordUtil;
    
    @Autowired
    public PasswordMigrationUtil(UserRepository userRepository, PasswordUtil passwordUtil) {
        this.userRepository = userRepository;
        this.passwordUtil = passwordUtil;
    }
    
    /**
     * Migrate all users with plain text passwords to hashed passwords
     * This method should be called once during application startup or as a separate migration
     * @return number of users migrated
     */
    public int migrateAllPasswords() {
        List<User> allUsers = userRepository.findAll();
        int migratedCount = 0;
        
        for (User user : allUsers) {
            if (needsMigration(user)) {
                migrateUserPassword(user);
                migratedCount++;
            }
        }
        
        return migratedCount;
    }
    
    /**
     * Check if a user's password needs migration (is plain text)
     * @param user the user to check
     * @return true if password needs migration, false otherwise
     */
    private boolean needsMigration(User user) {
        String password = user.getPasswordHash();
        return password != null && !passwordUtil.isPasswordHashed(password);
    }
    
    /**
     * Migrate a single user's password from plain text to hashed
     * @param user the user to migrate
     */
    private void migrateUserPassword(User user) {
        String plainPassword = user.getPasswordHash();
        String hashedPassword = passwordUtil.hashPassword(plainPassword);
        user.setPasswordHash(hashedPassword);
        userRepository.save(user);
    }
    
    /**
     * Get count of users that need password migration
     * @return number of users with plain text passwords
     */
    public long getUsersNeedingMigration() {
        return userRepository.findAll().stream()
                .filter(this::needsMigration)
                .count();
    }
}
