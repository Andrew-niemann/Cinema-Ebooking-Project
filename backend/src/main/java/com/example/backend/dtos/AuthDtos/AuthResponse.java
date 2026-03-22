package com.example.backend.dtos.AuthDtos;

public class AuthResponse {
    private boolean success;
    private String message;
    private String token; 
    private String email; 
    private String role;

    public AuthResponse(boolean success, String message, String token, String email, String role) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.email = email;
        this.role = role;
    }

    // getters
    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public String getToken() {
        return token;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}
