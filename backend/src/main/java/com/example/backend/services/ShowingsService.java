package com.example.backend.services;

import com.example.backend.dtos.ShowingDto;
import com.example.backend.dtos.ShowingsResponse;
import com.example.backend.entities.Show;
import com.example.backend.repositories.ShowRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShowingsService {

    private final ShowRepository showRepository;

    public ShowingsService(ShowRepository showRepository) {
        this.showRepository = showRepository;
    }

    public ShowingsResponse getShowings(Long movieId) {

        List<Show> shows;

        if (movieId == 0) {
            // Return all shows
            shows = showRepository.findAll();
            if (shows.isEmpty()) {
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No showings available"
                );
            }
        } else {
            // Return shows for a specific movie
            shows = showRepository.findByMovieId(movieId);

            if (shows.isEmpty()) {
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No showings found for movie with id " + movieId
                );
            }
        }

        // Map Show -> ShowingDto
        List<ShowingDto> showings = shows.stream()
                .map(show -> new ShowingDto(
                        show.getId(),
                        show.getShowDate(),
                        show.getStartTime(),
                        show.getShowroom().getId()
                ))
                .collect(Collectors.toList());

        return new ShowingsResponse(true, "Showings fetched", showings);
    }
}