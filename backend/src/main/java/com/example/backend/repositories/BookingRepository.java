package com.example.backend.repositories;  // use your package name

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.backend.entities.Booking;
import com.example.backend.entities.User;

import com.example.backend.enums.BookingStatus;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUser(User user);

    @Query("SELECT b.movie.title FROM Booking b WHERE b.user.id = :userId")
    List<String> findMovieTitlesByUserId(@Param("userId") Long userId);

    List<Booking> findByStatusAndCreatedAtBefore(BookingStatus status, LocalDateTime time);
}