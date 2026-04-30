"use client";

import { useEffect, useState } from "react";

type CheckoutData = {
    movieId?: number;
    showingId?: number;
    selectedSeats: Record<string, string>;
    bookingId?: number;
    date?: string;
    time?: string;
};

type Card = {
    id: number;
    digits: string;
    last4: string;
    brand: string;
    expirationMonth: string;
    expirationYear: string;
    cvv?: string;
};

type UserCard = {
    id: number;
    digits?: string;
    expirationMonth?: string;
    expirationYear?: string;
    cvv?: string;
};

type CardsResponse = {
    cards?: UserCard[];
    message?: string;
};

type Movie = {
    id: number;
    title: string;
    genre: string;
    status: string;
};

type BookingTicket = {
    seatNumber: string;
    ticketType: string;
};

type BookingListItem = {
    bookingId: number;
    showDate?: string;
    showTime?: string;
    status?: string;
    tickets?: BookingTicket[];
};

type BookingResponse = {
    success?: boolean;
    message?: string;
};

const TICKET_PRICES: Record<string, number> = {
    ADULT: 9,
    CHILD: 7,
    SENIOR: 5
};

const toSavedCard = (card: UserCard): Card => {
    const digits = card.digits || "";
    const last4 = digits.slice(-4);
    const brand = digits.startsWith("4") ? "Visa" : digits.startsWith("5") ? "MasterCard" : "Unknown";

    return {
        id: card.id,
        digits,
        last4,
        brand,
        expirationMonth: card.expirationMonth || "",
        expirationYear: card.expirationYear || "",
        cvv: card.cvv
    };
};

const getAuthHeader = () => {
    const token = localStorage.getItem("token")?.trim();
    if (!token) return null;

    return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
};

export default function CheckoutPage() {
    const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
    const [movie, setMovie] = useState<Movie | null>(null);
    const [cards, setCards] = useState<Card[]>([]);
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
    const [showAddCardForm, setShowAddCardForm] = useState(false);
    const [newCardNumber, setNewCardNumber] = useState("");
    const [newCardMonth, setNewCardMonth] = useState("");
    const [newCardYear, setNewCardYear] = useState("");
    const [newCardCvv, setNewCardCvv] = useState("");
    const [addCardError, setAddCardError] = useState("");
    const [confirmError, setConfirmError] = useState("");
    const [isConfirming, setIsConfirming] = useState(false);

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

        // Fetch user's cards
        const authHeader = getAuthHeader();
        if (authHeader) {
            fetch("http://localhost:8080/api/user/info", {
                headers: { Authorization: authHeader }
            })
            .then(res => res.json())
            .then((data: CardsResponse) => {
                if (data && data.cards && Array.isArray(data.cards)) {
                    const processedCards = data.cards.map(toSavedCard);
                    setCards(processedCards);
                    if (processedCards.length > 0) setSelectedCardId(processedCards[0].id);
                }
            })
            .catch(console.error);
        }
    }, []);

    const handleAddCard = async () => {
        setAddCardError("");

        if (!newCardNumber || !newCardMonth || !newCardYear || !newCardCvv) {
            setAddCardError("Please complete all card fields.");
            return;
        }

        const authHeader = getAuthHeader();
        if (!authHeader) {
            setAddCardError("Please log in to add a card.");
            return;
        }

        const cardPayload = {
            card: {
                digits: newCardNumber,
                expirationMonth: newCardMonth,
                expirationYear: newCardYear,
                cvv: newCardCvv
            }
        };

        try {
            const response = await fetch("http://localhost:8080/api/user/update-profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authHeader
                },
                body: JSON.stringify(cardPayload)
            });

            if (!response.ok) {
                const body: CardsResponse = await response.json();
                throw new Error(body.message || "Unable to save card.");
            }

            const data: CardsResponse = await response.json();
            if (data && data.cards && Array.isArray(data.cards)) {
                const processedCards = data.cards.map(toSavedCard);
                setCards(processedCards);
                if (processedCards.length > 0) {
                    setSelectedCardId(processedCards[processedCards.length - 1].id);
                }
            }

            setShowAddCardForm(false);
            setNewCardNumber("");
            setNewCardMonth("");
            setNewCardYear("");
            setNewCardCvv("");
            setAddCardError("");
        } catch (error: unknown) {
            setAddCardError(error instanceof Error ? error.message : "Failed to add card.");
        }
    };

    const findPendingBookingId = async (authHeader: string) => {
        if (!checkoutData) return null;

        const response = await fetch("http://localhost:8080/api/bookings/my-bookings", {
            headers: { Authorization: authHeader }
        });

        if (!response.ok || response.status === 204) return null;

        const bookings: BookingListItem[] = await response.json();
        const selectedSeatKeys = Object.entries(checkoutData.selectedSeats)
            .map(([seatNumber, ticketType]) => `${seatNumber}:${ticketType.toUpperCase()}`)
            .sort();

        const match = bookings.find(booking => {
            if (booking.status !== "PENDING") return false;
            if (checkoutData.date && booking.showDate !== checkoutData.date) return false;
            if (checkoutData.time && booking.showTime !== checkoutData.time) return false;

            const bookingSeatKeys = (booking.tickets || [])
                .map(ticket => `${ticket.seatNumber}:${ticket.ticketType.toUpperCase()}`)
                .sort();

            return selectedSeatKeys.length === bookingSeatKeys.length
                && selectedSeatKeys.every((key, index) => key === bookingSeatKeys[index]);
        });

        return match?.bookingId ?? null;
    };

    const handleConfirmBooking = async () => {
        if (!checkoutData) return;

        setConfirmError("");

        const authHeader = getAuthHeader();
        if (!authHeader) {
            setConfirmError("Please log in to complete booking.");
            return;
        }

        const selectedCard = cards.find(card => card.id === selectedCardId);
        if (!selectedCard) {
            setConfirmError("Please select a payment method.");
            return;
        }

        const bookingId = checkoutData.bookingId ?? (await findPendingBookingId(authHeader));
        if (!bookingId) {
            setConfirmError("No reserved booking found. Please choose your seats again.");
            return;
        }

        if (!checkoutData.bookingId) {
            const updatedCheckoutData = { ...checkoutData, bookingId };
            setCheckoutData(updatedCheckoutData);
            localStorage.setItem("checkoutData", JSON.stringify(updatedCheckoutData));
        }

        setIsConfirming(true);

        try {
            const payload = {
                bookingId,
                card: {
                    digits: selectedCard.digits,
                    expirationMonth: selectedCard.expirationMonth,
                    expirationYear: selectedCard.expirationYear,
                    cvv: selectedCard.cvv || ""
                }
            };

            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authHeader
                },
                body: JSON.stringify(payload)
            };

            let response = await fetch("http://localhost:8080/api/confirm-booking", requestOptions);

            if (response.status === 401 || response.status === 404) {
                response = await fetch("http://localhost:8080/api/bookings/confirm-booking", requestOptions);
            }

            const data: BookingResponse = await response.json().catch(() => ({}));

            if (!response.ok || data.success === false) {
                throw new Error(data.message || "Booking failed");
            }

            localStorage.removeItem("checkoutData");
            window.location.href = "/";
        } catch (error: unknown) {
            setConfirmError(error instanceof Error ? error.message : "Booking failed");
        } finally {
            setIsConfirming(false);
        }
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
            <h1 className="text-4xl font-bold mb-6">Payment</h1>

            <p className="text-gray-400 mb-4">Review your payment method and confirm your booking.</p>

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
                        <p className="text-gray-300">No payment methods available. Add a new card below.</p>
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
                                        {card.brand} ****{card.last4} (Expires {card.expirationMonth}/{card.expirationYear})
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}

                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={() => setShowAddCardForm(prev => !prev)}
                            className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-[#ECDFCC] hover:bg-gray-700"
                        >
                            {showAddCardForm ? "Cancel" : "Add a new card"}
                        </button>
                    </div>

                    {showAddCardForm && (
                        <div className="mt-4 space-y-4 rounded-2xl bg-[#242623] p-4 text-gray-300">
                            <div>
                                <label className="block text-sm font-medium mb-1">Card number</label>
                                <input
                                    value={newCardNumber}
                                    onChange={e => setNewCardNumber(e.target.value.replace(/[^0-9]/g, ""))}
                                    placeholder="1234123412341234"
                                    className="w-full rounded-lg border border-gray-600 bg-[#1E201E] px-3 py-2 text-white"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Expiry month</label>
                                    <input
                                        value={newCardMonth}
                                        onChange={e => setNewCardMonth(e.target.value.replace(/[^0-9]/g, ""))}
                                        placeholder="MM"
                                        maxLength={2}
                                        className="w-full rounded-lg border border-gray-600 bg-[#1E201E] px-3 py-2 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Expiry year</label>
                                    <input
                                        value={newCardYear}
                                        onChange={e => setNewCardYear(e.target.value.replace(/[^0-9]/g, ""))}
                                        placeholder="YY"
                                        maxLength={2}
                                        className="w-full rounded-lg border border-gray-600 bg-[#1E201E] px-3 py-2 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">CVV</label>
                                    <input
                                        value={newCardCvv}
                                        onChange={e => setNewCardCvv(e.target.value.replace(/[^0-9]/g, ""))}
                                        placeholder="123"
                                        maxLength={4}
                                        className="w-full rounded-lg border border-gray-600 bg-[#1E201E] px-3 py-2 text-white"
                                    />
                                </div>
                            </div>
                            {addCardError && (
                                <div className="text-red-400 text-sm">{addCardError}</div>
                            )}
                            <button
                                type="button"
                                onClick={handleAddCard}
                                className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold"
                            >
                                Save card
                            </button>
                        </div>
                    )}
                </div>

                {confirmError && (
                    <div className="mb-4 text-red-400 text-sm">{confirmError}</div>
                )}

                {/* Confirm button */}
                <button
                    onClick={handleConfirmBooking}
                    disabled={isConfirming}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed py-3 rounded-lg font-bold"
                >
                    {isConfirming ? "Confirming..." : "Buy Tickets"}
                </button>
            </div>
        </main>
    );
}
