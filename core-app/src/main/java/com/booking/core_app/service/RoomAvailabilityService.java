package com.booking.core_app.service;

import com.booking.core_app.models.HotelRoomType;
import com.booking.core_app.models.RoomAvailability;
import com.booking.core_app.repository.RoomAvailabilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class RoomAvailabilityService {

    @Autowired
    private RoomAvailabilityRepository roomAvailabilityRepository;

    // =========================
    // CHECK IF ROOMS AVAILABLE
    // =========================
    public boolean isAvailable(String roomTypeId, LocalDate startDate, LocalDate endDate, int roomsNeeded) {
        List<RoomAvailability> availabilities = roomAvailabilityRepository
                .findByHotelRoomType_RoomTypeIdAndDateBetween(roomTypeId, startDate, endDate.minusDays(1));

        // if no availability records exist → rooms are fully available
        if (availabilities.isEmpty()) return true;

        // check EVERY date in range has a record and has enough rooms
        LocalDate date = startDate;
        while (date.isBefore(endDate)) {
            LocalDate currentDate = date;
            RoomAvailability availability = availabilities.stream()
                    .filter(a -> a.getDate().equals(currentDate))
                    .findFirst()
                    .orElse(null);

            // if no record for this date → rooms available
            if (availability != null && availability.getAvailableRooms() < roomsNeeded) {
                return false;
            }
            date = date.plusDays(1);
        }
        return true;
    }

    // =========================
    // BLOCK ROOMS ON BOOKING
    // =========================
    public void blockRooms(HotelRoomType roomType, LocalDate startDate, LocalDate endDate) {
        LocalDate date = startDate;
        while (date.isBefore(endDate)) {
            RoomAvailability availability = roomAvailabilityRepository
                    .findByHotelRoomType_RoomTypeIdAndDate(roomType.getRoomTypeId(), date)
                    .orElseGet(() -> {
                        RoomAvailability a = new RoomAvailability();
                        a.setHotelRoomType(roomType);
                        a.setAvailableRooms(roomType.getTotalRooms());
                        a.setCreatedAt(LocalDateTime.now());
                        return a;
                    });

            availability.setDate(date);
            availability.setAvailableRooms(availability.getAvailableRooms() - 1);
            availability.setUpdatedAt(LocalDateTime.now());
            roomAvailabilityRepository.save(availability);

            date = date.plusDays(1);
        }
    }

    // =========================
    // RESTORE ROOMS ON CANCEL
    // =========================
    public void restoreRooms(HotelRoomType roomType, LocalDate startDate, LocalDate endDate) {
        LocalDate date = startDate;
        while (date.isBefore(endDate)) {
            roomAvailabilityRepository
                    .findByHotelRoomType_RoomTypeIdAndDate(roomType.getRoomTypeId(), date)
                    .ifPresent(availability -> {
                        availability.setAvailableRooms(availability.getAvailableRooms() + 1);
                        availability.setUpdatedAt(LocalDateTime.now());
                        roomAvailabilityRepository.save(availability);
                    });
            date = date.plusDays(1);
        }
    }
}