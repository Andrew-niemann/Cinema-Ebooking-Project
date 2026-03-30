package com.example.backend.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.example.backend.enums.BookingStatus;

@Entity
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String bookingNumber;

    private LocalDateTime bookingTime;

    // Prices
    private double totalPrice;
    private double taxes;
    private double bookingFee;
    private double discountApplied;

    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    // Booking status: active, cancelled, refunded
    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.ACTIVE;

    // Many bookings belong to one user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // One booking has many tickets
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Ticket> tickets = new ArrayList<>();

    // Payment info
    @ManyToOne
    @JoinColumn(name = "payment_card_id")
    private PaymentCard paymentCard;

    // Optional promotion applied
    @ManyToOne
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;

    // Constructors
    public Booking() {}

    public Booking(User user, PaymentCard paymentCard) {
        this.user = user;
        this.paymentCard = paymentCard;
    }

    // Automatically generate booking number before persist
    @PrePersist
    public void prePersist() {
        if (bookingNumber == null || bookingNumber.isEmpty()) {
            bookingNumber = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
        if (bookingTime == null) {
            bookingTime = LocalDateTime.now();
        }
    }

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public String getBookingNumber() { return bookingNumber; }
    public LocalDateTime getBookingTime() { return bookingTime; }
    public double getTotalPrice() { return totalPrice; }
    public double getTaxes() { return taxes; }
    public double getBookingFee() { return bookingFee; }
    public double getDiscountApplied() { return discountApplied; }
    public BookingStatus getStatus() { return status; }
    public User getUser() { return user; }
    public List<Ticket> getTickets() { return tickets; }
    public PaymentCard getPaymentCard() { return paymentCard; }
    public Promotion getPromotion() { return promotion; }

    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
    public void setTaxes(double taxes) { this.taxes = taxes; }
    public void setBookingFee(double bookingFee) { this.bookingFee = bookingFee; }
    public void setDiscountApplied(double discountApplied) { this.discountApplied = discountApplied; }
    public void setStatus(BookingStatus status) { this.status = status; }
    public void setUser(User user) { this.user = user; }
    public void setTickets(List<Ticket> tickets) { this.tickets = tickets; }
    public void setPaymentCard(PaymentCard paymentCard) { this.paymentCard = paymentCard; }
    public void setPromotion(Promotion promotion) { this.promotion = promotion; }

    // Add a ticket conveniently
    public void addTicket(Ticket ticket) {
        tickets.add(ticket);
        ticket.setBooking(this);
    }

    public void removeTicket(Ticket ticket) {
        tickets.remove(ticket);
        ticket.setBooking(null);
    }
}