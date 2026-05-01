package com.example.backend.services;

import org.springframework.stereotype.Service;

import com.example.backend.repositories.MoviesRepository;
import com.example.backend.entities.Movie;
import java.util.List;

@Service
public class MovieService {
    
    private final MoviesRepository movieRepository;

    public MovieService(MoviesRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public List<Movie> search(String title, String genre, String showDate) {
        
        List<Movie> allMovies = movieRepository.findAll();

        return allMovies.stream()
                .filter(movie -> {
                    boolean matchesTitle = (title == null || title.isBlank()) ||
                                           movie.getTitle().toLowerCase().contains(title.toLowerCase());

                    boolean matchesGenre = (genre == null || genre.isBlank()) ||
                                           movie.getGenre().toLowerCase().contains(genre.toLowerCase());

                    boolean matchesDate = (showDate == null || showDate.isBlank()) ||
                                           (movie.getShowings() != null && movie.getShowings().contains(showDate));

                    return matchesTitle && matchesGenre && matchesDate;
                })
                .toList();
    }

    public Movie addMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    public Movie getMovieById(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with ID: " + id));
    }

    public void deleteMovie(Long id) {
        movieRepository.deleteById(id);
    }

}
