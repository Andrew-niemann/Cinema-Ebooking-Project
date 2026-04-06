package com.example.backend.dtos;

import java.util.List;
import com.example.backend.dtos.ShowingDto;

public class ShowingsResponse {

    private boolean success;
    private String message;
    private List<ShowingDto> showings;

    public ShowingsResponse(boolean success, String message, List<ShowingDto> showings) {
        this.success = success;
        this.message = message;
        this.showings = showings;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public List<ShowingDto> getShowings() {
        return showings;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setShowings(List<ShowingDto> showings) {
        this.showings = showings;
    }
}