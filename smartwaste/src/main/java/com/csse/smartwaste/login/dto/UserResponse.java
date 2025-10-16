package com.csse.smartwaste.login.dto;

import com.csse.smartwaste.common.model.Role;
import com.csse.smartwaste.login.entity.User;
import java.time.LocalDateTime;

public class UserResponse {
    private String userId;
    private String name;
    private String email;
    private Role role;
    private User.UserStatus status;
    private UserProfile profile;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructor for backward compatibility
    public UserResponse(String userId, String name, String email, Role role) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.status = User.UserStatus.ACTIVE; // Default status
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Full constructor
    public UserResponse(String userId, String name, String email, Role role, 
                       User.UserStatus status, UserProfile profile, 
                       LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.status = status;
        this.profile = profile;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Static method to create from User entity (handles missing fields gracefully)
    public static UserResponse fromUser(User user) {
        UserResponse response = new UserResponse(
            user.getUserId(),
            user.getName(),
            user.getEmail(),
            user.getRole()
        );
        
        // Safely set optional fields
        if (user.getStatus() != null) {
            response.setStatus(user.getStatus());
        }
        if (user.getProfile() != null) {
            response.setProfile(new UserProfile(
                user.getProfile().getAddress(),
                user.getProfile().getCity(),
                user.getProfile().getGeo()
            ));
        }
        if (user.getCreatedAt() != null) {
            response.setCreatedAt(user.getCreatedAt());
        }
        if (user.getUpdatedAt() != null) {
            response.setUpdatedAt(user.getUpdatedAt());
        }
        
        return response;
    }

    public String getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }

    public User.UserStatus getStatus() {
        return status;
    }

    public void setStatus(User.UserStatus status) {
        this.status = status;
    }

    public UserProfile getProfile() {
        return profile;
    }

    public void setProfile(UserProfile profile) {
        this.profile = profile;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Inner class for profile information
    public static class UserProfile {
        private String address;
        private String city;
        private Object geo; // Using Object to avoid GeoJsonPoint dependency issues

        public UserProfile() {}

        public UserProfile(String address, String city, Object geo) {
            this.address = address;
            this.city = city;
            this.geo = geo;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public Object getGeo() {
            return geo;
        }

        public void setGeo(Object geo) {
            this.geo = geo;
        }
    }
}
