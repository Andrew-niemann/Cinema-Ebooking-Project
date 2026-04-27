package com.example.backend.factories;

import com.example.backend.entities.Booking;
import com.example.backend.entities.ShowSeat;
import com.example.backend.entities.Ticket;
import com.example.backend.enums.TicketType;

public class TicketFactory {

    public static Ticket createTicket(
            TicketType type,
            Booking booking,
            ShowSeat seat
    ) {

        double price = switch (type) {
            case ADULT -> 9.0;
            case SENIOR -> 5.0;
            case CHILD -> 7.0;
        };

        return new Ticket(booking, seat, price, type);
    }
}