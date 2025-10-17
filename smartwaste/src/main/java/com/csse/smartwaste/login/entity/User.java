package com.csse.smartwaste.login.entity;

import com.csse.smartwaste.common.model.Role;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

/**
 * User Entity - Represents a user in the system
 * Follows Single Responsibility Principle - only represents user data
 * Updated with profile information and status for enhanced functionality
 */
@Document(collection = "users")
@JsonIgnoreProperties(ignoreUnknown = true)
public class User {

    @Id
    private String userId;

    private String name;
    private String email;
    private String passwordHash;
    private String phone;
    private Role role;
    private UserStatus status = UserStatus.ACTIVE; // Default status for backward compatibility
    private UserProfile profile; // Optional profile information
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Getters & Setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }

    public UserProfile getProfile() { return profile; }
    public void setProfile(UserProfile profile) { this.profile = profile; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Inner classes for profile and status
    public static class UserProfile {
        private String address;
        private String city;
        private GeoJsonPoint geo;

        public UserProfile() {}

        public UserProfile(String address, String city, GeoJsonPoint geo) {
            this.address = address;
            this.city = city;
            this.geo = geo;
        }

        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }

        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }

        public GeoJsonPoint getGeo() { return geo; }
        public void setGeo(GeoJsonPoint geo) { this.geo = geo; }
    }

    public enum UserStatus {
        ACTIVE, SUSPENDED, DELETED
    }
}
