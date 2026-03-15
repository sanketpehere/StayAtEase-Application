package com.booking.core_app.models;

import com.booking.core_app.enums.PaymentMode;
import com.booking.core_app.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.PriorityQueue;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String paymentId;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String currency;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    @Enumerated(EnumType.STRING)
    private PaymentMode paymentMode;

    // gateway infomation
    private String paymentReferenceId;

    private String paymentGateway;

    private String gatewayResponseMessage;

    //refund info
    private BigDecimal refundedAmount;
    private Boolean isRefunded;

    //timestamp
    private LocalDateTime paymentInitiatedAt;
    private LocalDateTime paymentCompletedAt;

    //Audit
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
}
