package com.booking.core_app.service;

import com.booking.core_app.models.Hotel;
import com.booking.core_app.models.HotelOwner;
import com.booking.core_app.repository.HotelRepository;
import com.booking.core_app.repository.OwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    // =========================
    // SAVE HOTEL
    // =========================
    public Hotel saveHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    // =========================
    // GET ALL ACTIVE HOTELS
    // =========================
    public List<Hotel> getAllActiveHotels() {
        return hotelRepository.findByStatus("ACTIVE");
    }

    // =========================
    // GET HOTEL BY HOTEL ID
    // =========================
    public Optional<Hotel> getHotelByHotelId(String hotelId) {
        return hotelRepository.findByHotelId(hotelId);
    }

    // =========================
    // GET HOTELS BY CITY
    // =========================
    public List<Hotel> getHotelsByCity(String city) {
        return hotelRepository.findByCityAndStatus(city, "ACTIVE");
    }

    // =========================
    // GET ALL HOTELS (ADMIN)
    // =========================
    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    // =========================
    // GET HOTELS BY OWNER
    // =========================
    public List<Hotel> getHotelsByOwner(String email) {
        HotelOwner owner = ownerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        return hotelRepository.findByHotelOwner(owner);
    }

    // =========================
    // CREATE HOTEL BY OWNER
    // =========================
    public Hotel createHotel(Map<String, Object> payload, String email) {
        HotelOwner owner = ownerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        Hotel hotel = new Hotel();
        hotel.setHotelId("HTL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        hotel.setHotelName((String) payload.get("hotelName"));
        hotel.setHotelDescription((String) payload.get("hotelDescription"));
        hotel.setHotelType((String) payload.get("hotelType"));
        hotel.setStarRating(((Number) payload.get("starRating")).doubleValue());
        hotel.setAddressLine1((String) payload.get("addressLine1"));
        hotel.setAddressLine2((String) payload.get("addressLine2"));
        hotel.setCity((String) payload.get("city"));
        hotel.setState((String) payload.get("state"));
        hotel.setCountry((String) payload.get("country"));
        hotel.setPincode((String) payload.get("pincode"));
        hotel.setTotalRooms(((Number) payload.get("totalRooms")).intValue());
        hotel.setCheckInTime(java.time.LocalTime.parse((String) payload.get("checkInTime")));
        hotel.setCheckOutTime(java.time.LocalTime.parse((String) payload.get("checkOutTime")));
        hotel.setHotelOwner(owner);
        hotel.setStatus("ACTIVE");
        hotel.setIsApproved(true); // auto approve for now
        hotel.setAvgRating(0.0);
        hotel.setTotalReviews(0);
        hotel.setTotalBookings(0);
        hotel.setCreatedAt(LocalDateTime.now());
        hotel.setUpdatedAt(LocalDateTime.now());
        hotel.setCreatedBy(email);
        hotel.setUpdatedBy(email);

        return hotelRepository.save(hotel);
    }
}