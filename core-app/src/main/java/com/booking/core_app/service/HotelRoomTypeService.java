package com.booking.core_app.service;

import com.booking.core_app.models.Hotel;
import com.booking.core_app.models.HotelRoomType;
import com.booking.core_app.repository.HotelRepository;
import com.booking.core_app.repository.HotelRoomTypeRepository;
import com.booking.core_app.repository.OwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class HotelRoomTypeService {

    @Autowired
    private HotelRoomTypeRepository hotelRoomTypeRepository;

    // =========================
    // GET ACTIVE ROOM TYPES BY HOTEL
    // =========================
    public List<HotelRoomType> getActiveRoomTypesByHotel(String hotelId) {
        return hotelRoomTypeRepository.findByHotel_HotelIdAndStatus(hotelId, "ACTIVE");
    }

    // =========================
    // GET ROOM TYPE BY ROOM TYPE ID
    // =========================
    public Optional<HotelRoomType> getRoomTypeByRoomTypeId(String roomTypeId) {
        return hotelRoomTypeRepository.findByRoomTypeId(roomTypeId);
    }

    // =========================
    // SAVE ROOM TYPE
    // =========================
    public HotelRoomType saveRoomType(HotelRoomType roomType) {
        return hotelRoomTypeRepository.save(roomType);
    }

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    // =========================
// CREATE ROOM TYPE
// =========================
    public HotelRoomType createRoomType(String hotelId, Map<String, Object> payload, String email) {

        // verify hotel belongs to this owner
        Hotel hotel = hotelRepository.findByHotelId(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        if (!hotel.getHotelOwner().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized to add room types to this hotel");
        }

        double basePrice = ((Number) payload.get("basePrice")).doubleValue();
        double discountPct = ((Number) payload.get("discountPercentage")).doubleValue();
        double finalPrice = basePrice - (basePrice * discountPct / 100);

        HotelRoomType roomType = new HotelRoomType();
        roomType.setRoomTypeId("RT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        roomType.setHotel(hotel);
        roomType.setRoomTypeName((String) payload.get("roomTypeName"));
        roomType.setTotalRooms(((Number) payload.get("totalRooms")).intValue());
        roomType.setBasePrice(BigDecimal.valueOf(basePrice));
        roomType.setDiscountPercentage(BigDecimal.valueOf(discountPct));
        roomType.setFinalPrice(BigDecimal.valueOf(Math.round(finalPrice)));
        roomType.setCurrency("INR");
        roomType.setMaxAdults(((Number) payload.get("maxAdults")).intValue());
        roomType.setMaxChildren(((Number) payload.get("maxChildren")).intValue());
        roomType.setBedCount(((Number) payload.get("bedCount")).intValue());
        roomType.setBedType((String) payload.get("bedType"));
        roomType.setRoomSizeSqFt(((Number) payload.get("roomSizeSqFt")).doubleValue());
        roomType.setStatus("ACTIVE");
        roomType.setIsApproved(true);
        roomType.setCreatedAt(LocalDateTime.now());
        roomType.setUpdatedAt(LocalDateTime.now());
        roomType.setCreatedBy(email);
        roomType.setUpdatedBy(email);

        return hotelRoomTypeRepository.save(roomType);
    }
}