package com.booking.core_app.service;
import com.booking.core_app.enums.Role;
import com.booking.core_app.models.Customer;
import com.booking.core_app.requestDto.AuthResponse;
import com.booking.core_app.requestDto.CustomerLoginDto;
import com.booking.core_app.requestDto.CustomerSignupDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private EmailService emailService;

    public AuthResponse socialSignup(Map<String, String> socialDetails) {
        String email = socialDetails.get("email");
        String name = socialDetails.get("name");
        String provider = socialDetails.get("provider");
        String picture = socialDetails.get("picture");

        Optional<Customer> existing = customerService.findByEmail(email);
        if (existing.isPresent()) {
            String token = jwtService.generateToken(email, Role.CUSTOMER); // ← add role
            return new AuthResponse(token, existing.get(), Role.CUSTOMER);
        }

        Customer customer = new Customer();
        customer.setFullName(name);
        customer.setEmail(email);
        customer.setProfilePicture(picture);
        customer.setProvider(provider);
        customer.setVerified(true);
        customer.setRole(Role.CUSTOMER); // ← set role
        customer.setCreatedAt(LocalDateTime.now());
        customer.setUpdatedAt(LocalDateTime.now());
        customer.setCreatedBy("System");
        customer.setUpdatedBy("System");

        Customer saved = customerService.saveCustomer(customer);
        String token = jwtService.generateToken(email, Role.CUSTOMER); // ← add role
        return new AuthResponse(token, saved, Role.CUSTOMER);
    }

    @Transactional
    public AuthResponse signup(CustomerSignupDto customerSignupDto) {
        Optional<Customer> existingCustomer = customerService.findByEmail(customerSignupDto.getEmail());
        if (existingCustomer.isPresent()) {
            Customer existing = existingCustomer.get();

            if (existing.isVerified()) {
                throw new RuntimeException("Email already registered.");
            }

            // If account exists but is still unverified, rotate token and resend verification mail.
            String verificationToken = UUID.randomUUID().toString();
            existing.setVerificationToken(verificationToken);
            existing.setUpdatedAt(LocalDateTime.now());
            existing.setUpdatedBy("System");
            Customer savedExisting = customerService.saveCustomer(existing);

            emailService.sendVerificationEmail(savedExisting.getEmail(), verificationToken);
            return new AuthResponse(null, savedExisting, Role.CUSTOMER);
        }

        Customer customer = new Customer();
        customer.setVerified(false);
        customer.setFullName(customerSignupDto.getFullName());
        customer.setPassword(passwordEncoder.encode(customerSignupDto.getPassword()));
        customer.setEmail(customerSignupDto.getEmail());
        customer.setProvider("SELF");
        customer.setRole(Role.CUSTOMER); // ← set role

        String verificationToken = UUID.randomUUID().toString();
        customer.setVerificationToken(verificationToken);

        customer.setCreatedAt(LocalDateTime.now());
        customer.setUpdatedAt(LocalDateTime.now());
        customer.setCreatedBy("System");
        customer.setUpdatedBy("System");

        Customer saved = customerService.saveCustomer(customer);
        emailService.sendVerificationEmail(saved.getEmail(), verificationToken);

        return new AuthResponse(null, saved, Role.CUSTOMER);
    }

    public AuthResponse login(CustomerLoginDto loginDto) {
        Customer customer = customerService.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(loginDto.getPassword(), customer.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (!customer.isVerified()) {
            throw new RuntimeException("Please verify your email before logging in.");
        }

        String token = jwtService.generateToken(customer.getEmail(), Role.CUSTOMER); // ← add role
        return new AuthResponse(token, customer, Role.CUSTOMER);
    }
}