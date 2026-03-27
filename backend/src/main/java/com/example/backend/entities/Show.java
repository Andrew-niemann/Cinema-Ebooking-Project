package com.example.backend.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "show_table") 
public class Show {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime startTime;

    // ---- Relationships ----

    // Many shows belong to one movie
    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    // Many shows belong to one showroom
    @ManyToOne
    @JoinColumn(name = "showroom_id", nullable = false)
    private Showroom showroom;

    // One show has many showSeats (seats for that show)
    @OneToMany(mappedBy = "show", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ShowSeat> showSeats = new ArrayList<>();

    // ---- Constructors ----
    public Show() {}

    public Show(LocalDateTime startTime, Movie movie, Showroom showroom) {
        this.startTime = startTime;
        this.movie = movie;
        this.showroom = showroom;
    }

    // ---- Getters & Setters ----
    public Long getId() { return id; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public Movie getMovie() { return movie; }
    public void setMovie(Movie movie) { this.movie = movie; }

    public Showroom getShowroom() { return showroom; }
    public void setShowroom(Showroom showroom) { this.showroom = showroom; }

    public List<ShowSeat> getShowSeats() { return showSeats; }
    public void setShowSeats(List<ShowSeat> showSeats) { this.showSeats = showSeats; }
}