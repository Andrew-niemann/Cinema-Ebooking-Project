package com.example.backend.repositories;

import com.example.backend.entities.Show;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShowRepository extends JpaRepository<Show, Long> {

    // Optional: add custom queries here if needed
    // Example: find all shows for a specific movie
    List<Show> findByMovieId(Long movieId);

    // Example: find all shows in a specific showroom
    List<Show> findByShowroomId(Long showroomId);
    
}
