package com.example.backend.controllers;

import org.springframework.web.bind.annotation.*;

import com.example.backend.entities.Movie;
import com.example.backend.repositories.MoviesRepository;
import com.example.backend.services.MovieService;

import java.util.List;

@CrossOrigin(origins = "*") // <- allows requests from any origin
@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping
    public List<Movie> getAllMovies() {
        return movieService.getAllMovies();

    }

    @GetMapping("/search")
    public List<Movie> SearchMovies(@RequestParam(required = false) String title,
                                    @RequestParam(required = false) String genre,
                                    @RequestParam(required = false) String showDate) {
                                        
        return movieService.search(title, genre, showDate);
    }

    @PostMapping
    public Movie addMovie(@RequestBody Movie movie) {
        return movieService.addMovie(movie);
    }

    @GetMapping("/{id}")
    public Movie getMovieById(@PathVariable Long id) {
        return movieService.getMovieById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
    }
}