package com.booking.core_app.service;
import com.booking.core_app.enums.Role;
import com.booking.core_app.models.HotelOwner;
import com.booking.core_app.repository.OwnerRepository;
import com.booking.core_app.requestDto.AuthResponse;
import com.booking.core_app.requestDto.OwnerSignupDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class OwnerService {

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    // =========================
    // OWNER SIGNUP
    // =========================
    public AuthResponse signup(OwnerSignupDto dto) {

        if (ownerRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered.");
        }

        HotelOwner owner = new HotelOwner();
        owner.setFullName(dto.getFullName());
        owner.setEmail(dto.getEmail());
        owner.setPassword(passwordEncoder.encode(dto.getPassword()));
        owner.setPhoneNumber(dto.getPhoneNumber());
        owner.setProvider("SELF");
        owner.setVerified(true); // auto approve for now
        owner.setRole(Role.HOTEL_OWNER);
        owner.setBusinessName(dto.getBusinessName());
        owner.setBusinessEmail(dto.getBusinessEmail());
        owner.setBusinessPhone(dto.getBusinessPhone());
        owner.setBusinessType(dto.getBusinessType());
        owner.setCountry(dto.getCountry());
        owner.setState(dto.getState());
        owner.setCity(dto.getCity());
        owner.setActive(true);
        owner.setCreatedAt(LocalDateTime.now());
        owner.setUpdatedAt(LocalDateTime.now());
        owner.setCreatedBy("System");
        owner.setUpdatedBy("System");

        HotelOwner saved = ownerRepository.save(owner);
        String token = jwtService.generateToken(saved.getEmail(), Role.HOTEL_OWNER);
        return new AuthResponse(token, saved, Role.HOTEL_OWNER);
    }

    // =========================
    // OWNER LOGIN
    // =========================
    public AuthResponse login(String email, String password) {
        HotelOwner owner = ownerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        if (!passwordEncoder.matches(password, owner.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(owner.getEmail(), Role.HOTEL_OWNER);
        return new AuthResponse(token, owner, Role.HOTEL_OWNER);
    }

    // =========================
    // FIND BY EMAIL
    // =========================
    public Optional<HotelOwner> findByEmail(String email) {
        return ownerRepository.findByEmail(email);
    }
}