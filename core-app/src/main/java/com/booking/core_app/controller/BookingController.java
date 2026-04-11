package com.booking.core_app.controller;

import com.booking.core_app.models.Booking;
import com.booking.core_app.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // POST — create booking
    @PostMapping
    public ResponseEntity createBooking(
            @RequestBody Map<String, Object> payload,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            Booking booking = bookingService.createBooking(payload, email);
            return new ResponseEntity<>(booking, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    // GET — get all bookings for logged in customer
    @GetMapping("/my")
    public ResponseEntity getMyBookings(Authentication authentication) {
        try {
            String email = authentication.getName();
            List<Booking> bookings = bookingService.getBookingsByEmail(email);
            return new ResponseEntity<>(bookings, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    // GET — get booking by bookingId
    @GetMapping("/{bookingId}")
    public ResponseEntity getBookingById(@PathVariable String bookingId) {
        try {
            Booking booking = bookingService.getBookingByBookingId(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
            return new ResponseEntity<>(booking, HttpStatus.OK);
        } catch (RuntimeException e) {
            e.printStackTrace(); // ← add this
            System.out.println("BOOKING ERROR: " + e.getMessage()); // ← add
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.NOT_FOUND);
        }
    }
    // PUT — cancel a booking
    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity cancelBooking(
            @PathVariable String bookingId,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            Booking booking = bookingService.cancelBooking(bookingId, email);
            return new ResponseEntity<>(booking, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
}