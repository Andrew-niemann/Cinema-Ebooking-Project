import Link from 'next/link';
import Showtimes from "@/components/Showtimes";
import FavoriteButton from "@/components/FavoriteButton";

type Movie = {
    id: number;
    title: string;
    posterUrl: string;
    trailerUrl: string;
    genre: string;
    rating: string;
    description: string;
    status: string;
};

export default async function MoviePage({
    params
}: {
    params: Promise<{ id: string }>;
}) {

    const { id } = await params;

    const response = await fetch(`http://localhost:8080/api/movies`, {
        cache: "no-store"
    });

    const movies: Movie[] = await response.json();

    const movie = movies.find(
        (m) => m.id === parseInt(id)
    );

    if (!movie) {
        return (
            <div className="text-white p-8">
                Movie not found.
                <Link href="/" className="block mt-4 text-blue-400">
                    Back to homepage
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#1E201E] flex flex-col items-center p-8">

            {/* Back */}
            <div className="w-full flex justify-start mb-4">
                <Link href="/" className="text-[#ECDFCC] hover:text-[#C19A6B]">
                    ← Back to Homepage
                </Link>
            </div>

            {/* Title */}
            <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl text-[#ECDFCC]">
                    {movie.title}
                </h1>
                <FavoriteButton movieId={movie.id} />
            </div>

            {/* Content */}
            <div className="flex gap-4 mb-6">
                <iframe
                    className="w-[400px] h-[225px]"
                    src={movie.trailerUrl}
                />
                <p className="w-[400px] text-[#ECDFCC]">
                    {movie.description}
                </p>
            </div>

            <p className="text-[#ECDFCC]">Genre: {movie.genre}</p>
            <p className="text-[#ECDFCC]">Rating: {movie.rating}</p>
            <p className="text-[#ECDFCC]">Status: {movie.status}</p>

            {/* Showtimes */}
            <Showtimes movieId={movie.id} />
        </main>
    );
}