package com.example.backend.dtos;

import com.example.backend.dtos.CardDto;

public class PaymentDto {

    private CardDto card;
    private Long bookingId;

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public CardDto getCard() {
        return card;
    }

    public void setCard(CardDto card) {
        this.card = card;
    }

}