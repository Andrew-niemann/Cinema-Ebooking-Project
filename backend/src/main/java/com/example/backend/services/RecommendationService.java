package com.example.backend.services;

import java.util.List;
import org.springframework.stereotype.Service;

import com.example.backend.entities.Movie;
import com.example.backend.repositories.BookingRepository;
import com.example.backend.repositories.MoviesRepository;
import com.example.backend.repositories.FavoriteMovieRepo;
import com.example.backend.entities.FavoriteMovie;

@Service
public class RecommendationService {

    private final BookingRepository bookingRepository;
    private final MoviesRepository moviesRepository;
    private final GeminiService geminiService;
    private final FavoriteMovieRepo favoriteMovieRepo;

    public RecommendationService(BookingRepository bookingRepository,
                                 MoviesRepository moviesRepository,
                                 GeminiService geminiService,
                                 FavoriteMovieRepo favoriteMovieRepo) {
        this.bookingRepository = bookingRepository;
        this.moviesRepository = moviesRepository;
        this.geminiService = geminiService;
        this.favoriteMovieRepo = favoriteMovieRepo;
    }

    public String recommendMovies(Long userId) {

        List<String> userMovies = bookingRepository.findMovieTitlesByUserId(userId);
        List<String> allMovies = moviesRepository.findAll()
                                            .stream()
                                            .map(Movie::getTitle)
                                            .toList();
        List<String> favoriteMovies = favoriteMovieRepo.findByUser_Id(userId)
                                                        .stream()
                                                        .map(fav -> fav.getMovie().getTitle())
                                                        .toList();

        String prompt = buildPrompt(userMovies, favoriteMovies, allMovies);


        return geminiService.getRecommendations(prompt);
        
        //System.out.println("PROMPT SENT TO GEMINI:");
        //System.out.println(prompt);
    }

    private String buildPrompt(List<String> userMovies,
                           List<String> favoriteMovies,
                           List<String> allMovies) {

        return """
        You are a movie recommendation system.

        Your task:
        Recommend movies the user is most likely to enjoy.

        IMPORTANT RULES:
        - Only choose from the "Available Movies" list
        - Do NOT invent or hallucinate movie titles
        - Do NOT add explanations
        - Return ONLY a valid JSON array of strings
        - No numbering, no extra text, no commentary
        - Return exactly 5 recommendations

        USER WATCH HISTORY:
        %s

        USER FAVORITE MOVIES (strong preference signal):
        %s

        AVAILABLE MOVIES (choose ONLY from this list):
        %s

        OUTPUT FORMAT:
        ["Movie A", "Movie B", "Movie C", "Movie D", "Movie E"]

        Now generate recommendations.
        """.formatted(
            formatList(userMovies),
            formatList(favoriteMovies),
            formatList(allMovies)
        );
    }

    private String formatList(List<String> items) {
        if (items == null || items.isEmpty()) return "None";

        StringBuilder sb = new StringBuilder();
        for (String item : items) {
            sb.append("- ").append(item).append("\n");
        }
        return sb.toString();
    }
}