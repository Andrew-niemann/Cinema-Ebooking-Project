package com.example.backend.dtos;

import java.util.List;
import com.example.backend.dtos.SeatSelectionDto;

public class BookingRequestDto {

    private Long showId;
    private List<SeatSelectionDto> seats;

    public Long getShowId() {
        return showId;
    }

    public List<SeatSelectionDto> getSeats() {
        return seats;
    }
}