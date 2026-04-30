package com.example.backend.controllers;

import com.example.backend.dtos.BookingResponseDto;
import com.example.backend.dtos.PaymentDto;
import com.example.backend.services.BookingService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final BookingService bookingService;

    public PaymentController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/confirm-booking")
    public ResponseEntity<BookingResponseDto> confirmBooking(@RequestBody PaymentDto request, Authentication authentication) {
        BookingResponseDto response = bookingService.confirmBooking(request, authentication);

        return ResponseEntity
                .status(response.isSuccess() ? 200 : 400)
                .body(response);
    }
}
