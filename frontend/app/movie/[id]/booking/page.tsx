import { notFound } from 'next/navigation';
import Image from 'next/image';
import Seats from '@/components/Seats'; 

type Movie = {
    id: number;
    title: string;
    genre: string;
    status: string;
    description: string;
    posterUrl: string;
};

export default async function BookingPage({ 
    params,
    searchParams 
}: { 
    params: Promise<{ id: string }>;
    searchParams: Promise<{ date?: string; time?: string }>;
}) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    
    const { date, time } = resolvedSearchParams;

    const response = await fetch(`http://localhost:8080/api/movies`, { cache: 'no-store' });
    const list: Movie[] = await response.json();
    const movie = list.find((m) => m.id === parseInt(resolvedParams.id));

    if (!movie) return notFound(); 

    return (
        <main className="min-h-screen bg-[#1E201E] flex flex-col items-center p-8">
            
            {/* Header Section (Unchanged) */}
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-[#ECDFCC] mb-2">
                    Book Tickets
                </h1>
                <h2 className="text-3xl text-gray-400 mb-4">
                    {movie.title}
                </h2>
                
                {(date && time) ? (
                    <div className="inline-block bg-[#697565] text-white px-6 py-2 rounded-full text-xl font-bold tracking-wide shadow-md">
                        {date} @ {time}
                    </div>
                ) : (
                    <p className="text-red-400">Please go back and select a showtime.</p>
                )}
            </div>

            
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 w-full max-w-5xl justify-center">
                
                {/* Left Side: The Movie Poster Card */}
                <div className="bg-[#3C3D37] p-4 rounded-xl shadow-2xl shrink-0">
                    <Image
                        // Using the fallback just in case the database is missing a link
                        src={movie.posterUrl}
                        alt={`${movie.title} poster`}
                        width={260} 
                        height={390} 
                        className="object-contain rounded-lg shadow-inner"
                        priority
                    />
                </div>

                {/* Right Side: The Seats Component */}
                <div className="bg-[#3C3D37] p-8 rounded-xl shadow-2xl w-full max-w-xl">
                    <p className="text-gray-400 mb-6 font-semibold tracking-widest uppercase text-center border-b border-gray-600 pb-4">
                        Select your seats
                    </p>
                    <Seats />
                </div>

            </div>

        </main>
    );
}