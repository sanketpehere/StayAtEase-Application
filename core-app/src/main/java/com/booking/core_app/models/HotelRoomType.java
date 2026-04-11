package com.booking.core_app.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "hotel-room-types")
public class HotelRoomType {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String roomTypeId;

    @ManyToOne(fetch = FetchType.LAZY)
    private Hotel hotel;

    @Column(nullable = false)
    private String roomTypeName;

    @Column(nullable = false)
    private Integer totalRooms;

    @Column(nullable = false)
    private BigDecimal basePrice;

    @Column(nullable = false)
    private BigDecimal discountPercentage;

    @Column(nullable = false)
    private  String currency;

    //calculated or stored field
    private BigDecimal finalPrice;

    //room capacity
    private Integer maxAdults;
    private Integer maxChildren;
    private Integer bedCount;
    private String bedType; // KING, QUEEN
    private Double roomSizeSqFt;

    private String status;
    private  Boolean isApproved;

    //audit
    private String createdBy;
    private String updatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
