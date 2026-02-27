"use client";

import { useState } from "react";

// 1. Define our tickets, prices, and colors all in one easy place
const TICKET_CONFIG = {
    adult: { price: 9, color: "bg-green-400 hover:bg-green-500", label: "Adult ($9)" },
    child: { price: 7, color: "bg-blue-400 hover:bg-blue-500", label: "Child ($7)" },
    senior: { price: 5, color: "bg-purple-400 hover:bg-purple-500", label: "Senior ($5)" }
};

// This tells TypeScript our only valid keys are 'adult', 'child', or 'senior'
type TicketType = keyof typeof TICKET_CONFIG; 

export default function Seats() {
    // 2. State for our "Paintbrush" (Defaults to Adult)
    const [activeTicketType, setActiveTicketType] = useState<TicketType>("adult");
    
    // 3. State for our seats. Instead of an array, it's an object like: { "A1": "adult", "B2": "child" }
    const [selectedSeats, setSelectedSeats] = useState<Record<string, TicketType>>({});

    // Prepare the grid data (same clean way as before)
    const rows = ["A", "B", "C", "D", "E"];
    const cols = [1, 2, 3, 4, 5, 6, 7, 8];
    const allSeats: string[] = [];
    rows.forEach(row => {
        cols.forEach(col => {
            allSeats.push(`${row}${col}`);
        });
    });

    const handleSeatClick = (seat: string) => {
        // Make a copy of our current seats
        const newSeats = { ...selectedSeats };
        
        // If the seat they clicked is already the active type, unselect it (erase)
        if (newSeats[seat] === activeTicketType) {
            delete newSeats[seat];
        } else {
            // Otherwise, assign the seat to the current paintbrush type
            newSeats[seat] = activeTicketType;
        }
        
        // Update the state
        setSelectedSeats(newSeats);
    };

    // 4. The Math: Loop through all selected tickets and add up their prices
    let totalPrice = 0;
    Object.values(selectedSeats).forEach(ticketType => {
        totalPrice += TICKET_CONFIG[ticketType].price;
    });

    return (
        <div className="flex flex-col items-center gap-8 text-[#ECDFCC]">
            
            {/* --- The "Paintbrush" Ticket Selectors --- */}
            <div className="flex gap-4">
                {(Object.keys(TICKET_CONFIG) as TicketType[]).map(type => (
                    <button
                        key={type}
                        onClick={() => setActiveTicketType(type)}
                        className={`px-4 py-2 rounded font-bold transition-all ${
                            activeTicketType === type 
                            ? "bg-white text-black ring-4 ring-white/50" // Highlight selected brush
                            : "bg-[#697565] text-white hover:bg-gray-500"
                        }`}
                    >
                        {TICKET_CONFIG[type].label}
                    </button>
                ))}
            </div>

            {/* --- The Seat Grid --- */}
            <div className="grid grid-cols-8 gap-2">
                {allSeats.map(seat => {
                    // Check if this specific seat is in our selected object
                    const myTicketType = selectedSeats[seat]; 
                    
                    // If it has a ticket, use that ticket's color. Otherwise, make it gray.
                    const colorClasses = myTicketType 
                        ? TICKET_CONFIG[myTicketType].color 
                        : "bg-gray-500 hover:bg-gray-400";

                    return (
                        <button
                            key={seat}
                            onClick={() => handleSeatClick(seat)}
                            className={`w-10 h-10 rounded font-semibold text-black transition-colors duration-200 ${colorClasses}`}
                        >
                            {seat}
                        </button>
                    );
                })}
            </div>

            {/* --- The Checkout Total --- */}
            <div className="bg-[#697565] p-6 rounded-lg shadow-xl w-full max-w-sm text-center">
                <h2 className="text-2xl font-bold mb-2">Total Price: ${totalPrice}</h2>
                <p className="text-gray-300">
                    {Object.keys(selectedSeats).length} Tickets Selected
                </p>
            </div>

        </div>
    );
}