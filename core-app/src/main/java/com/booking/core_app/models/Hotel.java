package com.booking.core_app.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "hotels")
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    @Column(nullable = false, unique = true)
    private  String  hotelId;

    private String hotelName;
    private String hotelDescription;
    private Double starRating;
    private String hotelType;

    //location
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String country;
    private String pincode;
    private Double latitude;
    private Double longitude;

    //property info
    private Integer totalRooms;
    private LocalTime checkInTime;
    private LocalTime checkOutTime;


    //metrics
    private Double avgRating;
    private Integer totalReviews;
    private Integer totalBookings;

    //images
    @OneToMany
    List<Document> documents;

    @ManyToOne
    private HotelOwner hotelOwner;
    private String status;
    private Boolean isApproved;

    //audit
    private String createdBy;
    private String updatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
