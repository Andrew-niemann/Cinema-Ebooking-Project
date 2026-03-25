package com.example.backend.dtos;

public class UpdateUserDto {
    private String name;
    private String phone;
    private String newPassword;
    private String oldPassword;
    private AddressDto address;
    private CardDto card; // optional

    // getters/setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public AddressDto getAddress() {
        return address;
    }

    public void setAddress(AddressDto address) {
        this.address = address;
    }

    public CardDto getCard() {
        return card;
    }

    public void setCard(CardDto card) {
        this.card = card;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    
    
}