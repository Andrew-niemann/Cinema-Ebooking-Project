package com.example.backend.dtos.AuthDtos;

import com.example.backend.dtos.AddressDto;
import com.example.backend.dtos.CardDto;

public class RegisterRequest {

    private String email;
    private String password;
    private String name;
    private String phone;
    private AddressDto address;
    private CardDto card;
    private Boolean promotionOptIn;

    // getters and setters

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public AddressDto getAddress() { return address; }
    public void setAddress(AddressDto address) { this.address = address; }

    public CardDto getCard() { return card; }
    public void setCard(CardDto card) { this.card = card; }

    public Boolean getPromotionOptIn() { return promotionOptIn; }
    public void setPromotionOptIn(Boolean promotionOptIn) { this.promotionOptIn =  promotionOptIn; }
    public Boolean isPromotionOptIn() { return promotionOptIn; }
}