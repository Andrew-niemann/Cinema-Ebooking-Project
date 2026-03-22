package com.example.backend.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "favorite_movies",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "movie_id"}))
public class FavoriteMovie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // surrogate primary key

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    // Constructors
    public FavoriteMovie() {}

    public FavoriteMovie(User user, Movie movie) {
        this.user = user;
        this.movie = movie;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }
}