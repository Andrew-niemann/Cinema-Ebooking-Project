package com.example.backend.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String seat_row;
    private String seat_number;

    @ManyToOne
    @JoinColumn(name = "showroom_id", nullable = false)
    private Showroom showroom;

    @OneToMany(mappedBy = "seat")
    private List<ShowSeat> showSeats = new ArrayList<>();

    // Constructors, getters, setters
    public Seat() {}
    public Seat(String row, String seatNumber, Showroom showroom) {
        this.seat_row = row;
        this.seat_number = seatNumber;
        this.showroom = showroom;
    }

    public Long getId() { return id; }
    public String getSeatNumber() { return seat_number; }
    public Showroom getShowroom() { return showroom; }
    public List<ShowSeat> getShowSeats() { return showSeats; }
    public void setId(Long id) { this.id = id; }
    public void setSeatNumber(String seatNumber) { this.seat_number = seatNumber; }
    public void setRow(String row) { this.seat_row = row; }
    public String getRow() { return seat_row; }
    public void setShowroom(Showroom showroom) { this.showroom = showroom; }
    public void setShowSeats(List<ShowSeat> showSeats) { this.showSeats = showSeats; }

}