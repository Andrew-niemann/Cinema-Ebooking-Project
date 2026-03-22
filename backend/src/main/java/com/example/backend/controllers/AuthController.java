package com.example.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.services.AuthService;
import com.example.backend.dtos.AuthDtos.AuthResponse;
import com.example.backend.dtos.AuthDtos.LoginRequest;
import com.example.backend.dtos.AuthDtos.RegisterRequest;
import com.example.backend.dtos.AuthDtos.ResetPasswordRequest;
import com.example.backend.dtos.AuthDtos.VerifyPassword;
import com.example.backend.dtos.AuthDtos.VerifyRequest;
import com.example.backend.entities.User;
import com.example.backend.services.JwtService;
import com.mysql.cj.x.protobuf.MysqlxSession.Reset;
import com.example.backend.repositories.UserRepository;

@CrossOrigin(origins = "*") // <- allows requests from any origin
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
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

        String email = request.getEmail();
        String code = request.getCode();

        AuthResponse response = authService.verifyEmail(email, code);

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

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.status(404).body("User not found");
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully");
    }

}

