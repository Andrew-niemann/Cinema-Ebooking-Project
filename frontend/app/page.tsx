// 
"use client";

import { useEffect, useState } from "react";
import CardRow from "@/components/CardRow";
import Search from "@/components/Search";

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

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch all movies
  useEffect(() => {
    fetch("http://localhost:8080/api/movies", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setMovies(data));
  }, []);

  // Fetch user favorites
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8080/api/user/info", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.favorites && Array.isArray(data.favorites)) {
          setFavorites(data.favorites.map((movie: { id: number }) => movie.id));
        }
      });
  }, [token]);

  // Handle search
  const handleSearch = (term: string, filterType: string, filterValue: string) => {
    let filtered = movies;

    if (term.trim() !== "") {
      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (filterType === "Genre" && filterValue) {
      filtered = filtered.filter((movie) => movie.genre.includes(filterValue));
    }

    if (filterType === "Date" && filterValue) {
      filtered = filtered.filter((movie) => movie.status.includes(filterValue));
    }

    setSearchResults(filtered);
    setHasSearched(true);
  };

  // Toggle favorite at page level
  const onToggleFavorite = async (movieId: number) => {
    if (!token) {
      alert("You must be logged in to favorite a movie.");
      return;
    }

    const isFav = favorites.includes(movieId);

    try {
      if (!isFav) {
        await fetch(`http://localhost:8080/api/user/add-favorite?movieId=${movieId}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites([...favorites, movieId]);
      } else {
        await fetch(`http://localhost:8080/api/user/remove-favorite?movieId=${movieId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(favorites.filter((id) => id !== movieId));
      }
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    }
  };

  // Filter movies by genre/status
  const currentlyShowingMovies = movies.filter((m) => m.status.includes("Currently Running"));
  const comingSoonMovies = movies.filter((m) => m.status.includes("Coming Soon"));
  const genres = ["Crime", "Drama", "Action", "Adventure", "Fantasy", "Romance", "Sci-Fi", "Animation"];

  return (
    <main className="min-h-screen bg-[#1E201E] flex-column items-center justify-center p-8">
      <div className="flex justify-start mb-8">
        <Search onSearch={handleSearch} />
      </div>

      {hasSearched && (
        <>
          {searchResults.length > 0 ? (
            <CardRow
              genre="Search Results"
              movies={searchResults}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
            />
          ) : (
            <p className="text-white text-lg mt-4">
              No results found.
            </p>
          )}
        </>
      )}

      <CardRow
        genre="Currently Showing"
        movies={currentlyShowingMovies}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
      />
      <CardRow
        genre="Coming Soon"
        movies={comingSoonMovies}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
      />

      {genres.map((g) => {
        const filtered = movies.filter((m) => m.genre.includes(g));
        return (
          <CardRow
            key={g}
            genre={g}
            movies={filtered}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
          />
        );
      })}
    </main>
  );
}