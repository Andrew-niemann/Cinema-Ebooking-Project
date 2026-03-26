"use client";

import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

type FavoriteButtonProps = {
  movieId: number;
};

export default function FavoriteButton({ movieId }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:8080/api/user/info", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load user info");
        }
        return res.json();
      })
      .then((data) => {
        const favIds = data.favorites?.map((fav: { id: number }) => fav.id) || [];
        setIsFavorite(favIds.includes(movieId));
      })
      .catch((err) => {
        console.error("FavoriteButton user info error:", err);
      })
      .finally(() => setLoading(false));
  }, [movieId]);

  const toggleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to manage favorites.");
      return;
    }

    const url = `http://localhost:8080/api/user/${isFavorite ? "remove-favorite" : "add-favorite"}?movieId=${movieId}`;
    const method = isFavorite ? "DELETE" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || "Unknown server error");
      }

      setIsFavorite((prev) => !prev);
    } catch (err) {
      console.error("Failed to update favorite status:", err);
      alert("Could not update favorite status. See console for details.");
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`text-2xl p-2 rounded transition ${
        isFavorite ? "text-red-500" : "text-white"
      } ${loading ? "opacity-50 cursor-not-allowed" : "hover:text-red-400"}`}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {loading ? "..." : isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
    </button>
  );
}
