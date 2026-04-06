package com.example.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import jakarta.transaction.Transactional;

import com.example.backend.services.ShowingsService;
import com.example.backend.dtos.AdminResponse;
import com.example.backend.dtos.CreateShowDto;
import com.example.backend.dtos.addMovieDto;
import com.example.backend.entities.Show;
import com.example.backend.dtos.ShowingsResponse;

@CrossOrigin(origins = "*") // <- allows requests from any origin
@RestController
@RequestMapping("/api/showings")
public class ShowingsController {

    private final ShowingsService showingsService;

    @Autowired
    public ShowingsController(ShowingsService showingsService) {
        this.showingsService = showingsService;
    }

    @GetMapping("/get-showings/{id}")
    public ResponseEntity<ShowingsResponse> getShowings(@PathVariable Long id) {
        
        ShowingsResponse response = showingsService.getShowings(id);
        return ResponseEntity.status(response.isSuccess() ? 200 : 400).body(response);
    }
}