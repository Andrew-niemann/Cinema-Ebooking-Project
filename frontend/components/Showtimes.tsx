"use client";

import { useState } from "react";
import Link from "next/link"; 

type ShowtimesProps = {
    rawShowings: string | undefined;
    movieId: number; 
};

export default function Showtimes({ rawShowings, movieId }: ShowtimesProps) {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    if (!rawShowings) return <p className="text-gray-400">No showtimes available.</p>;

    const schedule = rawShowings.split(',').map(chunk => {
        const cleanChunk = chunk.trim();
        const firstSpace = cleanChunk.indexOf(' '); 
        const date = cleanChunk.substring(0, firstSpace);
        const timeString = cleanChunk.substring(firstSpace + 1);
        const times = timeString.match(/\d{1,2}:\d{2}\s[AP]M/g) || []; 
        return { date, times };
    });

    const activeDate = selectedDate || schedule[0]?.date;
    const activeTimes = schedule.find(s => s.date === activeDate)?.times || [];

    return (
        <div className="mt-8 bg-[#3C3D37] p-6 rounded-xl shadow-lg w-full max-w-2xl">
            <h3 className="text-xl text-[#ECDFCC] mb-4 font-bold">1. Select a Date</h3>
            
            {/* DATE TABS */}
            <div className="flex flex-wrap gap-2 border-b border-gray-600 pb-4 mb-4">
                {schedule.map((day) => (
                    <button
                        key={day.date}
                        onClick={() => setSelectedDate(day.date)}
                        className={`px-4 py-2 rounded-t-lg font-bold transition-colors ${
                            activeDate === day.date
                                ? "bg-[#697565] text-white" 
                                : "text-gray-400 hover:text-white"
                        }`}
                    >
                        {day.date}
                    </button>
                ))}
            </div>

            <h3 className="text-xl text-[#ECDFCC] mb-4 font-bold">2. Select a Time to Book</h3>
            
            {/* TIME LINKS */}
            <div className="flex flex-wrap gap-3">
                {activeTimes.map((time) => (
                    <Link
                        key={time}
                        href={`/movie/${movieId}/booking?date=${activeDate}&time=${time}`}
                        className="bg-[#1E201E] text-[#ECDFCC] border border-[#697565] hover:bg-white hover:text-black px-4 py-2 rounded-md font-bold transition-colors duration-200"
                    >
                        {time}
                    </Link>
                ))}
            </div>
        </div>
    );
}