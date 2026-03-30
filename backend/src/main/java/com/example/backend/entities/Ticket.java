package com.example.backend.entities;

import jakarta.persistence.*;

@Entity
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    String movieTitle;

    String showTime;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "show_seat_id", nullable = false)
    private ShowSeat showSeat;

    private double price;

    // Constructors, getters, setters
    public Ticket() {}
    public Ticket(Booking booking, ShowSeat showSeat, double price) {
        this.booking = booking;
        this.showSeat = showSeat;
        this.price = price;
    }

    public Long getId() { return id; }
    public Booking getBooking() { return booking; }
    public ShowSeat getShowSeat() { return showSeat; }
    public double getPrice() { return price; }

    public void setBooking(Booking booking) { this.booking = booking; }
    public void setShowSeat(ShowSeat showSeat) { this.showSeat = showSeat; }
    public void setPrice(double price) { this.price = price; }
}