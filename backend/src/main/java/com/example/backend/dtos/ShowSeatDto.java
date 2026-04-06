package com.example.backend.dtos;

import java.util.ArrayList;

import com.example.backend.entities.Seat;
import com.example.backend.entities.Show;
import com.example.backend.entities.Ticket;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

public class ShowSeatDto {

    private Long id;
    private String seatIdentifier;
    private boolean isBooked;

    public ShowSeatDto(Long id, String seatIdentifier, boolean isBooked) {
        this.id = id;
        this.seatIdentifier = seatIdentifier;
        this.isBooked = isBooked;
    }

    // getters
    public Long getId() { return id; }
    public String getSeatIdentifier() { return seatIdentifier; }
    public boolean isBooked() { return isBooked; }
    // setters
    public void setSeatIdentifier(String seatIdentifier) { this.seatIdentifier = seatIdentifier; }
    public void setIsBooked(boolean isBooked) { this.isBooked = isBooked; }
}
