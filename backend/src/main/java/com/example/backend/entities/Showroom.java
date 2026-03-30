package com.example.backend.entities;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Showroom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "theatre_id", nullable = false)
    private Theatre theatre;

    @OneToMany(mappedBy = "showroom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Seat> seats;

    @OneToMany(mappedBy = "showroom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Show> shows;

    // Constructors, getters, setters
    public Showroom() {}
    public Showroom(String name, Theatre theatre) {
        this.name = name;
        this.theatre = theatre;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public Theatre getTheatre() { return theatre; }
    public List<Seat> getSeats() { return seats; }
    public List<Show> getShows() { return shows; }
}