package com.csse.smartwaste.login.dto;

import com.csse.smartwaste.common.model.Role;

public class UserResponse {
    private String userId;
    private String name;
    private String email;
    private Role role;

    public UserResponse(String userId, String name, String email, Role role) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
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
}
