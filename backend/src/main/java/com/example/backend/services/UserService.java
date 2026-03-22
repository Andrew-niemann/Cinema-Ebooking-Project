package com.example.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import com.example.backend.entities.Address;
import com.example.backend.entities.FavoriteMovie;
import com.example.backend.entities.Movie;
import com.example.backend.entities.User;
import com.example.backend.repositories.UserRepository;
import com.example.backend.repositories.VerificationTokenRepository;
import com.example.backend.dtos.AddressDto;
import com.example.backend.dtos.CardDto;
import com.example.backend.dtos.MovieDto;
import com.example.backend.dtos.UserInfo;

import java.util.ArrayList;
import java.util.List;
import com.example.backend.repositories.FavoriteMovieRepo;
import com.example.backend.repositories.MoviesRepository;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final FavoriteMovieRepo favoriteRepository;
    private final MoviesRepository movieRepository;

    @Autowired
    public UserService(UserRepository userRepository, FavoriteMovieRepo favoriteRepository, MoviesRepository movieRepository) {
        this.userRepository = userRepository;
        this.favoriteRepository = favoriteRepository;
        this.movieRepository = movieRepository;
    }

    public UserInfo getUserInfo(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        User user = userOptional.get();

        AddressDto addressDto = null;
        if (user.getAddress() != null) {
            Address address = user.getAddress();
            addressDto = new AddressDto(
                address.getStreet(),
                address.getCity(),
                address.getState(),
                address.getZip()
            );
        }

        List<CardDto> cardDtos = new ArrayList<>();
        if (user.getCards() != null) {
            cardDtos = user.getCards().stream()
                .map(card -> new CardDto(
                    card.getLast4Digits(),
                    card.getBrand()
                ))
                .toList();
        }
        

        List<MovieDto> favoriteDtos = favoriteRepository.findByUser(user)
        .stream()
        .map(fav -> new MovieDto(
            fav.getMovie().getId(),
            fav.getMovie().getTitle(),
            fav.getMovie().getPosterUrl()
        ))
        .toList();

        return new UserInfo(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getPhone(),
                user.getStatus().name(),
                user.getRole().name(),
                addressDto,
                cardDtos,
                favoriteDtos
        );
    
    }

    public void addFavoriteMovie(String email, Long movieId) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Movie movie = movieRepository.findById(movieId)
            .orElseThrow(() -> new RuntimeException("Movie not found"));

        // Check if already a favorite
        boolean exists = favoriteRepository.findByUser(user).stream()
                .anyMatch(fav -> fav.getMovie().getId().equals(movieId));

        if (exists) {
            throw new RuntimeException("Movie is already in favorites");
        }

        if (!exists) {
            FavoriteMovie favorite = new FavoriteMovie();
            favorite.setUser(user);
            favorite.setMovie(movie);
            favoriteRepository.save(favorite);
        }
    }

    public void removeFavoriteMovie(String email, Long movieId) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Movie movie = movieRepository.findById(movieId)
            .orElseThrow(() -> new RuntimeException("Movie not found"));

        FavoriteMovie favorite = favoriteRepository.findByUser(user).stream()
                .filter(fav -> fav.getMovie().getId().equals(movieId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Favorite not found"));

        favoriteRepository.delete(favorite);
    }
}
