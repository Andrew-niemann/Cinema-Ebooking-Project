"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Showing = {
    showId: number;
    showDate: string;
    startTime: string;
    showroomId: number;
};

export default function Showtimes({ movieId }: { movieId: number }) {
    const [showings, setShowings] = useState<Showing[]>([]);

    useEffect(() => {
        if (!movieId) return;

        fetch(`http://localhost:8080/api/showings/get-showings/${movieId}`)
            .then((res) => {
                if (!res.ok) {
                    setShowings([]);
                    return null;
                }
                return res.json();
            })
            .then((data) => {
                if (!data) return;
                const list = Array.isArray(data)
                    ? data
                    : data.showings || [];
                setShowings(list);
            })
            .catch(() => setShowings([]));
    }, [movieId]);

    if (!Array.isArray(showings) || showings.length === 0) {
        return <p className="text-gray-400">No showtimes available.</p>;
    }

    const uniqueDates = [...new Set(showings.map((s) => s.showDate))];

    return (
        <div className="mt-8 bg-[#3C3D37] p-6 rounded-xl shadow-lg w-full max-w-2xl">
            <h3 className="text-xl text-[#ECDFCC] mb-4 font-bold">
                Select Showtime
            </h3>

            {uniqueDates.map((date) => {
                const showingsForDate = showings.filter((s) => s.showDate === date);
                return (
                    <div key={`date-${date}`} className="mb-6">
                        <h4 className="text-lg text-[#ECDFCC] mb-2 font-semibold">
                            {date}
                        </h4>
                        <div className="flex flex-wrap gap-3">
                            {showingsForDate.map((s) => (
                                <Link
                                    key={`showing-${s.showId}`}
                                    href={`/movie/${movieId}/booking?showingId=${s.showId}&date=${encodeURIComponent(s.showDate)}&time=${encodeURIComponent(s.startTime)}`}
                                    className="bg-[#1E201E] text-[#ECDFCC] border border-[#697565] hover:bg-white hover:text-black px-4 py-2 rounded-md font-bold"
                                >
                                    {s.showDate} {s.startTime}
                                </Link>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}