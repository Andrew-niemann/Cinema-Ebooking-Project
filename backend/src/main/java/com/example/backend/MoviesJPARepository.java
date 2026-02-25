package com.example.backend;  // use your package name

import com.example.backend.Movie;   // path to your Movie entity
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MoviesJPARepository extends JpaRepository<Movie, Integer> {
    
    // Optional: custom query methods
    
    // Find movies by genre
    List<Movie> findByGenre(String genre);
    
    // Find movies by rating
    List<Movie> findByRating(String rating);
    
    // Find movies containing a keyword in the title
    List<Movie> findByTitleContainingIgnoreCase(String keyword);
}
