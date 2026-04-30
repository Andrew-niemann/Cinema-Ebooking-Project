/* components/AIRecommendations.tsx */
"use client";

import { useState } from "react";
import Card from "@/components/Card";

type Movie = {
  id: number;
  title: string;
  posterUrl: string;
  trailerUrl: string;
  genre: string;
  rating: string;
  description: string;
  status: string;
  showings: string;
};

type AIProps = {
  favorites: number[];
  onToggleFavorite: (movieId: number) => void;
};

export default function AIRecommendations({ favorites, onToggleFavorite }: AIProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateRecommendations = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    
    if (!token) {
      setError("You must be logged in to see recommendations.");
      return;
    }

    setIsLoading(true);
    setError("");
    setMovies([]);

    try {
      const response = await fetch("http://localhost:8080/api/recommendations/my-recommendations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("The AI is currently swamped. Please try again in a moment!");
      }

      const data = await response.json();
      setMovies(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong fetching recommendations.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-[#2A2B27] rounded-xl border border-[#3C3D37] shadow-lg">
      <h2 className="text-2xl font-bold text-[#ECDFCC] mb-4">Your Custom AI Recommendations</h2>
      <p className="text-gray-300 mb-6">
        Not sure what to watch? Let our AI analyze your booking history and favorites to find 5 movies you will love.
      </p>

      <button
        onClick={handleGenerateRecommendations}
        disabled={isLoading}
        className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
          isLoading 
            ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
            : "bg-[#ECDFCC] text-[#1E201E] hover:bg-white hover:scale-105"
        }`}
      >
        {isLoading ? "Analyzing your taste (this takes a few seconds)..." : "Generate Recommended Movies"}
      </button>

      {error && <p className="text-red-400 mt-4 font-semibold">{error}</p>}

      {movies.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl text-[#ECDFCC] mb-4">We think you'll love these:</h3>
          <div className="flex flex-wrap gap-4">
            {movies.map((movie) => (
              <Card 
                key={movie.id} 
                movie={movie} 
                favorites={favorites} 
                onToggleFavorite={onToggleFavorite} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}