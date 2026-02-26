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
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch movies from backend
  useEffect(() => {
    fetch("http://localhost:8080/api/movies", {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
      });
  }, []);

  // Search handler
  const handleSearch = (searchTerm: string, filter: string) => {
    setHasSearched(true);

    let filtered = movies;

    if (filter === "No Filter") {
      filtered = movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filter === "Genre") {
      filtered = movies.filter((movie) =>
        movie.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filter === "Date") {
      filtered = movies.filter((movie) =>
        movie.showings.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setSearchResults(filtered);
  };

  // Filter movies by genre and status
  const currentlyShowingMovies = movies.filter((movie) =>
    movie.status.includes("Currently Running")
  );
  const comingSoonMovies = movies.filter((movie) =>
    movie.status.includes("Coming Soon")
  );
  const crimeMovies = movies.filter((movie) =>
    movie.genre.includes("Crime")
  );
  const dramaMovies = movies.filter((movie) =>
    movie.genre.includes("Drama")
  );
  const actionMovies = movies.filter((movie) =>
    movie.genre.includes("Action")
  );
  const adventureMovies = movies.filter((movie) =>
    movie.genre.includes("Adventure")
  );
  const fantasyMovies = movies.filter((movie) =>
    movie.genre.includes("Fantasy")
  );
  const romanceMovies = movies.filter((movie) =>
    movie.genre.includes("Romance")
  );
  const sciFiMovies = movies.filter((movie) =>
    movie.genre.includes("Sci-Fi")
  );
  const animationMovies = movies.filter((movie) =>
    movie.genre.includes("Animation")
  );

  return (
    <main className="min-h-screen bg-[#1E201E] flex-column items-center justify-center p-8">

      <Search onSearch={handleSearch} />

      {/* Show Search Results if user searched */}
      {hasSearched && (
        <CardRow genre="Search Results" movies={searchResults} />
      )}

      <CardRow genre="Currently Showing" movies={currentlyShowingMovies} />
      <CardRow genre="Coming Soon" movies={comingSoonMovies} />
      <CardRow genre="Crime" movies={crimeMovies} />
      <CardRow genre="Drama" movies={dramaMovies} />
      <CardRow genre="Action" movies={actionMovies} />
      <CardRow genre="Adventure" movies={adventureMovies} />
      <CardRow genre="Fantasy" movies={fantasyMovies} />
      <CardRow genre="Romance" movies={romanceMovies} />
      <CardRow genre="Sci-Fi" movies={sciFiMovies} />
      <CardRow genre="Animation" movies={animationMovies} />

    </main>
  );
}