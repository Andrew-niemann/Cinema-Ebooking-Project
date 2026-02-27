"use client";

import { useState } from "react";

type FilterProps = {
  onFilterChange: (type: "genre" | "status" | null, value: string | null) => void;
};

export default function Filter({ onFilterChange }: FilterProps) {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const genres = [
    "Crime",
    "Drama",
    "Action",
    "Adventure",
    "Fantasy",
    "Romance",
    "Sci-Fi",
    "Animation"
  ];

  const handleSelect = (
    type: "genre" | "status" | null,
    value: string | null
  ) => {
    setIsDropdownOpen(false);
    onFilterChange(type, value);
  };

  return (
    <div className="relative">
      <button
        className="p-2 ml-4 bg-[#ECDFCC] text-[#1E201E] px-6 rounded-full font-semibold hover:bg-white transition-colors"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        Filter
      </button>

      {isDropdownOpen && (
        <div className="absolute mt-2 bg-[#697565] rounded shadow-lg w-48 max-h-80 overflow-y-auto">

          {/* Clear Filter */}
          <button
            className="block w-full text-left px-4 py-2 text-sm text-[#ECDFCC] hover:bg-gray-100 hover:text-[#1E201E]"
            onClick={() => handleSelect(null, null)}
          >
            Clear Filter
          </button>

          {/* Status filters */}
          <div className="px-4 py-2 text-xs text-gray-300">Status</div>

          <button
            className="block w-full text-left px-4 py-2 text-sm text-[#ECDFCC] hover:bg-gray-100 hover:text-[#1E201E]"
            onClick={() => handleSelect("status", "Currently Running")}
          >
            Currently Running
          </button>

          <button
            className="block w-full text-left px-4 py-2 text-sm text-[#ECDFCC] hover:bg-gray-100 hover:text-[#1E201E]"
            onClick={() => handleSelect("status", "Coming Soon")}
          >
            Coming Soon
          </button>

          {/* Genre filters */}
          <div className="px-4 py-2 text-xs text-gray-300">Genres</div>

          {genres.map((genre) => (
            <button
              key={genre}
              className="block w-full text-left px-4 py-2 text-sm text-[#ECDFCC] hover:bg-gray-100 hover:text-[#1E201E]"
              onClick={() => handleSelect("genre", genre)}
            >
              {genre}
            </button>
          ))}

        </div>
      )}
    </div>
  );
}