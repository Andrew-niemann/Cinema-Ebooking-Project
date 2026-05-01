package com.example.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.backend.dtos.ShowSeatResponse;
import com.example.backend.services.ShowSeatService;

@CrossOrigin(origins = "*") // <- allows requests from any origin
@RestController
@RequestMapping("/api/showSeats")
public class ShowSeatController {

    private final ShowSeatService showSeatService;

    @Autowired
    public ShowSeatController(ShowSeatService showSeatService) {
        this.showSeatService = showSeatService;
    }

    @GetMapping("/get-showSeats/{id}")
    public ResponseEntity<ShowSeatResponse> getShowSeats(@PathVariable Long id) {
        
        ShowSeatResponse response = showSeatService.getShowings(id);
        return ResponseEntity.status(response.isSuccess() ? 200 : 400).body(response);
    }
}