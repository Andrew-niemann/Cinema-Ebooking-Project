"use client";

import { useEffect, useMemo, useState } from "react";

const TICKET_PRICES: Record<string, number> = {
    ADULT: 9,
    CHILD: 7,
    SENIOR: 5
};

type CheckoutData = {
    movieId?: number;
    showingId?: number;
    selectedSeats: Record<string, string>;
    bookingId?: number;
    date?: string;
    time?: string;
    email?: string;
};

type Movie = {
    id: number;
    title: string;
    genre: string;
    status: string;
    description?: string;
    posterUrl?: string;
};

export default function OrderSummaryPage() {
    const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
    const [movie, setMovie] = useState<Movie | null>(null);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const savedData = localStorage.getItem("checkoutData");
        if (!savedData) {
            setMessage("No order selected. Please choose seats first.");
            return;
        }

        const parsedData: CheckoutData = JSON.parse(savedData);
        setCheckoutData(parsedData);

        const storedEmail = localStorage.getItem("email") || parsedData.email || "";
        setEmail(storedEmail);

        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);

        fetch("http://localhost:8080/api/movies")
            .then(res => res.json())
            .then((movies: Movie[]) => {
                const found = movies.find(movie => movie.id === parsedData.movieId);
                setMovie(found || null);
            })
            .catch(() => setMovie(null));
    }, []);

    const seatItems = useMemo(() => {
        if (!checkoutData) return [];
        return Object.entries(checkoutData.selectedSeats).map(([seat, type]) => ({
            seat,
            type,
            price: TICKET_PRICES[type.toUpperCase()] || 0
        }));
    }, [checkoutData]);

    const subtotal = seatItems.reduce((sum, item) => sum + item.price, 0);
    const ticketCounts = useMemo(() => {
        if (!checkoutData) return {} as Record<string, number>;
        return Object.values(checkoutData.selectedSeats).reduce((counts: Record<string, number>, type) => {
            const key = type.toUpperCase();
            counts[key] = (counts[key] || 0) + 1;
            return counts;
        }, {} as Record<string, number>);
    }, [checkoutData]);

    const handleProceed = () => {
        if (!checkoutData) return;
        if (!isLoggedIn) {
            alert("Please log in before continuing to checkout.");
            return;
        }

        if (!email) {
            setMessage("Please confirm or enter an email address before continuing.");
            return;
        }

        localStorage.setItem("email", email);
        localStorage.setItem("checkoutData", JSON.stringify({ ...checkoutData, email }));
        window.location.href = "/checkout";
    };

    if (!checkoutData) {
        return (
            <main className="min-h-screen bg-[#1E201E] text-[#ECDFCC] flex items-center justify-center p-8">
                <div className="rounded-xl bg-[#3C3D37] p-10 text-center max-w-xl">
                    <h1 className="text-3xl font-bold mb-4">No order selected</h1>
                    <p className="text-gray-300">Please choose seats from a movie booking page before reviewing your order.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#1E201E] text-[#ECDFCC] flex flex-col items-center p-8">
            <div className="w-full max-w-3xl">
                <h1 className="text-4xl font-bold mb-6">Order Summary</h1>

                <div className="rounded-3xl bg-[#3C3D37] p-8 space-y-6 shadow-xl border border-gray-700">
                    <section className="space-y-3">
                        <h2 className="text-2xl font-bold">Movie</h2>
                        <p className="text-gray-300">{movie?.title || "Unknown movie"}</p>
                        <p className="text-gray-400">{movie?.genre} • {movie?.status}</p>
                    </section>

                    <section className="space-y-3 border-t border-gray-700 pt-6">
                        <h2 className="text-2xl font-bold">Showtime</h2>
                        <p className="text-gray-300">{checkoutData.date || "N/A"} at {checkoutData.time || "N/A"}</p>
                    </section>

                    <section className="space-y-4 border-t border-gray-700 pt-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Selected Tickets</h2>
                            <span className="text-gray-400">{seatItems.length} seats</span>
                        </div>

                        <div className="space-y-3">
                            {Object.entries(ticketCounts).map(([type, count]) => (
                                <div key={type} className="flex justify-between text-gray-300">
                                    <span>{type.charAt(0) + type.slice(1).toLowerCase()} x{count}</span>
                                    <span>${TICKET_PRICES[type]}.00 each</span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-[#242623] rounded-2xl p-4">
                            {seatItems.map(item => (
                                <div key={item.seat} className="flex justify-between text-gray-300 py-2 border-b border-gray-700 last:border-0">
                                    <span>Seat {item.seat} ({item.type})</span>
                                    <span>${item.price.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-3 border-t border-gray-700 pt-6">
                        <h2 className="text-2xl font-bold">Price Summary</h2>
                        <div className="flex justify-between text-gray-300">
                            <span>Total before tax</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                    </section>

                    <section className="space-y-3 border-t border-gray-700 pt-6">
                        <h2 className="text-2xl font-bold">Email</h2>
                        <p className="text-gray-400">Confirm your email for this order.</p>
                        <input
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setMessage("");
                            }}
                            className="w-full rounded-2xl border border-gray-600 bg-[#1E201E] p-3 text-white outline-none focus:border-blue-400"
                            placeholder="Email address"
                            type="email"
                        />
                        {!isLoggedIn && (
                            <p className="text-sm text-yellow-300">Please log in using the login button on the top right before continuing to payment.</p>
                        )}
                    </section>

                    {message && (
                        <p className="text-sm text-red-400">{message}</p>
                    )}

                    <button
                        onClick={handleProceed}
                        className="w-full rounded-2xl bg-green-600 py-4 text-lg font-bold transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-500"
                        disabled={!isLoggedIn}
                    >
                        Continue to Payment
                    </button>
                </div>
            </div>
        </main>
    );
}
