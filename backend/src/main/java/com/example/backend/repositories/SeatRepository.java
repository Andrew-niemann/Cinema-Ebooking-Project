package com.example.backend.repositories;

import com.example.backend.entities.Seat;
import com.example.backend.entities.Showroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {

    // Fetch all seats in a specific showroom
    List<Seat> findByShowroom(Showroom showroom);
}