package com.booking.core_app.repository;

import com.booking.core_app.models.Hotel;
import com.booking.core_app.models.HotelOwner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, UUID> {
    Optional<Hotel> findByHotelId(String hotelId);
    List<Hotel> findByCity(String city);
    List<Hotel> findByCityAndStatus(String city, String status);
    List<Hotel> findByStatus(String status);

    List<Hotel> findByHotelOwner(HotelOwner hotelOwner);
}