package com.booking.core_app.controller;

import com.booking.core_app.models.Hotel;
import com.booking.core_app.models.HotelRoomType;
import com.booking.core_app.models.RoomAvailability;
import com.booking.core_app.service.HotelRoomTypeService;
import com.booking.core_app.service.HotelService;
import com.booking.core_app.service.RoomAvailabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/hotels")
public class HotelController {

    @Autowired
    private HotelService hotelService;

    @Autowired
    private HotelRoomTypeService hotelRoomTypeService;

    @Autowired
    private RoomAvailabilityService roomAvailabilityService;
    // GET all active hotels
    @GetMapping
    public ResponseEntity getAllHotels() {
        try {
            List<Hotel> hotels = hotelService.getAllActiveHotels();
            return new ResponseEntity<>(hotels, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // GET hotel by hotelId
    @GetMapping("/{hotelId}")
    public ResponseEntity getHotelById(@PathVariable String hotelId) {
        try {
            Hotel hotel = hotelService.getHotelByHotelId(hotelId)
                    .orElseThrow(() -> new RuntimeException("Hotel not found"));
            return new ResponseEntity<>(hotel, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.NOT_FOUND);
        }
    }

    // GET hotels by city
    @GetMapping("/search")
    public ResponseEntity getHotelsByCity(@RequestParam String city) {
        try {
            List<Hotel> hotels = hotelService.getHotelsByCity(city);
            return new ResponseEntity<>(hotels, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // GET room types by hotelId
    @GetMapping("/{hotelId}/room-types")
    public ResponseEntity getRoomTypesByHotel(@PathVariable String hotelId) {
        try {
            List<HotelRoomType> roomTypes = hotelRoomTypeService.getActiveRoomTypesByHotel(hotelId);
            return new ResponseEntity<>(roomTypes, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // GET — check room availability for dates
    @GetMapping("/{hotelId}/room-types/{roomTypeId}/availability")
    public ResponseEntity checkAvailability(
            @PathVariable String hotelId,
            @PathVariable String roomTypeId,
            @RequestParam String checkIn,
            @RequestParam String checkOut) {
        try {
            boolean available = roomAvailabilityService.isAvailable(
                    roomTypeId,
                    java.time.LocalDate.parse(checkIn),
                    java.time.LocalDate.parse(checkOut),
                    1
            );
            return new ResponseEntity<>(Map.of("available", available), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
}