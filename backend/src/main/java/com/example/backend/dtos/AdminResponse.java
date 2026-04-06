package com.example.backend.dtos;

public class AdminResponse {

    private boolean success;
    private String message;
    private Long returnId;

    public AdminResponse(boolean success, String message, Long returnId) {
        this.success = success;
        this.message = message;
        this.returnId = returnId;
    }

    // getters
    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getReturnId() {
        return returnId;
    }

    public void setReturnId(Long returnId) {
        this.returnId = returnId;
    }



}
