package com.example.backend.entities;

import java.util.ArrayList;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class ShowSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "show_id", nullable = false)
    private Show show;

    @ManyToOne
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;

    @OneToMany(mappedBy = "showSeat", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Ticket> tickets = new ArrayList<>();

    private boolean isBooked = false;

    // Constructors, getters, setters
    public ShowSeat() {}
    public ShowSeat(Show show, Seat seat) {
        this.show = show;
        this.seat = seat;
    }

    public Long getId() { return id; }
    public Show getShow() { return show; }
    public Seat getSeat() { return seat; }
    public boolean isBooked() { return isBooked; }
    public void setBooked(boolean booked) { isBooked = booked; }
    public List<Ticket> getTickets() { return tickets; }
    public void setShow(Show show) { this.show = show; }
    public void setSeat(Seat seat) { this.seat = seat; }
    public void setTickets(List<Ticket> tickets) { this.tickets = tickets; }
}