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

import com.example.backend.services.AdminService;
import com.example.backend.dtos.AdminResponse;
import com.example.backend.dtos.CreateShowDto;
import com.example.backend.dtos.addMovieDto;
import com.example.backend.entities.Show;

@CrossOrigin(origins = "*") // <- allows requests from any origin
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/add-movie")
    public ResponseEntity<AdminResponse> addMovie(@RequestBody addMovieDto request,  Authentication authentication) {
        
        // Check if the user has ROLE_ADMIN
         boolean isAdmin = authentication.getAuthorities().stream()
                                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can perform this action");
        }

        AdminResponse response = adminService.addMovie(request);
        return ResponseEntity.status(response.isSuccess() ? 200 : 400).body(response);
    }

    @Transactional
    @DeleteMapping("/delete-movie/{id}")
    public ResponseEntity<AdminResponse> removeMovie(@PathVariable Long id, Authentication authentication) {
        
        // Check if the user has ROLE_ADMIN
         boolean isAdmin = authentication.getAuthorities().stream()
                                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can perform this action");
        }

        AdminResponse response = adminService.removeMovie(id);
        return ResponseEntity.status(response.isSuccess() ? 200 : 400).body(response);
    }

    @PostMapping("/create-showing")
    public ResponseEntity<AdminResponse> createShowing(@RequestBody CreateShowDto dto, Authentication authentication) {

        // Check if the user has ROLE_ADMIN
         boolean isAdmin = authentication.getAuthorities().stream()
                                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can perform this action");
        }
        
        AdminResponse response = adminService.createShow(dto);
        return ResponseEntity.status(response.isSuccess() ? 200 : 400).body(response);
    }
    

    @DeleteMapping("/delete-showing/{id}")
    public ResponseEntity<AdminResponse> deleteShowing(@PathVariable Long id, Authentication authentication) {

        // Check if the user has ROLE_ADMIN
         boolean isAdmin = authentication.getAuthorities().stream()
                                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can perform this action");
        }
        
        AdminResponse response = adminService.deleteShowing(id);
        return ResponseEntity.status(response.isSuccess() ? 200 : 400).body(response);
    }

}
