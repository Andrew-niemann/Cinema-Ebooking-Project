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

type CardRowProps = {
  genre: string;
  movies?: Movie[];
  favorites: number[];
  onToggleFavorite: (movieId: number) => void;
};

export default function CardRow({ genre, movies, favorites, onToggleFavorite }: CardRowProps) {
  return (
    <div className="m-4">
      <h1 className="text-[#ECDFCC] text-3xl m-2 overflow-hidden">{genre}</h1>
      <div className="flex overflow-hidden">
        {movies?.map((movie) => (
          <Card
            key={movie.id}
            movie={movie}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}