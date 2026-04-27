package com.example.backend.services;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;


@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final WebClient webClient;

    public GeminiService(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("https://generativelanguage.googleapis.com").build();
    }

    public String getRecommendations(String prompt) {

        try {
            String url = "/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" + apiKey;

            Map<String, Object> body = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", prompt)
                    ))
                )
            );

            return webClient.post()
                    .uri(url)
                    .header("Content-Type", "application/json")
                    .bodyValue(body)
                    .retrieve()
                    .onStatus(status -> status.isError(), response ->
                        response.bodyToMono(String.class)
                        .map(errorBody -> new RuntimeException("Gemini error: " + errorBody))
                    )
                    .bodyToMono(String.class)
                    .block();
        } catch (Exception e) {
                return "{\"error\": \"Failed to get recommendations\", \"details\": \"" 
                + e.getMessage().replace("\"", "'") + "\"}";
        }
    }
}