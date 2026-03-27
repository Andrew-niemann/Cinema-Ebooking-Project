package com.example.backend.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String seatNumber;

    @ManyToOne
    @JoinColumn(name = "showroom_id", nullable = false)
    private Showroom showroom;

    @OneToMany(mappedBy = "seat")
    private List<ShowSeat> showSeats = new ArrayList<>();

    // Constructors, getters, setters
    public Seat() {}
    public Seat(String seatNumber, Showroom showroom) {
        this.seatNumber = seatNumber;
        this.showroom = showroom;
    }

    public Long getId() { return id; }
    public String getSeatNumber() { return seatNumber; }
    public Showroom getShowroom() { return showroom; }
}