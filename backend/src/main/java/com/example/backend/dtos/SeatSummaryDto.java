package com.example.backend.dtos;

public class SeatSummaryDto {

    private String seatLabel;
    private String ticketType;
    private double price;

    public SeatSummaryDto(String seatLabel, String ticketType, double price) {
        this.seatLabel = seatLabel;
        this.ticketType = ticketType;
        this.price = price;
    }

    public String getSeatLabel() { return seatLabel; }
    public String getTicketType() { return ticketType; }
    public double getPrice() { return price; }

}