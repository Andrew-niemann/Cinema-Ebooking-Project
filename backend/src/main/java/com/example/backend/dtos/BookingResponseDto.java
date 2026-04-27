package com.example.backend.dtos;

import java.util.List;

public class BookingResponseDto {

    private boolean success;
    private String message;

    // Order Summary Fields
    private String userEmail;
    private String movieName;
    private String showDate;
    private String showTime;
    private Long bookingId;

    private List<SeatSummaryDto> seats;

    private int totalTickets;
    private double totalBeforeTax;

    public BookingResponseDto(boolean success, String message, String userEmail,
                              String movieName,
                              String showDate,
                              String showTime,
                              List<SeatSummaryDto> seats,
                              int totalTickets,
                              double totalBeforeTax,
                              Long bookingId) {
        this.success = success;
        this.message = message;
        this.userEmail = userEmail;
        this.movieName = movieName;
        this.showDate = showDate;
        this.showTime = showTime;
        this.seats = seats;
        this.totalTickets = totalTickets;
        this.totalBeforeTax = totalBeforeTax;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public String getUserEmail() { return userEmail; }
    public String getMovieName() { return movieName; }
    public String getShowDate() { return showDate; }
    public String getShowTime() { return showTime; }
    public List<SeatSummaryDto> getSeats() { return seats; }
    public int getTotalTickets() { return totalTickets; }
    public double getTotalBeforeTax() { return totalBeforeTax; }
    public Long getBookingId() { return bookingId; }
    
}