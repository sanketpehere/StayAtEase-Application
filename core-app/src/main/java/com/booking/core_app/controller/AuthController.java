package com.booking.core_app.controller;

import com.booking.core_app.models.Customer;
import com.booking.core_app.requestDto.AuthResponse;
import com.booking.core_app.requestDto.CustomerLoginDto;
import com.booking.core_app.requestDto.CustomerSignupDto;
import com.booking.core_app.requestDto.OwnerSignupDto;
import com.booking.core_app.service.AuthService;
import com.booking.core_app.service.CustomerService;
import com.booking.core_app.service.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private OwnerService ownerService;

    @PostMapping("/ui/login")
    public ResponseEntity login(@RequestBody CustomerLoginDto customerLoginDto) {
        try {
            AuthResponse response = authService.login(customerLoginDto);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/ui/signup")
    public ResponseEntity signup(@RequestBody CustomerSignupDto customerSignupDto) {
        try {
            AuthResponse response = authService.signup(customerSignupDto);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/social/signup")
    public ResponseEntity socialSignup(@RequestBody Map<String, String> request) {
        try {
            AuthResponse response = authService.socialSignup(request);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/verify-email")
    public ResponseEntity verifyEmail(@RequestParam String token) {
        System.out.println("TOKEN RECEIVED: " + token);
        try {
            Customer customer = customerService.findByVerificationToken(token)
                    .orElseThrow(() -> new RuntimeException("Invalid or expired verification token."));

            customer.setVerified(true);
            customer.setVerificationToken(null); // clear token after use
            customer.setUpdatedAt(LocalDateTime.now());
            customerService.saveCustomer(customer);

            return new ResponseEntity<>(Map.of("message", "Email verified successfully!"), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }


    @PostMapping("/owner/signup")
    public ResponseEntity ownerSignup(@RequestBody OwnerSignupDto ownerSignupDto) {
        try {
            AuthResponse response = ownerService.signup(ownerSignupDto);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/owner/login")
    public ResponseEntity ownerLogin(@RequestBody CustomerLoginDto loginDto) {
        try {
            AuthResponse response = ownerService.login(loginDto.getEmail(), loginDto.getPassword());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.UNAUTHORIZED);
        }
    }
}