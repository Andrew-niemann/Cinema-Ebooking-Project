import Link from 'next/dist/client/link';
import Showtimes from "@/components/Showtimes";
import FavoriteButton from "@/components/FavoriteButton";

// Defining the Movie type for better type safety
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

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
    
    const resolvedParams = await params;

    const response = await fetch(`http://localhost:8080/api/movies`, {
        cache: 'no-store'
    });
    const list = await response.json();
    
    // Get the movie from API response that matches the id from the URL parameters
    const movie = list.find((m: Movie) => m.id === parseInt(resolvedParams.id));

    if (!movie) {
        return (
            <div>Movie not found.
                <Link href="/">Go back to homepage</Link>
            </div>
        ) 
    }

    return (
        <main className="min-h-screen bg-[#1E201E] flex flex-col items-center justify-center p-8">
            <div className="w-full p-4 flex items-start justify-start">
                <Link href="/" className="text-[#ECDFCC] hover:text-[#C19A6B]">← Back to Homepage</Link>            
            </div>
            <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl text-[#ECDFCC]">{movie.title}</h1>
                <FavoriteButton movieId={movie.id} />
            </div>
            <div className="flex items-center justify-space-between gap-4 mb-4">
                <iframe className="w-[400px] h-[225px] mb-4" src={movie.trailerUrl}></iframe>
                <p className="w-[400px] h-[225px] text-lg text-[#ECDFCC] mb-2">Description: {movie.description}</p>
            </div>
            <p className="text-lg text-[#ECDFCC] mb-2">Genre: {movie.genre}</p>
            <p className="text-lg text-[#ECDFCC] mb-2">Rating: {movie.rating}</p>
            <p className="text-lg text-[#ECDFCC] mb-2">Status: {movie.status}</p>
            <div className="mt-6">
                <h3 className="text-xl text-[#ECDFCC] mb-3 font-semibold">Select Showtime:</h3>
                <Showtimes rawShowings={movie.showings} movieId={movie.id} />
            </div>
        </main>
    )
}