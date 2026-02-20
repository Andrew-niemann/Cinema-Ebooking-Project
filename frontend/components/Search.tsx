/* components/Search.tsx */
"use client";
import { useState } from "react";

export default function Search() {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <div className="flex items-center justify-start rounded-full bg-[#3C3D37]">

            {/* Search Icon */}
            <div className="flex absolute pl-4">
                <svg className="w-6 h-6 text-[#697565]"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </div>

            {/* Input Field */}
            <input className="py-4 pl-12 pr-20 text-lg text-[#ECDFCC] focus:outline-none"
                type="text" 
                placeholder="Search for a movie..." 
            />

            {/* Search Button */}
            <button className="p-2 ml-4 inset-y-2 right-2 bg-[#697565] text-[#ECDFCC] px-6 rounded-full font-semibold hover:bg-white hover:text-[#1E201E] transition-colors">
                Search
            </button>

            {/* Filter Button */}
            <button className="p-2 ml-4 inset-y-2 right-2 bg-[#697565] text-[#ECDFCC] px-6 rounded-full font-semibold hover:bg-white hover:text-[#1E201E] transition-colors"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                Filter
            </button>

        </div>
    )
}