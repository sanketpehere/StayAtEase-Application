package com.booking.core_app.models;

import com.booking.core_app.enums.BookingStatus;
import com.booking.core_app.enums.BookingType;
import com.booking.core_app.enums.PaymentMode;
import com.booking.core_app.enums.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String bookingId;

    @ManyToOne(fetch = FetchType.LAZY)
    private Hotel hotel;

    @ManyToOne(fetch = FetchType.LAZY)
    private HotelRoomType hotelRoomType;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @OneToOne(cascade = CascadeType.ALL)
    private Payment payment;

    //Stay details
    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    private Integer numberOfRooms;
    private Integer totalGuests;

    //pricing;
    private BigDecimal baseAmount;
    private  BigDecimal discountAmount;
    private BigDecimal taxAmount;
    private BigDecimal finalAmount;

    //coupon
    private String discountCouponCode;

    @Enumerated(EnumType.STRING)
    private BookingType bookingType;

    @Enumerated(EnumType.STRING)
    private BookingStatus bookingStatus;

    //audit
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;


}
