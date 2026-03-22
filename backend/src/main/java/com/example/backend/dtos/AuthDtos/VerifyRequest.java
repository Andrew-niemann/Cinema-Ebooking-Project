package com.example.backend.dtos.AuthDtos;

public class VerifyRequest {
    private String email;
    private String code;

    // getters + setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
