"use client";

import { useState, useEffect } from "react";

const TICKET_CONFIG = {
    adult: { price: 9, color: "bg-green-400 hover:bg-green-500", label: "Adult ($9)" },
    child: { price: 7, color: "bg-blue-400 hover:bg-blue-500", label: "Child ($7)" },
    senior: { price: 5, color: "bg-purple-400 hover:bg-purple-500", label: "Senior ($5)" }
};

// 5 minutes
const RESERVATION_DURATION_MS = 1000 * 60 * 5;

type TicketType = keyof typeof TICKET_CONFIG;

type ShowSeat = {
    id: number;
    seatIdentifier: string;
    isBooked?: boolean;
    booked?: boolean;
};

type BookingResponse = {
    success?: boolean;
    message?: string;
    bookingId?: number;
    id?: number;
};

export default function Seats({
    showingId,
    movieId,
    date,
    time
}: {
    showingId?: number;
    movieId?: number;
    date?: string;
    time?: string;
}) {
    const [activeTicketType, setActiveTicketType] = useState<TicketType>("adult");
    const [selectedSeats, setSelectedSeats] = useState<Record<string, TicketType>>({});
    const [showSeats, setShowSeats] = useState<ShowSeat[]>([]);
    const [showLoginMessage, setShowLoginMessage] = useState(false);
    const [checkoutError, setCheckoutError] = useState("");
    const [isReserving, setIsReserving] = useState(false);

    useEffect(() => {
        if (!showingId) return;

        const fetchSeats = () => {
            fetch(`http://localhost:8080/api/showSeats/get-showSeats/${showingId}?t=${Date.now()}`)
                .then(res => (res.ok ? res.json() : null))
                .then(data => {
                    const list: ShowSeat[] = data?.showSeats || [];
                    setShowSeats(Array.isArray(list) ? list : []);

                    setSelectedSeats(prev => {
                        const updated = { ...prev };
                        list.forEach(seat => {
                            const isBooked = seat.booked ?? seat.isBooked;
                            if (isBooked && updated[seat.seatIdentifier]) {
                                delete updated[seat.seatIdentifier];
                            }
                        });
                        return updated;
                    });
                })
                .catch(() => setShowSeats([]));
        };

        // initial fetch
        fetchSeats();
        
        // fetch seats every 5 seconds
        const interval = setInterval(fetchSeats, 5000);
        return () => clearInterval(interval);
    }, [showingId]);

    const handleSeatClick = (seat: string) => {
        setCheckoutError("");

        const seatData = showSeats.find(s => s.seatIdentifier === seat);
        const isBooked = seatData?.booked ?? seatData?.isBooked;
        if (isBooked || isReserving) return;

        const newSeats = { ...selectedSeats };

        if (newSeats[seat] === activeTicketType) {
            delete newSeats[seat];
        } else {
            newSeats[seat] = activeTicketType;
        }

        setSelectedSeats(newSeats);
    };

    const handleCheckout = async () => {
        if (!showingId || isReserving) return;

        setCheckoutError("");

        if (Object.keys(selectedSeats).length === 0) return;

        const token = localStorage.getItem("token");
        if (!token) {
            localStorage.setItem(
                "checkoutData",
                JSON.stringify({
                    movieId,
                    showingId,
                    selectedSeats,
                    date,
                    time
                })
            );
            setShowLoginMessage(true);
            localStorage.setItem("loginForCheckout", "true");
            window.dispatchEvent(new CustomEvent("openLoginDropdown"));
            return;
        }

        setIsReserving(true);

        try {
            const seats = Object.entries(selectedSeats).map(([seatId, type]) => {
                const seat = showSeats.find(s => s.seatIdentifier === seatId);
                if (!seat) {
                    throw new Error(`Seat ${seatId} is no longer available.`);
                }

                return {
                    showSeatId: seat.id,
                    ticketType: type.toUpperCase()
                };
            });

            const response = await fetch("http://localhost:8080/api/bookings/create-booking", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    showId: showingId,
                    seats
                })
            });

            const data: BookingResponse = await response.json().catch(() => ({}));

            if (!response.ok || data.success === false) {
                throw new Error(data.message || "Unable to reserve those seats. Please choose again.");
            }

            const bookingId = data.bookingId ?? data.id;

            localStorage.setItem(
                "checkoutData",
                JSON.stringify({
                    movieId,
                    showingId,
                    selectedSeats,
                    bookingId,
                    reservationExpiresAt: Date.now() + RESERVATION_DURATION_MS,
                    date,
                    time
                })
            );

            window.location.assign("/order-summary");
        } catch (error: unknown) {
            setCheckoutError(error instanceof Error ? error.message : "Unable to reserve those seats. Please try again.");
        } finally {
            setIsReserving(false);
        }
    };

    let totalPrice = 0;
    Object.values(selectedSeats).forEach(type => {
        totalPrice += TICKET_CONFIG[type].price;
    });

    return (
        <div className="flex flex-col items-center gap-8 text-[#ECDFCC]">
            {/* Ticket selector */}
            <div className="flex gap-4">
                {(Object.keys(TICKET_CONFIG) as TicketType[]).map(type => (
                    <button
                        key={type}
                        onClick={() => setActiveTicketType(type)}
                        className={`px-4 py-2 rounded font-bold ${
                            activeTicketType === type
                                ? "bg-white text-black"
                                : "bg-[#697565] text-white"
                        }`}
                    >
                        {TICKET_CONFIG[type].label}
                    </button>
                ))}
            </div>

            {/* Seat grid */}
            <div className="grid grid-cols-8 gap-2">
                {showSeats.map(seat => {
                    const isBooked = seat.booked ?? seat.isBooked;
                    const id = seat.seatIdentifier;
                    const selectedType = selectedSeats[id];

                    if (isBooked) {
                        return (
                            <button key={seat.id} disabled className="w-10 h-10 bg-black text-white rounded">
                                {id}
                            </button>
                        );
                    }

                    const color = selectedType
                        ? TICKET_CONFIG[selectedType].color
                        : "bg-gray-500 hover:bg-gray-400";

                    return (
                        <button
                            key={seat.id}
                            onClick={() => handleSeatClick(id)}
                            className={`w-10 h-10 rounded font-semibold ${color}`}
                        >
                            {id}
                        </button>
                    );
                })}
            </div>

            {/* Checkout */}
            <div className="bg-[#697565] p-6 rounded-lg w-full max-w-sm text-center">
                <h2 className="text-2xl font-bold">Total: ${totalPrice}</h2>

                <p className="text-gray-300">
                    {Object.keys(selectedSeats).length} seats
                </p>

                {showLoginMessage && (
                    <p className="text-red-400 mt-2 text-sm">
                        You must log in to proceed to checkout.
                    </p>
                )}

                {checkoutError && (
                    <p className="text-red-400 mt-2 text-sm">
                        {checkoutError}
                    </p>
                )}

                <button
                    onClick={handleCheckout}
                    disabled={isReserving}
                    className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed py-3 rounded"
                >
                    {isReserving ? "Reserving Seats..." : "Proceed to Checkout"}
                </button>
            </div>
        </div>
    );
}
