package com.booking.core_app.controller;

import com.booking.core_app.models.Booking;
import com.booking.core_app.models.Hotel;
import com.booking.core_app.models.HotelRoomType;
import com.booking.core_app.service.BookingService;
import com.booking.core_app.service.HotelRoomTypeService;
import com.booking.core_app.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/owner")
public class OwnerController {

    @Autowired
    private HotelService hotelService;

    @Autowired
    private BookingService bookingService;

    // GET — all hotels for logged in owner
    @GetMapping("/hotels")
    public ResponseEntity getMyHotels(Authentication authentication) {
        try {
            String email = authentication.getName();
            List<Hotel> hotels = hotelService.getHotelsByOwner(email);
            return new ResponseEntity<>(hotels, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    // POST — create a new hotel
    @PostMapping("/hotels")
    public ResponseEntity createHotel(
            @RequestBody Map<String, Object> payload,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            Hotel hotel = hotelService.createHotel(payload, email);
            return new ResponseEntity<>(hotel, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    // GET — all bookings across owner's hotels
    @GetMapping("/bookings")
    public ResponseEntity getMyBookings(Authentication authentication) {
        try {
            String email = authentication.getName();
            List<Hotel> hotels = hotelService.getHotelsByOwner(email);
            List<Booking> allBookings = hotels.stream()
                    .flatMap(hotel -> bookingService.getBookingsByHotelId(hotel.getHotelId()).stream())
                    .toList();
            return new ResponseEntity<>(allBookings, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
    @Autowired
    private HotelRoomTypeService hotelRoomTypeService;

    // POST — add room type to a hotel
    @PostMapping("/hotels/{hotelId}/room-types")
    public ResponseEntity addRoomType(
            @PathVariable String hotelId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            HotelRoomType roomType = hotelRoomTypeService.createRoomType(hotelId, payload, email);
            return new ResponseEntity<>(roomType, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    // GET — get room types for a hotel
    @GetMapping("/hotels/{hotelId}/room-types")
    public ResponseEntity getRoomTypes(
            @PathVariable String hotelId,
            Authentication authentication) {
        try {
            List<HotelRoomType> roomTypes = hotelRoomTypeService.getActiveRoomTypesByHotel(hotelId);


            return new ResponseEntity<>(roomTypes, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
}