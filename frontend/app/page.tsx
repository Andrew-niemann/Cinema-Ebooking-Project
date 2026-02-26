import CardRow from '@/components/CardRow';
import Search from '@/components/Search';

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


export default async function Home() {
  
  const response = await fetch('http://localhost:8080/api/movies', { 
      cache: 'no-store' 
  });

  // Parse the JSON response into an array of Movie objects
  const movies: Movie[] = await response.json();

  // Filter movies by genre
  const currentlyShowingMovies = movies.filter(movie => movie.status.includes('Currently Running'));
  const comingSoonMovies = movies.filter(movie => movie.status.includes('Coming Soon'));
  const crimeMovies = movies.filter(movie => movie.genre.includes('Crime'));
  const dramaMovies = movies.filter(movie => movie.genre.includes('Drama'));
  const actionMovies = movies.filter(movie => movie.genre.includes('Action'));
  const adventureMovies = movies.filter(movie => movie.genre.includes('Adventure'));
  const fantasyMovies = movies.filter(movie => movie.genre.includes('Fantasy'));
  const romanceMovies = movies.filter(movie => movie.genre.includes('Romance'));
  const sciFiMovies = movies.filter(movie => movie.genre.includes('Sci-Fi'));
  const animationMovies = movies.filter(movie => movie.genre.includes('Animation'));
  
  // Return homepage with movie data
  return (
    <main className="min-h-screen bg-[#1E201E] flex-column items-center justify-center p-8">
      
      <Search />
      <CardRow genre="Currently Showing" movies={currentlyShowingMovies}/>
      <CardRow genre="Coming Soon" movies={comingSoonMovies}/>
      <CardRow genre="Crime" movies={crimeMovies}/>
      <CardRow genre="Drama" movies={dramaMovies}/>
      <CardRow genre="Action" movies={actionMovies}/>
      <CardRow genre="Adventure" movies={adventureMovies}/>
      <CardRow genre="Fantasy" movies={fantasyMovies}/>
      <CardRow genre="Romance" movies={romanceMovies}/>
      <CardRow genre="Sci-Fi" movies={sciFiMovies}/>
      <CardRow genre="Animation" movies={animationMovies}/>

    </main>
  );
}
