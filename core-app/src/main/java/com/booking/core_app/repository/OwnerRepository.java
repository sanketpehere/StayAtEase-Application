package com.booking.core_app.repository;

import com.booking.core_app.models.HotelOwner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OwnerRepository extends JpaRepository<HotelOwner, UUID> {
    Optional<HotelOwner> findByEmail(String email);
}