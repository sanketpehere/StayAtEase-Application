package com.booking.core_app.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "customers")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Getter
@Setter
public class Customer extends User {
    // child table of Users table
    // being a child, customer will have some additional fields (customer specific fields)


    //travel preferrences
    private String preferredLanguage;
    private String preferredCurrency;
    private String preferredPropertyType;
    private String preferredRoomType;

    private String preferredPriceRange;

    // Booking stats
    private int totalBookings;
    private BigDecimal totalAmountSpent;

    private boolean newsLetterSubscribed;




}
