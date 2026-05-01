package com.example.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dtos.AuthDtos.AuthResponse;
import com.example.backend.dtos.AuthDtos.LoginRequest;
import com.example.backend.dtos.AuthDtos.RegisterRequest;
import com.example.backend.dtos.AuthDtos.ResetPasswordRequest;
import com.example.backend.dtos.AuthDtos.VerifyPassword;
import com.example.backend.dtos.AuthDtos.VerifyRequest;
import com.example.backend.repositories.UserRepository;
import com.example.backend.repositories.VerificationTokenRepository;
import com.example.backend.services.AuthService;

import jakarta.transaction.Transactional;

@CrossOrigin(origins = "*") // <- allows requests from any origin
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final VerificationTokenRepository tokenRepository;


    @Autowired
    public AuthController(AuthService authService, VerificationTokenRepository tokenRepository) {
        this.authService = authService;
        this.tokenRepository = tokenRepository;
    }

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(response.isSuccess() ? 200 : 400).body(response);
    }

    @PostMapping("/verify-registration")
    public ResponseEntity<AuthResponse> verifyRegistration(@RequestBody VerifyRequest request) {

        AuthResponse response = authService.verifyEmail(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        
        AuthResponse response = authService.login(request);
    
        if (!response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/password-reset-request")
    public ResponseEntity<AuthResponse> forgotPassword(@RequestBody ResetPasswordRequest request) {
        
        AuthResponse response = authService.forgotPassword(request.getEmail());
        return ResponseEntity.status(response.isSuccess() ? 200 : 400).body(response);
    }

    @PostMapping("/password-reset-verification")
    public ResponseEntity<AuthResponse> verifyPassword(@RequestBody VerifyPassword request) {
        
        AuthResponse response = authService.verifyPasswordResetCode(request.getEmail(), request.getCode(), request.getNewPassword());
        return ResponseEntity.status(response.isSuccess() ? 200 : 400).body(response);
    }

    @PostMapping("/resend-code")
    public ResponseEntity<AuthResponse> resendCode(@RequestBody VerifyRequest request) {
        AuthResponse response = authService.resendVerificationCode(request.getEmail());
        return ResponseEntity.status(response.isSuccess() ? 200 : 400).body(response);
    }

    @Transactional
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        
        AuthResponse response = authService.deleteUser(id);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response.getMessage());
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response.getMessage());
        }
    }

}