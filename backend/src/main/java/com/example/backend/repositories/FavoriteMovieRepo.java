package com.example.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.entities.FavoriteMovie;
import com.example.backend.entities.User;

public interface FavoriteMovieRepo extends JpaRepository<FavoriteMovie, Long> {

    // Find all favorites for a specific user
    List<FavoriteMovie> findByUser(User user);
}