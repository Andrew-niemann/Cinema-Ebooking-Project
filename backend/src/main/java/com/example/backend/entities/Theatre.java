package com.example.backend.entities;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Theatre {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String location;

    @OneToMany(mappedBy = "theatre", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Showroom> showrooms;

    // Constructors, getters, setters
    public Theatre() {}
    public Theatre(String name, String location) {
        this.name = name;
        this.location = location;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getLocation() { return location; }
    public List<Showroom> getShowrooms() { return showrooms; }
    public void setShowrooms(List<Showroom> showrooms) { this.showrooms = showrooms; }
}