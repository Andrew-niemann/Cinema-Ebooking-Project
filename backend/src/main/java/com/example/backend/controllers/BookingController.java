package com.example.backend.controllers;

import com.example.backend.dtos.BookingRequestDto;
import com.example.backend.dtos.BookingResponseDto;
import com.example.backend.services.BookingService;
import java.util.List;
import com.example.backend.dtos.BookingListDto;
import com.example.backend.dtos.PaymentDto;

import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/create-booking")
    public ResponseEntity<BookingResponseDto> createBooking(@RequestBody BookingRequestDto request, Authentication authentication) {

        BookingResponseDto response = bookingService.createBooking(request, authentication);

        return ResponseEntity
                .status(response.isSuccess() ? 200 : 400)
                .body(response);
    }

    @PostMapping("/confirm-booking")
    public ResponseEntity<BookingResponseDto> confirmBooking(@RequestBody PaymentDto request, Authentication authentication) {

        BookingResponseDto response = bookingService.confirmBooking(request, authentication);

        return ResponseEntity
                .status(response.isSuccess() ? 200 : 400)
                .body(response);
    }

    @DeleteMapping("/delete-booking/{bookingId}")
    public ResponseEntity<String> deleteBooking(@PathVariable Long bookingId, Authentication authentication) {
        
        BookingResponseDto response = bookingService.deleteBooking(bookingId, authentication);

        return ResponseEntity
            .status(response.isSuccess() ? 200 : 400)
            .body(response.isSuccess() ? "Booking cancelled successfully" : "Failed to cancel booking. It may not exist or you may not have permission.");

    }

    @GetMapping("my-bookings")
    public ResponseEntity<List<BookingListDto>> getMyBookings(Authentication authentication) {
        
        List<BookingListDto> bookings = bookingService.getBookingsForUser(authentication);

        return ResponseEntity
            .status(bookings.isEmpty() ? 204 : 200)
            .body(bookings);
    }
}