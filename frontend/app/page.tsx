"use client";

import { useEffect, useState } from "react";
import CardRow from "@/components/CardRow";
import Search from "@/components/Search";
import { movieService } from "@/utils/MovieProxy";

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

  useEffect(() => {
    const fetchMoviesProxy = async () => {
      try {
        const data = await movieService.getMovies();
        setMovies(Array.isArray(data) ? (data as Movie[]) : []);
      } catch (error) {
        console.error("Error fetching movies through proxy:", error);
        setMovies([]);
      }
    };

    fetchMoviesProxy();
  }, []);

  // Fetch user favorites safely
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8080/api/user/info", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Network response not ok");
        const text = await res.text();
        return text ? JSON.parse(text) : null;
      })
      .then((data) => {
        if (data?.favorites && Array.isArray(data.favorites)) {
          setFavorites(data.favorites.map((movie: { id: number }) => movie.id));
        }
      })
      .catch((err) => console.error("Failed to fetch favorites:", err));
  }, [token]);

  // Handle search with Optional Chaining (?.) to prevent crashes on null fields
  const handleSearch = (term: string, filterType: string, filterValue: string) => {
    let filtered = Array.isArray(movies) ? movies : [];

    if (term.trim() !== "") {
      filtered = filtered.filter((movie) =>
        movie.title?.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (filterType === "Genre" && filterValue) {
      filtered = filtered.filter((movie) => movie.genre?.includes(filterValue));
    }

    if (filterType === "Date" && filterValue) {
      filtered = filtered.filter((movie) => movie.status?.includes(filterValue));
    }

    setSearchResults(filtered);
    setHasSearched(true);
  };

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

  const safeMovies = Array.isArray(movies) ? movies : [];
  const currentlyShowingMovies = safeMovies.filter((m) => m.status?.includes("Currently Running"));
  const comingSoonMovies = safeMovies.filter((m) => m.status?.includes("Coming Soon"));
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
        const filtered = safeMovies.filter((m) => m.genre?.includes(g));
        // Only render the CardRow if there are actually movies in that genre
        if (filtered.length === 0) return null; 

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