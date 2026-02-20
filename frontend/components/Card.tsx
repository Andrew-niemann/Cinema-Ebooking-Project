/* components/Card.tsx */
import Link from 'next/link';
import Image from 'next/image';


export default function Card(){
    return (

        <div className="bg-[#3C3D37] m-4 overflow-hidden flex-col justify-center items-center m-2 duration-300 ease-in-out shadow transition hover:scale-110 hover:shadow-md">
            <Link href="/movie">
            <Image
                src="/cats.jpg"
                alt="Movie Img"
                width={200}
                height={400}
            />
            </Link>
            <h3 className="text-[#ECDFCC]">Cats</h3>
        </div>




    )
}