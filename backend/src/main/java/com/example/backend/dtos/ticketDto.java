package com.example.backend.dtos;

public class ticketDto {
    
    String seatNumber;
    String ticketType;
    double price;
    public ticketDto(String seatNumber, String ticketType, double price) {
        this.seatNumber = seatNumber;
        this.ticketType = ticketType;
        this.price = price;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public String getTicketType() {
        return ticketType;
    }

    public double getPrice() {
        return price;
    }

}
