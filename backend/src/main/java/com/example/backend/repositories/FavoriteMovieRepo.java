package com.example.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.backend.entities.FavoriteMovie;
import com.example.backend.entities.User;

public interface FavoriteMovieRepo extends JpaRepository<FavoriteMovie, Long> {

    // Find all favorites for a specific user
    List<FavoriteMovie> findByUser(User user);

    @Query("SELECT f.movie.title FROM FavoriteMovie f WHERE f.user.id = :userId")
    List<String> findFavoriteMovieTitlesByUserId(Long userId);

    List<FavoriteMovie> findByUser_Id(Long userId);
}