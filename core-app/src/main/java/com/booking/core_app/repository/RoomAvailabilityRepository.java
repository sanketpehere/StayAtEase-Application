package com.booking.core_app.repository;

import com.booking.core_app.models.RoomAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoomAvailabilityRepository extends JpaRepository<RoomAvailability, UUID> {

    // get availability for a room type on a specific date
    Optional<RoomAvailability> findByHotelRoomType_RoomTypeIdAndDate(
            String roomTypeId, LocalDate date);

    // get availability for a room type across a date range
    List<RoomAvailability> findByHotelRoomType_RoomTypeIdAndDateBetween(
            String roomTypeId, LocalDate startDate, LocalDate endDate);
}