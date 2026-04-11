package com.booking.core_app.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;


@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "room_availability")
public class RoomAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private HotelRoomType hotelRoomType;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private Integer availableRooms;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}