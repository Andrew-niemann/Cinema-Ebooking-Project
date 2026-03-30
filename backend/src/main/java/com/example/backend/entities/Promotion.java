package com.example.backend.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "promotions")
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The code users enter
    @Column(unique = true, nullable = false)
    private String code;

    // Discount: either fixed amount or percentage
    private Double discountPercentage;  // e.g., 10.0 for 10%
    private Double discountAmount;      // optional fixed amount

    // Validity period
    private boolean isValid;

    // Optional: One promotion can be applied to many bookings
    @OneToMany(mappedBy = "promotion")
    private List<Booking> bookings = new ArrayList<>();

    // Constructors
    public Promotion() {}

    public Promotion(String code, Double discountPercentage, Double discountAmount, boolean isValid) {
        this.code = code;
        this.discountPercentage = discountPercentage;
        this.discountAmount = discountAmount;
        this.isValid = isValid;
    }

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public String getCode() { return code; }
    public Double getDiscountPercentage() { return discountPercentage; }
    public Double getDiscountAmount() { return discountAmount; }
    public boolean getIsValid() { return isValid; }
    public List<Booking> getBookings() { return bookings; }

    public void setCode(String code) { this.code = code; }
    public void setDiscountPercentage(Double discountPercentage) { this.discountPercentage = discountPercentage; }
    public void setDiscountAmount(Double discountAmount) { this.discountAmount = discountAmount; }
    public void setBookings(List<Booking> bookings) { this.bookings = bookings; }
    public void setIsValid(boolean isValid) { this.isValid = isValid; }

    // Convenience method: check if promotion is currently valid
    public boolean isValid() {
        return isValid;
    }
}