package com.booking.core_app.repository;

import com.booking.core_app.models.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    Optional<Booking> findByBookingId(String bookingId);
    List<Booking> findByUser_Email(String email);

    List<Booking> findByHotel_HotelId(String hotelId);
}