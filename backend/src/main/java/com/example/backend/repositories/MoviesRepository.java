package com.example.backend.repositories;  // use your package name

import com.example.backend.entities.Movie;   // path to your Movie entity
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MoviesRepository extends JpaRepository<Movie, Long> {
    
    List<Movie> findByGenre(String genre);
    
    List<Movie> findByRating(String rating);
    
    List<Movie> findByTitleContainingIgnoreCase(String keyword);

    List<Movie> findByTitleIn(List<String> titles);

    List<Movie> findAll();
}
