package com.example.backend.services;

import com.example.backend.entities.Booking;
import com.example.backend.repositories.BookingRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import com.example.backend.enums.BookingStatus;
import com.example.backend.entities.ShowSeat;
import com.example.backend.repositories.ShowSeatRepository;
import jakarta.transaction.Transactional;

@Service
public class BookingCleanupService {

    private final BookingRepository bookingRepository;
    private final ShowSeatRepository showSeatRepository;

    public BookingCleanupService(BookingRepository bookingRepository,
                                 ShowSeatRepository showSeatRepository) {
        this.bookingRepository = bookingRepository;
        this.showSeatRepository = showSeatRepository;
    }

    @Scheduled(fixedRate = 30000)
    @Transactional
    public void deleteExpiredPendingBookings() {

        List<Booking> expired = bookingRepository
                .findByStatusAndCreatedAtBefore(
                        BookingStatus.PENDING,
                        LocalDateTime.now().minusMinutes(5)
                );

        for (Booking booking : expired) {

            // free seats FIRST
            booking.getTickets().forEach(ticket -> {
                ShowSeat seat = ticket.getShowSeat();
                seat.setBooked(false);
                showSeatRepository.save(seat);
            });

            bookingRepository.delete(booking);
        }
    }
}