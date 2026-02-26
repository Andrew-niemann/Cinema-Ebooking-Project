/* components/CardRow.tsx */

import Card from '@/components/Card';

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

export default function CardRow(props: { genre: string, movies?: Movie[] }) {
    return (
        <div className="m-4">
            <h1 className="text-[#ECDFCC] text-3xl m-2 overflow-hidden">{props.genre}</h1>
            <div className="flex overflow-hidden">
                {props.movies?.map((movie, index) => (
                    <Card key={index} movie={movie} />
                ))}
            </div>
        </div>
    )
}