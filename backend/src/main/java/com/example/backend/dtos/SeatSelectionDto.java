package com.example.backend.dtos;

public class SeatSelectionDto {

    private Long showSeatId;
    private String ticketType; // "ADULT", "SENIOR", "CHILD"

    public Long getShowSeatId() {
        return showSeatId;
    }

    public String getTicketType() {
        return ticketType;
    }

}
