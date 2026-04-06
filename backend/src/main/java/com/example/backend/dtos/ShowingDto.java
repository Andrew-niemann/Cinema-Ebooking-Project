package com.example.backend.dtos;

public class ShowingDto {

    private Long showId;
    private String showDate;
    private String startTime;
    private Long showroomId;

    public ShowingDto(Long showId, String showDate, String startTime, Long showroomId) {
        this.showId = showId;
        this.showDate = showDate;
        this.startTime = startTime;
        this.showroomId = showroomId;
    }

    public Long getShowId() {
        return showId;
    }

    public String getShowDate() {
        return showDate;
    }

    public String getStartTime() {
        return startTime;
    }

    public Long getShowroomId() {
        return showroomId;
    }
}
