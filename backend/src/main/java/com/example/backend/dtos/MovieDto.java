package com.example.backend.dtos;

public class MovieDto {

    private Long id;
    private String title;
    private String posterUrl; // URL or path to the movie poster

    public MovieDto() {
        // Default constructor for frameworks like Jackson
    }

    // Constructor to map from entity
    public MovieDto(Long id, String title, String posterUrl) {
        this.id = id;
        this.title = title;
        this.posterUrl = posterUrl;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }
}