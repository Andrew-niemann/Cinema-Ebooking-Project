"use client";

import { useState, useEffect } from "react";

const TICKET_CONFIG = {
    adult: { price: 9, color: "bg-green-400 hover:bg-green-500", label: "Adult ($9)" },
    child: { price: 7, color: "bg-blue-400 hover:bg-blue-500", label: "Child ($7)" },
    senior: { price: 5, color: "bg-purple-400 hover:bg-purple-500", label: "Senior ($5)" }
};

type TicketType = keyof typeof TICKET_CONFIG;

type ShowSeat = {
    id: number;
    seatIdentifier: string;
    isBooked?: boolean;
    booked?: boolean;
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

    useEffect(() => {
        if (!showingId) return;

        const fetchSeats = () => {
            fetch(`http://localhost:8080/api/showSeats/get-showSeats/${showingId}?t=${Date.now()}`)
                .then(res => (res.ok ? res.json() : null))
                .then(data => {
                    const list: ShowSeat[] = data?.showSeats || [];

                    // update seat list
                    setShowSeats(Array.isArray(list) ? list : []);

                    // remove seats that became booked
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
        const seatData = showSeats.find(s => s.seatIdentifier === seat);
        const isBooked = seatData?.booked ?? seatData?.isBooked;

        if (isBooked) return;

        const newSeats = { ...selectedSeats };

        if (newSeats[seat] === activeTicketType) {
            delete newSeats[seat];
        } else {
            newSeats[seat] = activeTicketType;
        }

        setSelectedSeats(newSeats);
    };

    const handleCheckout = () => {
        if (Object.keys(selectedSeats).length === 0) {
            alert("Please select at least one seat.");
            return;
        }

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

        const token = localStorage.getItem("token");
        if (!token) {
            setShowLoginMessage(true);
            localStorage.setItem('loginForCheckout', 'true');
            window.dispatchEvent(new CustomEvent('openLoginDropdown'));
            return;
        }

        window.location.href = "/order-summary";
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
                            <button
                                key={seat.id}
                                disabled
                                className="w-10 h-10 bg-black text-white rounded cursor-not-allowed"
                            >
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
                <h2 className="text-2xl font-bold">
                    Total: ${totalPrice}
                </h2>

                <p className="text-gray-300">
                    {Object.keys(selectedSeats).length} seats
                </p>

                {showLoginMessage && (
                    <p className="text-red-400 mt-2 text-sm">
                        You must log in to proceed to checkout.
                    </p>
                )}

                <button
                    onClick={handleCheckout}
                    className="mt-4 w-full bg-green-600 hover:bg-green-700 py-3 rounded"
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
}