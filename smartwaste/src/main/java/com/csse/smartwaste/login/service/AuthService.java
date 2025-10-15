package com.csse.smartwaste.login.service;

import com.csse.smartwaste.login.dto.SignInRequest;
import com.csse.smartwaste.login.dto.SignUpRequest;
import com.csse.smartwaste.login.dto.UserResponse;

public interface AuthService {
    UserResponse signUp(SignUpRequest request);
    UserResponse signIn(SignInRequest request);
}
