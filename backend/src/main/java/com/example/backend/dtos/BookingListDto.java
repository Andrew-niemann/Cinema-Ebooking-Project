package com.example.backend.dtos;

import java.util.List;

public class BookingListDto {

    private Long bookingId;
    private String movieTitle;
    private String showDate;
    private String showTime;
    private int numberOfTickets;
    private double totalPrice;
    private String status;
    private List<ticketDto> tickets;

    public BookingListDto(Long bookingId, String movieTitle, String showDate,
                          String showTime, int numberOfTickets,
                          double totalPrice, String status, List<ticketDto> tickets) {
        this.bookingId = bookingId;
        this.movieTitle = movieTitle;
        this.showDate = showDate;
        this.showTime = showTime;
        this.numberOfTickets = numberOfTickets;
        this.totalPrice = totalPrice;
        this.status = status;
        this.tickets = tickets;
    }

    // Getters
    public Long getBookingId() { return bookingId; }
    public String getMovieTitle() { return movieTitle; }
    public String getShowDate() { return showDate; }
    public String getShowTime() { return showTime; }
    public int getNumberOfTickets() { return numberOfTickets; }
    public double getTotalPrice() { return totalPrice; }
    public String getStatus() { return status; }
    public List<ticketDto> getTickets() { return tickets; }
}