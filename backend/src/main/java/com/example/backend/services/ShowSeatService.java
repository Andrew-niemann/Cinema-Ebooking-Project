package com.example.backend.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.dtos.ShowSeatDto;
import com.example.backend.dtos.ShowSeatResponse;
import com.example.backend.entities.ShowSeat;
import com.example.backend.repositories.ShowSeatRepository;

@Service
public class ShowSeatService {

    private final ShowSeatRepository showSeatRepository;

    public ShowSeatService(ShowSeatRepository showSeatRepository) {
        this.showSeatRepository = showSeatRepository;
    }

    public ShowSeatResponse getShowings(Long showId) {
        
        List<ShowSeat> seats = showSeatRepository.findByShowIdWithSeat(showId);

        if (seats.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "No seats found for show with id " + showId);
        }

        List<ShowSeatDto> seatDtos = seats.stream()
                .map(seat -> new ShowSeatDto(
                        seat.getId(),
                        seat.getSeat().getRow() + seat.getSeat().getSeatNumber(),
                        seat.isBooked()
                ))
                .collect(Collectors.toList());

        return new ShowSeatResponse(true, "Seats fetched successfully", seatDtos);
    }
}