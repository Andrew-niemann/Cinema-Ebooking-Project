export interface Movie {
  id?: number;
  movieId?: number;
  title: string;
  posterUrl: string;
  description: string;
  genre: string;
  rating: string;
  status: string;
}

export interface IMovieService {
  getMovies(): Promise<Movie[]>;
}

class RealMovieService implements IMovieService {
  async getMovies(): Promise<Movie[]> {
    console.log("RealMovieService: Fetching movies from the backend...");
    const response = await fetch("http://localhost:8080/api/movies");
    
    if (!response.ok) {
      throw new Error("Failed to fetch movies from backend");
    }
    
    return await response.json();
  }
}

class ProxyMovieService implements IMovieService {
  private realMovieService: RealMovieService;
  private cachedMovies: Movie[] | null = null;
  private cacheTimestamp: number | null = null;
  
  private CACHE_DURATION_MS = 5 * 60 * 1000; 

  constructor() {
    this.realMovieService = new RealMovieService();
  }

  async getMovies(): Promise<Movie[]> {
    const now = Date.now();

    if (this.cachedMovies && this.cacheTimestamp && (now - this.cacheTimestamp < this.CACHE_DURATION_MS)) {
      console.log("ProxyMovieService: Returning cached movies instantly!");
      return this.cachedMovies;
    }

    console.log("ProxyMovieService: Cache empty or expired. Routing to Real Service...");
    const movies = await this.realMovieService.getMovies();
    
    this.cachedMovies = movies;
    this.cacheTimestamp = now;
    
    return movies;
  }
  
  // Optional: A method to manually clear the cache (useful for the Admin portal!)
  clearCache(): void {
      this.cachedMovies = null;
      this.cacheTimestamp = null;
  }
}

// Export a single instance to be used across your frontend
export const movieService = new ProxyMovieService();