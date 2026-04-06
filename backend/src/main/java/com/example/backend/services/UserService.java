package com.example.backend.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.dtos.AddressDto;
import com.example.backend.dtos.CardDto;
import com.example.backend.dtos.MovieDto;
import com.example.backend.dtos.userDtos.UpdateUserDto;
import com.example.backend.dtos.userDtos.UserInfo;
import com.example.backend.entities.Address;
import com.example.backend.entities.FavoriteMovie;
import com.example.backend.entities.Movie;
import com.example.backend.entities.PaymentCard;
import com.example.backend.entities.User;
import com.example.backend.repositories.FavoriteMovieRepo;
import com.example.backend.repositories.MoviesRepository;
import com.example.backend.repositories.UserRepository;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final FavoriteMovieRepo favoriteRepository;
    private final MoviesRepository movieRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;


    @Autowired
    public UserService(UserRepository userRepository, FavoriteMovieRepo favoriteRepository, MoviesRepository movieRepository, EmailService emailService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.favoriteRepository = favoriteRepository;
        this.movieRepository = movieRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
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
                .map(c -> {
                    CardDto cardDto = new CardDto(
                        c.getDigits(),
                        c.getExpirationYear(),
                        c.getExpirationMonth(),
                        c.getCvv()
                    );
                    cardDto.setId(c.getId()); // include the ID
                    return cardDto;
                })
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

    public UserInfo updateUserProfile(String email, UpdateUserDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // --- Update basic info ---
        if (dto.getName() != null && !dto.getName().isBlank()) {
            user.setName(dto.getName());
        }

        if (dto.getPhone() != null && !dto.getPhone().isBlank()) {
            user.setPhone(dto.getPhone());
        }

        if(dto.isPromotionOptIn() != null) {
            user.setPromotionOptIn(dto.isPromotionOptIn());
        }

        if (dto.getNewPassword() != null && !dto.getNewPassword().isEmpty()) {
            if (dto.getOldPassword() == null || !passwordEncoder.matches(dto.getOldPassword(), user.getPasswordHash())) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect old password");
            }
            user.setPasswordHash(passwordEncoder.encode(dto.getNewPassword()));
        }

        // --- Address (ONLY ONE) ---
        if (dto.getAddress() != null) {

            AddressDto addrDto = dto.getAddress();

            boolean noChange = false;
            if (user.getAddress().getStreet().equals(addrDto.getStreet()) && user.getAddress().getCity().equals(addrDto.getCity()) && user.getAddress().getState().equals(addrDto.getState()) && user.getAddress().getZip().equals(addrDto.getZip())) {
                noChange = true;
            }

            if (!noChange) {
                Address address = user.getAddress();
                if (address == null) {
                    address = new Address();
                }

                if (addrDto.getStreet() != null)
                    address.setStreet(addrDto.getStreet());

                if (addrDto.getCity() != null)
                    address.setCity(addrDto.getCity());

                if (addrDto.getState() != null)
                    address.setState(addrDto.getState());

                if (addrDto.getZip() != null)
                    address.setZip(addrDto.getZip());

                user.setAddress(address); // replaces existing (only one allowed)
            }       
        }

        // --- Cards (MAX 3) ---
        if (dto.getCard() != null) {
            CardDto cardDto = dto.getCard();
            PaymentCard card;

            if (cardDto.getId() != null) {
                // Try to update existing card
                card = user.getCards().stream()
                        .filter(c -> c.getId().equals(cardDto.getId()))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Card not found"));
            } else {
                // Creating new card
                if (user.getCards().size() >= 3) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot have more than 3 cards");
                }
                card = new PaymentCard();
                card.setUser(user); // important for relationship
                user.getCards().add(card);
            }

            // Set/Update fields
            card.setDigits(cardDto.getDigits());
            card.setExpirationYear(cardDto.getExpirationYear());
            card.setExpirationMonth(cardDto.getExpirationMonth());
            card.setCvv(cardDto.getCvv());

        }

        userRepository.save(user);

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
                .map(c -> {
                    CardDto cardDto = new CardDto(
                        c.getDigits(),
                        c.getExpirationYear(),
                        c.getExpirationMonth(),
                        c.getCvv()
                    );
                    cardDto.setId(c.getId()); // include the ID
                    return cardDto;
                })
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

        String message = "Your profile information has been updated:\n";
        emailService.sendVerificationEmail(user.getEmail(), "update info", message);

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
}