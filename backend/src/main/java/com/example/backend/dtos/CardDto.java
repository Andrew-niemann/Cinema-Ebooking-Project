package com.example.backend.dtos;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class CardDto {

    private Long id;
    private String digits;
    private String expirationMonth;
    private String expirationYear;
    private String cvv;

    public CardDto(String digits, String expirationYear, String expirationMonth, String cvv) {
        this.digits = digits;
        this.expirationYear = expirationYear;
        this.expirationMonth = expirationMonth;
        this.cvv = cvv;
    }

    public String getDigits() {
        return digits;
    }

    public void setDigits(String digits) {
        this.digits = digits;
    }

    public String getExpirationMonth() {
        return expirationMonth;
    }

    public void setExpirationMonth(String expirationMonth) {
        this.expirationMonth = expirationMonth;
    }

    public String getExpirationYear() {
        return expirationYear;
    }

    public void setExpirationYear(String expirationYear) {
        this.expirationYear = expirationYear;
    }

    public String getCvv() {
        return cvv;
    }

    public void setCvv(String cvv) {
        this.cvv = cvv;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

}
