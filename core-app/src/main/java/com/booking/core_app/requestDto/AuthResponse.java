package com.booking.core_app.requestDto;

import com.booking.core_app.enums.Role;
import com.booking.core_app.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private User user;
    private Role role;
}