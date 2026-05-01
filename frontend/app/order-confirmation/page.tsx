"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ReceiptData = {
    bookingId: number;
    movieTitle: string;
    movieGenre?: string;
    movieStatus?: string;
    showDate?: string;
    showTime?: string;
    seats: {
        seat: string;
        type: string;
        price: number;
    }[];
    subtotal: number;
    bookingFee: number;
    total: number;
    email?: string;
    paymentMethod: string;
    confirmationDate: string;
};

const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    });
};

const formatDateTime = (value: string) => {
    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(new Date(value));
};

const getSavedReceipt = () => {
    if (typeof window === "undefined") return null;

    const savedReceipt = localStorage.getItem("orderConfirmation");
    if (!savedReceipt) return null;

    try {
        return JSON.parse(savedReceipt) as ReceiptData;
    } catch {
        localStorage.removeItem("orderConfirmation");
        return null;
    }
};

export default function OrderConfirmationPage() {
    const [receipt, setReceipt] = useState<ReceiptData | null>(null);

    useEffect(() => {
        setReceipt(getSavedReceipt());
    }, []);

    const ticketCounts = useMemo(() => {
        if (!receipt) return {};

        return receipt.seats.reduce((counts: Record<string, number>, item) => {
            const key = item.type.toUpperCase();
            counts[key] = (counts[key] || 0) + 1;
            return counts;
        }, {});
    }, [receipt]);

    if (!receipt) {
        return (
            <main className="min-h-screen bg-[#1E201E] text-[#ECDFCC] flex items-center justify-center p-8">
                <section className="w-full max-w-xl rounded-xl border border-gray-700 bg-[#3C3D37] p-8 text-center shadow-xl">
                    <h1 className="mb-3 text-3xl font-bold">No receipt found</h1>
                    <p className="mb-6 text-gray-300">
                        Your order confirmation could not be loaded.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex rounded-lg bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-700"
                    >
                        Return Home
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#1E201E] px-4 py-10 text-[#ECDFCC] sm:px-8">
            <section className="mx-auto w-full max-w-3xl">
                <div className="mb-8">
                    <p className="mb-2 text-sm font-semibold uppercase text-green-300">
                        Booking confirmed
                    </p>
                    <h1 className="text-4xl font-bold">Order Confirmation</h1>
                </div>

                <div className="rounded-xl border border-gray-700 bg-[#3C3D37] p-6 shadow-xl sm:p-8">
                    <div className="mb-6 flex flex-col gap-3 border-b border-gray-700 pb-6 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">{receipt.movieTitle}</h2>
                            <p className="mt-1 text-gray-300">
                                {[receipt.movieGenre, receipt.movieStatus].filter(Boolean).join(" - ")}
                            </p>
                        </div>
                        <div className="text-left sm:text-right">
                            <p className="text-sm text-gray-400">Confirmation Number</p>
                            <p className="text-xl font-bold">#{receipt.bookingId}</p>
                        </div>
                    </div>

                    <div className="grid gap-5 border-b border-gray-700 pb-6 sm:grid-cols-2">
                        <div>
                            <h3 className="mb-2 text-lg font-bold">Showtime</h3>
                            <p className="text-gray-300">{receipt.showDate || "N/A"} at {receipt.showTime || "N/A"}</p>
                        </div>
                        <div>
                            <h3 className="mb-2 text-lg font-bold">Purchased</h3>
                            <p className="text-gray-300">{formatDateTime(receipt.confirmationDate)}</p>
                        </div>
                        <div>
                            <h3 className="mb-2 text-lg font-bold">Email</h3>
                            <p className="text-gray-300">{receipt.email || "Not provided"}</p>
                        </div>
                        <div>
                            <h3 className="mb-2 text-lg font-bold">Payment</h3>
                            <p className="text-gray-300">{receipt.paymentMethod}</p>
                        </div>
                    </div>

                    <section className="border-b border-gray-700 py-6">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <h3 className="text-xl font-bold">Tickets</h3>
                            <span className="text-gray-400">{receipt.seats.length} seats</span>
                        </div>

                        <div className="mb-4 space-y-2">
                            {Object.entries(ticketCounts).map(([type, count]) => (
                                <div key={type} className="flex justify-between text-gray-300">
                                    <span>{type.charAt(0) + type.slice(1).toLowerCase()} x{count}</span>
                                    <span>{formatCurrency(receipt.seats.find(item => item.type.toUpperCase() === type)?.price || 0)} each</span>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-lg bg-[#242623] p-4">
                            {receipt.seats.map(item => (
                                <div key={item.seat} className="flex justify-between border-b border-gray-700 py-2 text-gray-300 last:border-0">
                                    <span>Seat {item.seat} ({item.type})</span>
                                    <span>{formatCurrency(item.price)}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-3 py-6">
                        <h3 className="text-xl font-bold">Receipt</h3>
                        <div className="flex justify-between text-gray-300">
                            <span>Subtotal</span>
                            <span>{formatCurrency(receipt.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                            <span>Booking fee</span>
                            <span>{formatCurrency(receipt.bookingFee)}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-700 pt-3 text-xl font-bold">
                            <span>Total paid</span>
                            <span>{formatCurrency(receipt.total)}</span>
                        </div>
                    </section>

                    <Link
                        href="/"
                        className="flex w-full justify-center rounded-lg bg-green-600 px-6 py-4 text-lg font-bold text-white transition hover:bg-green-700"
                    >
                        Return Home
                    </Link>
                </div>
            </section>
        </main>
    );
}
