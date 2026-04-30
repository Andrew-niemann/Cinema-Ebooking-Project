"use client";

import Link from "next/link";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import ImageProxy from "@/components/ImageProxy";

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

type CardProps = {
  movie: Movie;
  favorites: number[];
  onToggleFavorite: (movieId: number) => void;
};

export default function Card({ movie, favorites, onToggleFavorite }: CardProps) {
  const isFavorite = favorites.includes(movie.id);

  return (
    <div className="w-[150px] bg-[#3C3D37] overflow-visible flex-col justify-center items-center m-2 duration-300 ease-in-out shadow transition hover:scale-110 hover:shadow-md relative">
      <Link href={`/movie/${movie.id}`}>
        <ImageProxy
          src={movie.posterUrl}
          alt={movie.title + " poster"}
          className="w-full h-[225px] object-cover" 
        />
      </Link>

      <h3 className="text-[#ECDFCC] mt-2 px-1 text-center truncate">{movie.title}</h3>

      <button
        onClick={() => onToggleFavorite(movie.id)}
        className="absolute top-2 right-2 text-2xl text-red-500 focus:outline-none"
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
      </button>
    </div>
  );
}