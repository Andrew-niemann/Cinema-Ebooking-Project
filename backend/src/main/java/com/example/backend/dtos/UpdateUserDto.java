package com.example.backend.dtos;

public class UpdateUserDto {
    private String name;
    private String phone;
    private AddressDto address;
    private CardDto newCard; // optional

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

    public CardDto getNewCard() {
        return newCard;
    }

    public void setNewCard(CardDto newCard) {
        this.newCard = newCard;
    }
    
}