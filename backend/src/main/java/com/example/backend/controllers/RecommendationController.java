package com.example.backend.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.backend.services.RecommendationFacade;

import jakarta.annotation.Generated;

import com.example.backend.dtos.MovieDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;


@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "*")
public class RecommendationController {

    private final RecommendationFacade recommendationFacade;

    public RecommendationController(RecommendationFacade recommendationFacade) {
        this.recommendationFacade = recommendationFacade;
    }

    @GetMapping("/my-recommendations")
    public ResponseEntity<List<MovieDto>> getRecommendations(Authentication authentication) {
        List<MovieDto> recommendations = recommendationFacade.getRecommendedMovies(authentication);
        return ResponseEntity.ok(recommendations);
    }
}
