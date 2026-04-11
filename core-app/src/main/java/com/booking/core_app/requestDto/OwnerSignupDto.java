package com.booking.core_app.requestDto;

import lombok.Data;

@Data
public class OwnerSignupDto {
    private String fullName;
    private String email;
    private String password;
    private String phoneNumber;
    private String businessName;
    private String businessEmail;
    private String businessPhone;
    private String businessType;
    private String country;
    private String state;
    private String city;
}