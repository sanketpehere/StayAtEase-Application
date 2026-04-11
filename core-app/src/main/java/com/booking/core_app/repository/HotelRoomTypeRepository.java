package com.booking.core_app.repository;

import com.booking.core_app.models.HotelRoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface HotelRoomTypeRepository extends JpaRepository<HotelRoomType, UUID> {
    List<HotelRoomType> findByHotel_HotelIdAndStatus(String hotelId, String status);
    Optional<HotelRoomType> findByRoomTypeId(String roomTypeId);
}