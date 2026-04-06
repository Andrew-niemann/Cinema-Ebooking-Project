package com.example.backend.dtos.userDtos;

import java.util.ArrayList;

import com.example.backend.entities.FavoriteMovie;
import com.example.backend.entities.PaymentCard;
import com.example.backend.enums.UserStatus;
import java.util.List;
import com.example.backend.enums.Role;
import com.example.backend.entities.Address;
import com.example.backend.dtos.AddressDto;
import com.example.backend.dtos.CardDto;
import com.example.backend.dtos.MovieDto;

public class UserInfo {
    private long id;
    private String email;
    private String name;
    private String phone;
    private String status;
    private String role;
    private AddressDto address;
    private List<CardDto> cards = new ArrayList<>();
    private List<MovieDto> favorites = new ArrayList<>();

    public UserInfo(long id, String email, String name, String phone,
                    String status, String role,
                    AddressDto address,
                    List<CardDto> cards,
                    List<MovieDto> favorites) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.phone = phone;
        this.status = status;
        this.role = role;
        this.address = address;
        this.cards = cards;
        this.favorites = favorites;
    }

    public long getId() { return id; }
    public String getEmail() { return email; }
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public String getStatus() { return status; }
    public String getRole() { return role; }
    public AddressDto getAddress() { return address; }
    public List<CardDto> getCards() { return cards; }
    public List<MovieDto> getFavorites() { return favorites; }
}