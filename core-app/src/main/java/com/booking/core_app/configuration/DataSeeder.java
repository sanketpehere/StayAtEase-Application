package com.booking.core_app.configuration;

import com.booking.core_app.models.Hotel;
import com.booking.core_app.models.HotelRoomType;
import com.booking.core_app.repository.HotelRepository;
import com.booking.core_app.repository.HotelRoomTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private HotelRoomTypeRepository hotelRoomTypeRepository;

    @Override
    public void run(String... args) throws Exception {

        if (hotelRepository.count() > 0) return;

        // =====================
        // HOTELS
        // =====================
        Hotel h1 = new Hotel();
        h1.setHotelId("HTL001");
        h1.setHotelName("The Grand Mumbai");
        h1.setHotelDescription("A luxury 5-star hotel in the heart of Mumbai with stunning sea views.");
        h1.setStarRating(5.0);
        h1.setHotelType("LUXURY");
        h1.setAddressLine1("Marine Drive, Nariman Point");
        h1.setCity("Mumbai");
        h1.setState("Maharashtra");
        h1.setCountry("India");
        h1.setPincode("400021");
        h1.setTotalRooms(200);
        h1.setCheckInTime(LocalTime.of(14, 0));
        h1.setCheckOutTime(LocalTime.of(11, 0));
        h1.setAvgRating(4.8);
        h1.setTotalReviews(1240);
        h1.setTotalBookings(5600);
        h1.setStatus("ACTIVE");
        h1.setIsApproved(true);
        h1.setCreatedAt(LocalDateTime.now());
        h1.setUpdatedAt(LocalDateTime.now());
        h1.setCreatedBy("System");
        h1.setUpdatedBy("System");

        Hotel h2 = new Hotel();
        h2.setHotelId("HTL002");
        h2.setHotelName("Pune Bliss Resort");
        h2.setHotelDescription("A serene resort nestled in the hills of Pune, perfect for a weekend getaway.");
        h2.setStarRating(4.0);
        h2.setHotelType("RESORT");
        h2.setAddressLine1("Baner Road, Baner");
        h2.setCity("Pune");
        h2.setState("Maharashtra");
        h2.setCountry("India");
        h2.setPincode("411045");
        h2.setTotalRooms(80);
        h2.setCheckInTime(LocalTime.of(13, 0));
        h2.setCheckOutTime(LocalTime.of(10, 0));
        h2.setAvgRating(4.4);
        h2.setTotalReviews(560);
        h2.setTotalBookings(1800);
        h2.setStatus("ACTIVE");
        h2.setIsApproved(true);
        h2.setCreatedAt(LocalDateTime.now());
        h2.setUpdatedAt(LocalDateTime.now());
        h2.setCreatedBy("System");
        h2.setUpdatedBy("System");

        Hotel h3 = new Hotel();
        h3.setHotelId("HTL003");
        h3.setHotelName("Delhi Heritage Inn");
        h3.setHotelDescription("Experience the rich culture of Delhi in this beautifully restored heritage property.");
        h3.setStarRating(4.0);
        h3.setHotelType("HERITAGE");
        h3.setAddressLine1("Connaught Place, New Delhi");
        h3.setCity("Delhi");
        h3.setState("Delhi");
        h3.setCountry("India");
        h3.setPincode("110001");
        h3.setTotalRooms(50);
        h3.setCheckInTime(LocalTime.of(12, 0));
        h3.setCheckOutTime(LocalTime.of(10, 0));
        h3.setAvgRating(4.6);
        h3.setTotalReviews(890);
        h3.setTotalBookings(3200);
        h3.setStatus("ACTIVE");
        h3.setIsApproved(true);
        h3.setCreatedAt(LocalDateTime.now());
        h3.setUpdatedAt(LocalDateTime.now());
        h3.setCreatedBy("System");
        h3.setUpdatedBy("System");

        Hotel h4 = new Hotel();
        h4.setHotelId("HTL004");
        h4.setHotelName("Goa Beach House");
        h4.setHotelDescription("A beachfront property with stunning views of the Arabian Sea.");
        h4.setStarRating(3.0);
        h4.setHotelType("BEACH");
        h4.setAddressLine1("Calangute Beach Road");
        h4.setCity("Goa");
        h4.setState("Goa");
        h4.setCountry("India");
        h4.setPincode("403516");
        h4.setTotalRooms(35);
        h4.setCheckInTime(LocalTime.of(14, 0));
        h4.setCheckOutTime(LocalTime.of(11, 0));
        h4.setAvgRating(4.2);
        h4.setTotalReviews(430);
        h4.setTotalBookings(980);
        h4.setStatus("ACTIVE");
        h4.setIsApproved(true);
        h4.setCreatedAt(LocalDateTime.now());
        h4.setUpdatedAt(LocalDateTime.now());
        h4.setCreatedBy("System");
        h4.setUpdatedBy("System");

        h1.setStartingPrice(BigDecimal.valueOf(7225)); // lowest room price
        h2.setStartingPrice(BigDecimal.valueOf(4050));
        h3.setStartingPrice(BigDecimal.valueOf(5520));
        h4.setStartingPrice(BigDecimal.valueOf(3325));

        hotelRepository.save(h1);
        hotelRepository.save(h2);
        hotelRepository.save(h3);
        hotelRepository.save(h4);

        // =====================
        // ROOM TYPES
        // =====================

        // HTL001 room types
        createRoomType("RT001", "Deluxe Room", h1, 50, 8500, 15, 7225, 2, 1, 1, "KING", 380.0);
        createRoomType("RT002", "Premium Suite", h1, 20, 15000, 10, 13500, 2, 2, 1, "KING", 620.0);
        createRoomType("RT003", "Family Room", h1, 30, 12000, 5, 11400, 4, 2, 2, "QUEEN", 520.0);

        // HTL002 room types
        createRoomType("RT004", "Garden View Room", h2, 30, 4500, 10, 4050, 2, 1, 1, "QUEEN", 300.0);
        createRoomType("RT005", "Pool Villa", h2, 10, 9000, 12, 7920, 2, 2, 1, "KING", 750.0);

        // HTL003 room types
        createRoomType("RT006", "Heritage Room", h3, 20, 6000, 8, 5520, 2, 1, 1, "KING", 350.0);
        createRoomType("RT007", "Royal Suite", h3, 10, 14000, 10, 12600, 3, 1, 1, "KING", 700.0);

        // HTL004 room types
        createRoomType("RT008", "Sea View Room", h4, 15, 3500, 5, 3325, 2, 1, 1, "QUEEN", 280.0);
        createRoomType("RT009", "Beach Cottage", h4, 8, 6500, 10, 5850, 2, 2, 1, "KING", 450.0);

        System.out.println("✅ Dummy hotel and room type data seeded successfully!");
    }

    private void createRoomType(String roomTypeId, String name, Hotel hotel,
                                int totalRooms, double basePrice, double discountPct,
                                double finalPrice, int maxAdults, int maxChildren,
                                int bedCount, String bedType, double sizeSqFt) {
        HotelRoomType rt = new HotelRoomType();
        rt.setRoomTypeId(roomTypeId);
        rt.setRoomTypeName(name);
        rt.setHotel(hotel);
        rt.setTotalRooms(totalRooms);
        rt.setBasePrice(BigDecimal.valueOf(basePrice));
        rt.setDiscountPercentage(BigDecimal.valueOf(discountPct));
        rt.setFinalPrice(BigDecimal.valueOf(finalPrice));
        rt.setCurrency("INR");
        rt.setMaxAdults(maxAdults);
        rt.setMaxChildren(maxChildren);
        rt.setBedCount(bedCount);
        rt.setBedType(bedType);
        rt.setRoomSizeSqFt(sizeSqFt);
        rt.setStatus("ACTIVE");
        rt.setIsApproved(true);
        rt.setCreatedAt(LocalDateTime.now());
        rt.setUpdatedAt(LocalDateTime.now());
        rt.setCreatedBy("System");
        rt.setUpdatedBy("System");
        hotelRoomTypeRepository.save(rt);


    }
}