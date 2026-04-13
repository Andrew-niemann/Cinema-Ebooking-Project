"use client";

import { useEffect, useState } from "react";

type CheckoutData = {
    movieId?: number;
    showingId?: number;
    selectedSeats: Record<string, string>;
    date?: string;
    time?: string;
};

type Card = {
    id: number;
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
};

type Movie = {
    id: number;
    title: string;
    genre: string;
    status: string;
};

type ShowSeat = {
    id: number;
    seatIdentifier: string;
    isBooked?: boolean;
    booked?: boolean;
};

const TICKET_PRICES: Record<string, number> = {
    ADULT: 9,
    CHILD: 7,
    SENIOR: 5
};

export default function CheckoutPage() {
    const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
    const [movie, setMovie] = useState<Movie | null>(null);
    const [showSeats, setShowSeats] = useState<ShowSeat[]>([]);
    const [cards, setCards] = useState<Card[]>([]);
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

    useEffect(() => {
        const data = localStorage.getItem("checkoutData");
        if (!data) return;

        const parsed = JSON.parse(data);
        setCheckoutData(parsed);

        // Fetch movie info
        fetch(`http://localhost:8080/api/movies`)
            .then(res => res.json())
            .then(list => {
                const found = list.find((m: Movie) => m.id === parsed.movieId);
                setMovie(found || null);
            });

        // Fetch seats
        fetch(`http://localhost:8080/api/showSeats/get-showSeats/${parsed.showingId}`)
            .then(res => (res.ok ? res.json() : null))
            .then(data => {
                const list = data?.showSeats || [];
                setShowSeats(Array.isArray(list) ? list : []);
            })
            .catch(() => setShowSeats([]));

        // Fetch user's cards
        const token = localStorage.getItem("token");
        if (token) {
            fetch("http://localhost:8080/api/user/info", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(data => {
                if (data && data.cards && Array.isArray(data.cards)) {
                    const processedCards = data.cards.map((card: any) => {
                        const digits = card.digits || '';
                        const last4 = digits.slice(-4);
                        const brand = digits.startsWith('4') ? 'Visa' : digits.startsWith('5') ? 'MasterCard' : 'Unknown';
                        return {
                            id: card.id,
                            last4,
                            brand,
                            expiryMonth: parseInt(card.expirationMonth),
                            expiryYear: parseInt(card.expirationYear)
                        };
                    });
                    setCards(processedCards);
                    if (processedCards.length > 0) setSelectedCardId(processedCards[0].id);
                }
            })
            .catch(console.error);
        }
    }, []);

    const handleConfirmBooking = () => {
        if (!checkoutData) return;

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please log in to complete booking");
            return;
        }

        if (!selectedCardId) {
            alert("Please select a payment method");
            return;
        }

        const seats = Object.entries(checkoutData.selectedSeats)
            .map(([seatId, type]) => {
                const seat = showSeats.find(s => s.seatIdentifier === seatId);
                if (!seat) return null;

                return {
                    showSeatId: seat.id,
                    ticketType: type.toUpperCase()
                };
            })
            .filter(Boolean);

        fetch("http://localhost:8080/api/bookings/create-booking", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                showId: checkoutData.showingId,
                seats
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("Booking confirmed!");
                    localStorage.removeItem("checkoutData");
                    window.location.href = "/";
                } else {
                    alert(data.message || "Booking failed");
                }
            });
    };

    if (!checkoutData || !movie) {
        return (
            <div className="text-white p-8">
                No checkout data available.
            </div>
        );
    }

    // Price calculation
    let subtotal = 0;

    const seatItems = Object.entries(checkoutData.selectedSeats).map(
        ([seat, type]) => {
            const price = TICKET_PRICES[type.toUpperCase()] || 0;
            subtotal += price;

            return { seat, type, price };
        }
    );

    const bookingFee = 2.5;
    const total = subtotal + bookingFee;

    return (
        <main className="min-h-screen bg-[#1E201E] text-[#ECDFCC] flex flex-col items-center p-8">

            {/* Header */}
            <h1 className="text-4xl font-bold mb-6">Checkout Summary</h1>

            <div className="bg-[#3C3D37] p-8 rounded-xl shadow-lg w-full max-w-2xl">

                {/* Movie info */}
                <div className="mb-6 border-b border-gray-600 pb-4">
                    <h2 className="text-2xl font-bold">{movie.title}</h2>
                    <p className="text-gray-300">
                        {movie.genre} • {movie.status}
                    </p>
                </div>

                {/* Showtime */}
                <div className="mb-6 border-b border-gray-600 pb-4">
                    <h3 className="text-xl font-bold mb-2">Showtime</h3>
                    <p className="text-gray-300">
                        {checkoutData.date} at {checkoutData.time}
                    </p>
                </div>

                {/* Seats */}
                <div className="mb-6 border-b border-gray-600 pb-4">
                    <h3 className="text-xl font-bold mb-2">Tickets</h3>

                    <div className="space-y-2">
                        {seatItems.map(item => (
                            <div
                                key={item.seat}
                                className="flex justify-between text-gray-300"
                            >
                                <span>
                                    Seat {item.seat} ({item.type})
                                </span>
                                <span>${item.price}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pricing */}
                <div className="mb-6 space-y-2">
                    <div className="flex justify-between text-gray-300">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-gray-300">
                        <span>Booking Fee</span>
                        <span>${bookingFee.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-xl font-bold border-t border-gray-600 pt-2">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>

                {/* Payment method */}
                <div className="mb-6 border-t border-gray-600 pt-4">
                    <h3 className="text-xl font-bold mb-2">Payment Method</h3>
                    {cards.length === 0 ? (
                        <p className="text-gray-300">No payment methods available. Please add a card in your profile.</p>
                    ) : (
                        <div className="space-y-2">
                            {cards.map(card => (
                                <label key={card.id} className="flex items-center space-x-3 text-gray-300">
                                    <input
                                        type="radio"
                                        name="card"
                                        value={card.id}
                                        checked={selectedCardId === card.id}
                                        onChange={() => setSelectedCardId(card.id)}
                                        className="text-[#ECDFCC]"
                                    />
                                    <span>
                                        {card.brand} ****{card.last4} (Expires {card.expiryMonth}/{card.expiryYear})
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Confirm button */}
                <button
                    onClick={handleConfirmBooking}
                    className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-bold"
                >
                    Confirm Booking
                </button>
            </div>
        </main>
    );
}