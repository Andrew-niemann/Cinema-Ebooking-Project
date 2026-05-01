package com.example.backend.services;

import com.example.backend.entities.Movie;
import com.example.backend.repositories.MoviesRepository;
import com.example.backend.dtos.MovieDto;
import org.springframework.stereotype.Service;
import com.example.backend.entities.User;
import com.example.backend.repositories.UserRepository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

import org.springframework.security.core.Authentication;

import java.util.List;

@Service
public class RecommendationFacade {

    private final RecommendationService recommendationService;
    private final MoviesRepository movieRepository;
    private final UserRepository userRepository;
    private final AuthenticationService authenticationService;

    public RecommendationFacade(RecommendationService recommendationService,
                                MoviesRepository movieRepository,
                                UserRepository userRepository,
                                AuthenticationService authenticationService) {
        this.recommendationService = recommendationService;
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
        this.authenticationService = authenticationService;
    }

    public List<MovieDto> getRecommendedMovies(Authentication auth) {

        User user = authenticationService.getAuthenticatedUser(auth, userRepository);

        String aiResponse = recommendationService.recommendMovies(user.getId());

        List<String> titles = extractTitles(aiResponse);

        List<Movie> movies = movieRepository.findByTitleIn(titles);

        return movies.stream()
                .map(movie -> new MovieDto(
                        movie.getId(),
                        movie.getTitle(),
                        movie.getPosterUrl()
                ))
                .toList();
    }


    private List<String> extractTitles(String aiResponse) {
        try {
            ObjectMapper mapper = new ObjectMapper();

            // Gemini response is nested JSON → you may need to extract the text first
            String text = extractTextFromGeminiResponse(aiResponse);

            return mapper.readValue(text, List.class);

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse AI response", e);
        }
    }

    private String extractTextFromGeminiResponse(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            return root
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

        } catch (Exception e) {
            throw new RuntimeException("Invalid Gemini response", e);
        }
    }
        
}