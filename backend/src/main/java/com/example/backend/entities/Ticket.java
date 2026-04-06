package com.example.backend.entities;

import com.example.backend.enums.TicketType;

import jakarta.persistence.*;

@Entity
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    String movieTitle;

    String showTime;

    TicketType ticketType;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "show_seat_id", nullable = false)
    private ShowSeat showSeat;

    private double price;

    // Constructors, getters, setters
    public Ticket() {}
    public Ticket(Booking booking, ShowSeat showSeat, double price, TicketType ticketType) {
        this.booking = booking;
        this.showSeat = showSeat;
        this.price = price;
        this.ticketType = ticketType;
    }

    public Long getId() { return id; }
    public Booking getBooking() { return booking; }
    public ShowSeat getShowSeat() { return showSeat; }
    public double getPrice() { return price; }
    public TicketType getTicketType() { return ticketType; }

    public void setBooking(Booking booking) { this.booking = booking; }
    public void setShowSeat(ShowSeat showSeat) { this.showSeat = showSeat; }
    public void setPrice(double price) { this.price = price; }
    public void setTicketType(TicketType ticketType) { this.ticketType = ticketType; }
}