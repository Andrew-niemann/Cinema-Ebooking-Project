package com.example.backend.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.repositories.MoviesRepository;
import com.example.backend.repositories.ShowroomRepository;
import com.example.backend.repositories.SeatRepository;
import com.example.backend.repositories.ShowRepository;
import com.example.backend.dtos.AdminResponse;
import com.example.backend.dtos.CreateShowDto;
import com.example.backend.dtos.addMovieDto;
import com.example.backend.entities.Movie;
import com.example.backend.entities.Seat;
import com.example.backend.entities.Show;
import com.example.backend.entities.ShowSeat;
import com.example.backend.entities.Showroom;
import org.springframework.security.core.Authentication;

import jakarta.transaction.Transactional;

@Service
public class AdminService {
    
        private final MoviesRepository movieRepository;
        private final ShowroomRepository showroomRepository;
        private final SeatRepository seatRepository;
        private final ShowRepository showRepository;


        public AdminService(MoviesRepository movieRepository, ShowroomRepository showroomRepository, SeatRepository seatRepository, ShowRepository showRepository) {
            this.movieRepository = movieRepository;
            this.showroomRepository = showroomRepository;
            this.seatRepository = seatRepository;
            this.showRepository = showRepository;
        }

        public AdminResponse addMovie(addMovieDto request, Authentication authentication) {

            // Check if the user has ROLE_ADMIN
            boolean isAdmin = authentication.getAuthorities().stream()
                                        .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

            if (!isAdmin) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can perform this action");
            }

            try {
                Movie movie = new Movie();

                movie.setTitle(request.getTitle());
                movie.setPosterUrl(request.getPosterUrl());
                movie.setTrailerUrl(request.getTrailerUrl());
                movie.setGenre(request.getGenre());
                movie.setRating(request.getRating());
                movie.setDescription(request.getDescription());
                movie.setStatus(request.getStatus());

                movieRepository.save(movie);

                return new AdminResponse(true, "Movie added successfully", movie.getId());
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Error adding movie");
            }
        }

        @Transactional
        public AdminResponse removeMovie(Long id, Authentication authentication) {
            // Check if the user has ROLE_ADMIN
            boolean isAdmin = authentication.getAuthorities().stream()
                                        .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

            if (!isAdmin) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can perform this action");
            }

            try {
                if (!movieRepository.existsById(id)) {
                    return new AdminResponse(false, "Movie not found", null);
                }

                movieRepository.deleteById(id);
                return new AdminResponse(true, "Movie deleted successfully", id);
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Error deleting movie");
            }
        }

        @Transactional
        public AdminResponse createShow(CreateShowDto dto, Authentication authentication) {

            // Check if the user has ROLE_ADMIN
            boolean isAdmin = authentication.getAuthorities().stream()
                                        .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

            if (!isAdmin) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can perform this action");
            }

            if (dto.getShowDate() == null) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Show date is required"
                );
            }

            if (dto.getStartTime() == null) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Start time is required"
                );
            }

            Movie movie = movieRepository.findById(dto.getMovieId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found"));

            Showroom showroom = showroomRepository.findById(dto.getShowroomId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Showroom not found"));

            //Check for conflicts: same showroom, overlapping show
            List<Show> existingShows = showRepository.findByShowroomId(showroom.getId());

            for (Show existing : existingShows) {
                if (
                    existing.getShowDate().equals(dto.getShowDate()) &&
                    existing.getStartTime().equals(dto.getStartTime())
                ) {
                    throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "There is already a show scheduled in this showroom at this date and time"
                    );
                }
            }

            //Create the Show
            Show show = new Show(dto.getStartTime(), movie, showroom, dto.getShowDate());

            //Fetch all seats for the showroom
            List<Seat> seats = seatRepository.findByShowroom(showroom);

            //Create ShowSeats
            List<ShowSeat> showSeats = new ArrayList<>();
            for (Seat seat : seats) {
                ShowSeat showSeat = new ShowSeat();
                showSeat.setSeat(seat);
                showSeat.setShow(show);
                showSeat.setBooked(false);
                showSeats.add(showSeat);
            }

            show.setShowSeats(showSeats);

            //Save show and cascade ShowSeats
            showRepository.save(show);

            //Build response (example)
            AdminResponse response = new AdminResponse(true, "Show created successfully", show.getId());

            return response;
        }

        @Transactional
        public AdminResponse deleteShowing(Long id, Authentication authentication) {
            
            // Check if the user has ROLE_ADMIN
            boolean isAdmin = authentication.getAuthorities().stream()
                                        .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

            if (!isAdmin) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can perform this action");
            }

            try {
                if (!showRepository.existsById(id)) {
                    return new AdminResponse(false, "Show not found", null);
                }

                showRepository.deleteById(id);
                return new AdminResponse(true, "Show deleted successfully", id);
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Error deleting show");
            }
        }

}
