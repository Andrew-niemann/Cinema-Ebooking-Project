package com.example.backend.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.dtos.BookingListDto;
import com.example.backend.dtos.BookingRequestDto;
import com.example.backend.dtos.BookingResponseDto;
import com.example.backend.dtos.SeatSelectionDto;
import com.example.backend.dtos.SeatSummaryDto;
import com.example.backend.dtos.ticketDto;
import com.example.backend.entities.Booking;
import com.example.backend.entities.Show;
import com.example.backend.entities.ShowSeat;
import com.example.backend.entities.Ticket;
import com.example.backend.entities.User;
import com.example.backend.enums.BookingStatus;
import com.example.backend.enums.TicketType;
import com.example.backend.factories.TicketFactory;
import com.example.backend.repositories.BookingRepository;
import com.example.backend.repositories.ShowRepository;
import com.example.backend.repositories.ShowSeatRepository;
import com.example.backend.repositories.UserRepository;
import com.example.backend.dtos.PaymentDto;


@Service
public class BookingService {

    private final ShowSeatRepository showSeatRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ShowRepository showRepository;
    private final EmailService emailService;

    public BookingService(ShowSeatRepository showSeatRepository,
                          BookingRepository bookingRepository, UserRepository userRepository, ShowRepository showRepository, EmailService emailService) {
        this.showSeatRepository = showSeatRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.showRepository = showRepository;
        this.emailService = emailService;
    }

    @Transactional
    public BookingResponseDto createBooking(BookingRequestDto request, Authentication authentication) {

        Show show = showRepository.findById(request.getShowId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Show not found"));

        User user = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found or not logged in"));

        // 🔹 Fetch all selected seats
        List<Long> seatIds = request.getSeats()
                .stream()
                .map(SeatSelectionDto::getShowSeatId)
                .toList();

        List<ShowSeat> showSeats = showSeatRepository.findByShowIdWithSeat(request.getShowId());

        // Filter only selected seats
        List<ShowSeat> selectedSeats = showSeats.stream()
                .filter(seat -> seatIds.contains(seat.getId()))
                .toList();

        for (ShowSeat seat : selectedSeats) {
            if (!seat.getShow().getId().equals(request.getShowId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                    "One or more seats do not belong to the selected showing");
            }
        }

        if (selectedSeats.size() != seatIds.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid seats selected");
        }

        //Validate seats
        for (ShowSeat seat : selectedSeats) {
            if (seat.isBooked()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Seat already taken");
            }
        }

        // 🔹 Create booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setStatus(BookingStatus.PENDING);
        booking.setShow(show);
        booking.setShowDate(show.getShowDate());
        booking.setShowTime(show.getStartTime());
        booking.setMovie(show.getMovie());

        double total = 0;

        List<SeatSummaryDto> seatSummaries = new ArrayList<>();

        // Create tickets
        for (SeatSelectionDto seatDto : request.getSeats()) {

            ShowSeat seat = selectedSeats.stream()
                    .filter(s -> s.getId().equals(seatDto.getShowSeatId()))
                    .findFirst()
                    .orElseThrow();

            TicketType ticketType = TicketType.valueOf(seatDto.getTicketType());

            //factory design pattern to decrease coupling 
            Ticket ticket = TicketFactory.createTicket(
                    ticketType,
                    booking,
                    seat
            );

            total += ticket.getPrice();

            booking.addTicket(ticket);

            // Lock seat
            seat.setBooked(true);
            showSeatRepository.save(seat);

            // Build response DTO
            seatSummaries.add(new SeatSummaryDto(
                    seat.getSeat().getRow() + seat.getSeat().getSeatNumber(),
                    ticketType.name(),
                    ticket.getPrice()
            ));
        }

        // 🔹 Set booking totals
        booking.setTotalPrice(total);
        booking.setTaxes(0); // calculate later if needed
        booking.setBookingFee(0);
        booking.setDiscountApplied(0);

        bookingRepository.save(booking);

        // 🔹 Build response
        return new BookingResponseDto(
                true,
                "Booking created",
                authentication.getName(),
                booking.getShow().getMovie().getTitle(),
                selectedSeats.get(0).getShow().getShowDate().toString(),
                selectedSeats.get(0).getShow().getStartTime().toString(),
                seatSummaries,
                seatSummaries.size(),
                total,
                booking.getId()
        );
    }

    @Transactional
    public BookingResponseDto deleteBooking(Long id, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found or not logged in"));

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        boolean isAdmin = authentication.getAuthorities().stream()
                                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!booking.getUser().getId().equals(user.getId()) && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You must be the owner of the booking or an admin to delete a booking");
        }

        // Free up seats
        for (Ticket ticket : booking.getTickets()) {
            ShowSeat seat = ticket.getShowSeat();
            seat.setBooked(false);
            showSeatRepository.save(seat);
        }

        bookingRepository.delete(booking);

        return new BookingResponseDto(
                true,
                "Booking deleted",
                authentication.getName(),
                null,
                null,
                null,
                null,
                0,
                0,
                booking.getId()
        );
    }

    public List<BookingListDto> getBookingsForUser(Authentication authentication) {

    User user = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    List<Booking> bookings = bookingRepository.findByUser(user);

    return bookings.stream()
            .map(booking -> {

                // 🔹 Map tickets → ticketDto list
                List<ticketDto> ticketDtos = booking.getTickets().stream()
                        .map(ticket -> new ticketDto(
                                ticket.getShowSeat().getSeat().getRow() 
                                    + String.valueOf(ticket.getShowSeat().getSeat().getSeatNumber()),
                                ticket.getTicketType().name(),
                                ticket.getPrice()
                        ))
                        .toList();

                return new BookingListDto(
                        booking.getId(),
                        booking.getShow().getMovie().getTitle(),
                        booking.getShow().getShowDate().toString(),
                        booking.getShow().getStartTime().toString(),
                        ticketDtos.size(),
                        booking.getTotalPrice(),
                        booking.getStatus().name(),
                        ticketDtos
                );
            })
            .toList();
        }

    public BookingResponseDto confirmBooking(PaymentDto request, Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Booking booking = bookingRepository.findById(request.getBookingId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only confirm your own bookings");
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        String message = String.format(
            "Dear %s,\n\nYour booking for '%s' on %s at %s has been confirmed.\n\nThank you for choosing our cinema!",
            user.getName(),
            booking.getShow().getMovie().getTitle(),
            booking.getShow().getShowDate(),
            booking.getShow().getStartTime()
        );
        emailService.sendEmail(user.getEmail(), "booking confirmation", message);

        return new BookingResponseDto(
                true,
                "Booking confirmed",
                authentication.getName(),
                booking.getShow().getMovie().getTitle(),
                booking.getShow().getShowDate().toString(),
                booking.getShow().getStartTime().toString(),
                null,
                0,
                0,
                booking.getId()
        );

    }
}
