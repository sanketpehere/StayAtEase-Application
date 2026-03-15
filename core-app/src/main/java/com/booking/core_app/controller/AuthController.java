package com.booking.core_app.controller;

import com.booking.core_app.models.Customer;
import com.booking.core_app.requestDto.CustomerLoginDto;
import com.booking.core_app.requestDto.CustomerSignupDto;
import com.booking.core_app.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    @PostMapping("/ui/login")
    public ResponseEntity login(@RequestBody CustomerLoginDto customerLoginDto) {
        try {
            Customer customer = authService.login(customerLoginDto);
            return new ResponseEntity<>(customer, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/ui/signup")
    public ResponseEntity signup(@RequestBody CustomerSignupDto customerSignupDto) {
        try {
            Customer customer = authService.signup(customerSignupDto);
            return new ResponseEntity<>(customer, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/social/signup")
    public ResponseEntity socialSignup(@RequestBody Map<String, String> request) {
        try {
            Customer customer = authService.socialSignup(request);
            return new ResponseEntity<>(customer, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }


}
