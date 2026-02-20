/* components/Card.tsx */
import Link from 'next/link';
import Image from 'next/image';


export default function Card(){
    return (

        <div className="flex-col justify-center items-center m-2 duration-300 ease-in-out hover:scale-110">
            <Link href="/movie" className="shadow-lg">
            <Image
                src="/cats.jpg"
                alt="Movie Img"
                width={200}
                height={400}
            />
            </Link>
            <h3 className="text-[#697565]">Cats</h3>
        </div>




    )
}