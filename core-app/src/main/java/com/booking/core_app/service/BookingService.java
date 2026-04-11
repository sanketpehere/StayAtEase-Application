package com.booking.core_app.service;

import com.booking.core_app.enums.BookingStatus;
import com.booking.core_app.enums.BookingType;
import com.booking.core_app.enums.PaymentMode;
import com.booking.core_app.enums.PaymentStatus;
import com.booking.core_app.models.*;
import com.booking.core_app.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private HotelService hotelService;

    @Autowired
    private HotelRoomTypeService hotelRoomTypeService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private RoomAvailabilityService roomAvailabilityService;

    // =========================
    // CREATE BOOKING
    // =========================
    public Booking createBooking(Map<String, Object> payload, String email) {

        Customer customer = customerService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        String hotelId = (String) payload.get("hotelId");
        Hotel hotel = hotelService.getHotelByHotelId(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        String roomTypeId = (String) payload.get("roomTypeId");
        HotelRoomType roomType = hotelRoomTypeService.getRoomTypeByRoomTypeId(roomTypeId)
                .orElseThrow(() -> new RuntimeException("Room type not found"));

        LocalDate startDate = LocalDate.parse((String) payload.get("startDate"));
        LocalDate endDate = LocalDate.parse((String) payload.get("endDate"));

        // ← check availability before booking
        boolean available = roomAvailabilityService.isAvailable(roomTypeId, startDate, endDate, 1);
        if (!available) {
            throw new RuntimeException("Room is not available for selected dates");
        }

        Payment payment = new Payment();
        payment.setPaymentId("PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setAmount(BigDecimal.valueOf(((Number) payload.get("finalAmount")).doubleValue()));
        payment.setCurrency("INR");
        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        payment.setPaymentMode(PaymentMode.valueOf((String) payload.get("paymentMode")));
        payment.setPaymentGateway("MOCK");
        payment.setPaymentReferenceId("REF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setIsRefunded(false);
        payment.setPaymentInitiatedAt(LocalDateTime.now());
        payment.setPaymentCompletedAt(LocalDateTime.now());
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        payment.setCreatedBy("System");
        payment.setUpdatedBy("System");

        Booking booking = new Booking();
        booking.setBookingId("BK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setHotel(hotel);
        booking.setHotelRoomType(roomType);
        booking.setUser(customer);
        booking.setStartDate(startDate);
        booking.setEndDate(endDate);
        booking.setNumberOfRooms(1);
        booking.setTotalGuests(((Number) payload.get("totalGuests")).intValue());
        booking.setBaseAmount(BigDecimal.valueOf(((Number) payload.get("baseAmount")).doubleValue()));
        booking.setDiscountAmount(BigDecimal.valueOf(((Number) payload.get("discountAmount")).doubleValue()));
        booking.setTaxAmount(BigDecimal.valueOf(((Number) payload.get("taxAmount")).doubleValue()));
        booking.setFinalAmount(BigDecimal.valueOf(((Number) payload.get("finalAmount")).doubleValue()));
        booking.setDiscountCouponCode((String) payload.get("discountCouponCode"));
        booking.setBookingType(BookingType.ONLINE);
        booking.setBookingStatus(BookingStatus.CONFIRMED);
        booking.setPayment(payment);
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());
        booking.setCreatedBy("System");
        booking.setUpdatedBy("System");

        Booking saved = bookingRepository.save(booking);

        // ← block rooms after successful booking
        roomAvailabilityService.blockRooms(roomType, startDate, endDate);

        return saved;
    }

    // =========================
    // CANCEL BOOKING
    // =========================
    public Booking cancelBooking(String bookingId, String email) {

        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized to cancel this booking");
        }

        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }

        booking.setBookingStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());
        booking.setUpdatedBy(email);

        Booking saved = bookingRepository.save(booking);

        // ← restore rooms after cancellation
        roomAvailabilityService.restoreRooms(
                booking.getHotelRoomType(),
                booking.getStartDate(),
                booking.getEndDate()
        );

        return saved;
    }

    // =========================
    // GET BOOKINGS BY EMAIL
    // =========================
    public List<Booking> getBookingsByEmail(String email) {
        return bookingRepository.findByUser_Email(email);
    }

    // =========================
    // GET BOOKING BY BOOKING ID
    // =========================
    public Optional<Booking> getBookingByBookingId(String bookingId) {
        return bookingRepository.findByBookingId(bookingId);
    }

    public List<Booking> getBookingsByHotelId(String hotelId) {
        return bookingRepository.findByHotel_HotelId(hotelId);
    }
}