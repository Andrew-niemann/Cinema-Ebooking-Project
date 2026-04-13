import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
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
    searchParams: Promise<{
        showingId?: string;
        date?: string;
        time?: string;
    }>;
}) {

    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    const { showingId, date, time } = resolvedSearchParams;

    const response = await fetch(`http://localhost:8080/api/movies`, {
        cache: 'no-store'
    });

    const list: Movie[] = await response.json();

    const movie = list.find(
        (m) => m.id === parseInt(resolvedParams.id)
    );

    if (!movie) return notFound();

    return (
        <main className="min-h-screen bg-[#1E201E] flex flex-col items-center p-8">

            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-[#ECDFCC]">
                    Book Tickets
                </h1>

                <h2 className="text-3xl text-gray-400 mt-2">
                    {movie.title}
                </h2>

                {showingId && date && time ? (
                    <div className="mt-4 inline-block bg-[#697565] text-white px-6 py-2 rounded-full text-xl font-bold">
                        {date} @ {time}
                    </div>
                ) : (
                    <p className="text-red-400 mt-4">
                        Please go back and select a showtime.
                    </p>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-12 items-center">

                {/* Poster */}
                <div className="bg-[#3C3D37] p-4 rounded-xl">
                    <Image
                        src={movie.posterUrl}
                        alt={movie.title}
                        width={260}
                        height={390}
                        className="rounded-lg"
                        priority
                    />
                </div>

                {/* Seats */}
                <div className="bg-[#3C3D37] p-8 rounded-xl w-full max-w-xl">
                    <p className="text-gray-400 mb-4 text-center border-b pb-4">
                        Select your seats
                    </p>

                    <Seats />

                    <Link href="/checkout">
                        <button className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg">
                            Proceed to Checkout
                        </button>
                    </Link>
                </div>
            </div>
        </main>
    );
}