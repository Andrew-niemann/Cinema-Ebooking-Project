package com.example.backend.dtos;

import java.util.List;


public class ShowSeatResponse {

    private boolean isSuccess;
    private String message;
    private List<ShowSeatDto> showSeats;

    public ShowSeatResponse(boolean isSuccess, String message, List<ShowSeatDto> showSeats) {
        this.isSuccess = isSuccess;
        this.message = message;
        this.showSeats = showSeats;
    }

    // getters
    public boolean isSuccess() {
        return isSuccess;
    }

    public String getMessage() {
        return message;
    }

    public List<ShowSeatDto> getShowSeats() {
        return showSeats;
    }
}