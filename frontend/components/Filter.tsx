// components/Filter.tsx
"use client";


import { useState } from "react";

export default function Filter() {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <button className="ml-4 inset-y-2 right-2 bg-[#ECDFCC] text-[#1E201E] px-6 rounded-full font-semibold hover:bg-white transition-colors"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
            Filter
        </button>
    )
}