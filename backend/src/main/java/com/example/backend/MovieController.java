package com.example.backend;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.backend.MoviesJPARepository;

@CrossOrigin(origins = "*") // <- allows requests from any origin
@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MoviesJPARepository movieRepository;

    public MovieController(MoviesJPARepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @GetMapping
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    @GetMapping("/search")
    public List<Movie> SearchMovies(@RequestParam(required = false) String title,
                                    @RequestParam(required = false) String genre,
                                    @RequestParam(required = false) String showDate) {
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

    @PostMapping
    public Movie addMovie(@RequestBody Movie movie) {
        return movieRepository.save(movie);
    }

    @GetMapping("/{id}")
    public Movie getMovieById(@PathVariable Integer id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with ID: " + id));
    }

    @DeleteMapping("/{id}")
    public void deleteMovie(@PathVariable Integer id) {
        movieRepository.deleteById(id);
    }
}