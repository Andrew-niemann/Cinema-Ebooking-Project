/* components/Card.tsx */
import Link from 'next/link';
import Image from 'next/image';

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

export default function Card(props: { movie: Movie }) {
    return (

        <div className="w-[150px] bg-[#3C3D37] overflow-visible flex-col justify-center items-center m-2 duration-300 ease-in-out shadow transition hover:scale-110 hover:shadow-md">
            <Link href={`/movie/${props.movie.id}`}>
            <Image
                src={props.movie.posterUrl}
                alt={props.movie.title + " poster"}
                width="150"
                height="300"
            />
            </Link>
            <h3 className="text-[#ECDFCC]">{props.movie.title}</h3>
        </div>




    )
}