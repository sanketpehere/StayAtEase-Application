package com.booking.core_app.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.Internal;

import java.math.BigDecimal;
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "hotel-owners")
@Inheritance(strategy = InheritanceType.JOINED)
public class HotelOwner extends User {

    //business  Information
    private String businessName;
    private String businessRegistrationNumber;
    private String taxId;
    private String businessType;

    // Contact information
    private String businessEmail;
    private String businessPhone;
    private String supportContactName;

    // Address
    private String country;
    private String state;
    private String city;
    private String addressLine1;
    private String addressLine2;
    private String zipCode;

    //financial Details
    private String bankAccountNumberMasked;
    private String bankName;
    private String ifscCode;
    private String payoutCurrency;

    //platform stats
    private int totalProperties;
    private int totalBookings;
    private BigDecimal totalRevenue;
    private BigDecimal commissionPercentage;

    //flags
    private boolean isActive;
    private boolean contractSigned;



}
