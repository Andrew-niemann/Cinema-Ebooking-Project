package com.example.backend.dtos;

public class CardDto {

    private String last4Digits;
    private String brand;

    public CardDto() {
        // default constructor for frameworks (e.g., Jackson)
    }

    // Constructor to map from entity
    public CardDto(String last4Digits, String brand) {

        this.last4Digits = last4Digits;
        this.brand = brand;
    }

    // Getters and setters

    public String getLast4Digits() {
        return last4Digits;
    }

    public void setLast4Digits(String last4Digits) {
        this.last4Digits = last4Digits;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

}
