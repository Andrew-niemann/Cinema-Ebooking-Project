"use client";

import { useState } from "react";

type SearchProps = {
  onSearch: (term: string, filterType: string, filterValue: string) => void;
};

export default function Search({ onSearch }: SearchProps) {

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("No Filter");
  const [filterValue, setFilterValue] = useState("");

  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showValueDropdown, setShowValueDropdown] = useState(false);

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

  const statuses = [
    "Currently Running",
    "Coming Soon"
  ];

  const handleSearch = () => {
    onSearch(searchTerm, filterType, filterValue);
  };

  return (
    <div className="flex items-center bg-[#3C3D37] rounded-full p-2 relative">

      {/* Search input */}
      <input
        className="w-96 px-4 py-2 text-lg text-[#ECDFCC] bg-transparent focus:outline-none"
        type="text"
        placeholder="Search for a movie..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Search button */}
      <button
        className="p-2 mx-2 inset-y-2 right-2 bg-[#697565] text-[#ECDFCC] px-6 rounded-full font-semibold hover:bg-white hover:text-[#1E201E] transition-colors"
        onClick={handleSearch}
      >
        Search
      </button>

      {/* Filter type - first dropdown menu */}
      <div className="relative">
        <button
          className="p-2 mx-2 inset-y-2 right-2 bg-[#697565] text-[#ECDFCC] px-6 rounded-full font-semibold hover:bg-white hover:text-[#1E201E] transition-colors"
          onClick={() => setShowTypeDropdown(!showTypeDropdown)}
        >
          {filterType}
        </button>

        {showTypeDropdown && (
          <div className="absolute mt-2 bg-[#697565] rounded shadow w-40 z-50">
            <button
              className="block w-full text-left px-4 py-2 hover:bg-white hover:text-black"
              onClick={() => {
                setFilterType("No Filter");
                setFilterValue("");
                setShowTypeDropdown(false);
              }}
            >
              No Filter
            </button>

            <button
              className="block w-full text-left px-4 py-2 hover:bg-white hover:text-black"
              onClick={() => {
                setFilterType("Genre");
                setFilterValue("");
                setShowTypeDropdown(false);
              }}
            >
              Genre
            </button>

            <button
              className="block w-full text-left px-4 py-2 hover:bg-white hover:text-black"
              onClick={() => {
                setFilterType("Date");
                setFilterValue("");
                setShowTypeDropdown(false);
              }}
            >
              Date
            </button>
          </div>
        )}
      </div>

      {/* Filter value - second dropdown menu */}
      {filterType !== "No Filter" && (
        <div className="relative">
          <button
            className="p-2 mx-2 inset-y-2 right-2 bg-[#697565] text-[#ECDFCC] px-6 rounded-full font-semibold hover:bg-white hover:text-[#1E201E] transition-colors"
            onClick={() => setShowValueDropdown(!showValueDropdown)}
          >
            {filterValue || "Select"}
          </button>

          {showValueDropdown && (
            <div className="absolute mt-2 bg-[#697565] rounded shadow w-48 max-h-60 overflow-y-auto z-50">

              {(filterType === "Genre" ? genres : statuses).map((item) => (
                <button
                  key={item}
                  className="block w-full text-left px-4 py-2 hover:bg-white hover:text-black"
                  onClick={() => {
                    setFilterValue(item);
                    setShowValueDropdown(false);
                  }}
                >
                  {item}
                </button>
              ))}

            </div>
          )}
        </div>
      )}

    </div>
  );
}