package com.example.backend;

import java.util.List;

public class Movie {

    private long id;
    private String title;
    private String posterUrl;
    private String trailerUrl;
    private String genre;
    private String rating;
    private String description;
    private String status;
    private List<String> showTimes;
    private List<String> showDates;

    public Movie(long id, String title, String posterUrl, String trailerUrl, String genre, String rating, String description, String status, List<String> showtimes, List<String> showDates) {
        this.id = id;
        this.title = title;
        this.posterUrl = posterUrl;
        this.trailerUrl = trailerUrl;
        this.genre = genre;
        this.rating = rating;
        this.description = description;
        this.status = status;
        this.showTimes = showtimes;
        this.showDates = showDates;
    }

    public long getId() {return id;}
    public String getTitle() {return title;}
    public String getPosterUrl() {return posterUrl;}
    public String getTrailerUrl() {return trailerUrl;}
    public String getGenre() {return genre;}
    public String getRating() {return rating;}
    public String getDescription() {return description;}
    public String getStatus() {return status;}
    public List<String> getShowTimes() {return showTimes;}
    public List<String> getShowDates() {return showDates;}

    public void setId(long id) {this.id = id;}
    public void setTitle(String title) {this.title = title;}
    public void setPosterUrl(String posterUrl) {this.posterUrl = posterUrl;}
    public void setTrailerUrl(String trailerUrl) {this.trailerUrl = trailerUrl;}
    public void setGenre(String genre) {this.genre = genre;}
    public void setRating(String rating) {this.rating = rating;}
    public void setDescription(String description) {this.description = description;}
    public void setStatus(String status) {this.status = status;}
    public void setShowTimes(List<String> showTimes) {this.showTimes = showTimes;}
    public void setShowDates(List<String> showDates) {this.showDates = showDates;}

}
