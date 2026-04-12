/* app/admin/page.tsx */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPortal() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("movies");

  const [movieData, setMovieData] = useState({
    title: "",
    posterUrl: "",
    trailerUrl: "",
    genre: "",
    rating: "PG-13",
    description: "",
    status: "Currently Running"
  });
  const [movieFormMessage, setMovieFormMessage] = useState({ text: "", type: "" });
  const [isMovieLoading, setIsMovieLoading] = useState(false);

  const [moviesList, setMoviesList] = useState<any[]>([]);
  const [showtimeData, setShowtimeData] = useState({
    movieId: "",
    showroomId: "1",
    startTime: "12:00pm",
    showDate: ""
  });
  const [showtimeFormMessage, setShowtimeFormMessage] = useState({ text: "", type: "" });
  const [isShowtimeLoading, setIsShowtimeLoading] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
      router.push("/");
    } else {
      fetchMovies();
    }
  }, [router]);

  const fetchMovies = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/movies");
      if (response.ok) {
        const data = await response.json();
        setMoviesList(data);
      }
    } catch (error) {
      console.error("Failed to fetch movies list");
    }
  };

  const handleMovieChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setMovieData({ ...movieData, [e.target.name]: e.target.value });
  };

  const handleShowtimeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShowtimeData({ ...showtimeData, [e.target.name]: e.target.value });
  };

  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    setMovieFormMessage({ text: "", type: "" });

    if (!movieData.title || !movieData.description) {
      setMovieFormMessage({ text: "Please fill out the Title and Description.", type: "error" });
      return;
    }

    setIsMovieLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/admin/add-movie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(movieData)
      });

      if (response.ok) {
        setMovieFormMessage({ text: `Success! "${movieData.title}" added.`, type: "success" });
        setMovieData({ title: "", posterUrl: "", trailerUrl: "", genre: "", rating: "PG-13", description: "", status: "Currently Running" });
        fetchMovies();
      } else {
        const errorText = await response.text();
        setMovieFormMessage({ text: `Failed: ${errorText}`, type: "error" });
      }
    } catch (error) {
      setMovieFormMessage({ text: "Server error. Is the backend running?", type: "error" });
    } finally {
      setIsMovieLoading(false);
    }
  };

  const handleAddShowtime = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowtimeFormMessage({ text: "", type: "" });

    if (!showtimeData.movieId || !showtimeData.showDate) {
      setShowtimeFormMessage({ text: "Please select a movie and a date.", type: "error" });
      return;
    }

    const dateObj = new Date(showtimeData.showDate);
    const formattedDate = `${String(dateObj.getMonth() + 1).padStart(2, '0')}/${String(dateObj.getDate()).padStart(2, '0')}/${dateObj.getFullYear()}`;

    const payload = {
      movieId: Number(showtimeData.movieId),
      showroomId: Number(showtimeData.showroomId),
      startTime: showtimeData.startTime,
      showDate: formattedDate
    };

    setIsShowtimeLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/admin/create-showing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowtimeFormMessage({ text: "Showtime successfully scheduled!", type: "success" });
      } else {
        const errorText = await response.text();
        setShowtimeFormMessage({ text: `Failed (Possible Conflict): ${errorText}`, type: "error" });
      }
    } catch (error) {
      setShowtimeFormMessage({ text: "Server error. Is the backend running?", type: "error" });
    } finally {
      setIsShowtimeLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E201E] text-[#ECDFCC] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white">Admin Portal</h1>

        <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-600 pb-4">
          <button onClick={() => setActiveTab("movies")} className={`px-6 py-3 rounded-t-lg font-bold transition-colors ${activeTab === "movies" ? "bg-[#697565] text-white" : "bg-[#3C3D37] hover:bg-[#697565]"}`}>
            Manage Movies
          </button>
          <button onClick={() => setActiveTab("showtimes")} className={`px-6 py-3 rounded-t-lg font-bold transition-colors ${activeTab === "showtimes" ? "bg-[#697565] text-white" : "bg-[#3C3D37] hover:bg-[#697565]"}`}>
            Manage Showtimes
          </button>
          <button onClick={() => setActiveTab("promotions")} className={`px-6 py-3 rounded-t-lg font-bold transition-colors ${activeTab === "promotions" ? "bg-[#697565] text-white" : "bg-[#3C3D37] hover:bg-[#697565]"}`}>
            Manage Promotions
          </button>
          <button onClick={() => setActiveTab("users")} className={`px-6 py-3 rounded-t-lg font-bold transition-colors ${activeTab === "users" ? "bg-[#697565] text-white" : "bg-[#3C3D37] hover:bg-[#697565]"}`}>
            Manage Users
          </button>
        </div>

        <div className="bg-[#3C3D37] p-8 rounded-xl shadow-2xl border border-gray-600">
          
          {activeTab === "movies" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-500 pb-2">Add New Movie</h2>
              <form onSubmit={handleAddMovie} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold mb-1">Movie Title <span className="text-red-400">*</span></label>
                  <input type="text" name="title" value={movieData.title} onChange={handleMovieChange} className="w-full p-3 bg-[#ECDFCC] text-[#1E201E] rounded focus:ring-2 focus:ring-blue-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Genre</label>
                  <input type="text" name="genre" value={movieData.genre} onChange={handleMovieChange} className="w-full p-3 bg-[#ECDFCC] text-[#1E201E] rounded" placeholder="e.g. Sci-Fi" />
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-semibold mb-1">Rating</label>
                    <select name="rating" value={movieData.rating} onChange={handleMovieChange} className="w-full p-3 bg-[#ECDFCC] text-[#1E201E] rounded font-bold">
                      <option value="G">G</option><option value="PG">PG</option><option value="PG-13">PG-13</option><option value="R">R</option>
                    </select>
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-semibold mb-1">Status</label>
                    <select name="status" value={movieData.status} onChange={handleMovieChange} className="w-full p-3 bg-[#ECDFCC] text-[#1E201E] rounded font-bold">
                      <option value="Currently Running">Currently Running</option>
                      <option value="Coming Soon">Coming Soon</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Poster Image URL</label>
                  <input type="text" name="posterUrl" value={movieData.posterUrl} onChange={handleMovieChange} className="w-full p-3 bg-[#ECDFCC] text-[#1E201E] rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Trailer Video (Embed URL)</label>
                  <input type="text" name="trailerUrl" value={movieData.trailerUrl} onChange={handleMovieChange} className="w-full p-3 bg-[#ECDFCC] text-[#1E201E] rounded" placeholder="https://www.youtube.com/embed/..." />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold mb-1">Description <span className="text-red-400">*</span></label>
                  <textarea name="description" rows={4} value={movieData.description} onChange={handleMovieChange} className="w-full p-3 bg-[#ECDFCC] text-[#1E201E] rounded" />
                </div>
                <div className="col-span-1 md:col-span-2 mt-4">
                  <button type="submit" disabled={isMovieLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg disabled:opacity-50">
                    {isMovieLoading ? "Saving Movie..." : "Add Movie to Database"}
                  </button>
                  {movieFormMessage.text && <div className={`mt-4 p-4 rounded text-center font-bold ${movieFormMessage.type === "success" ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"}`}>{movieFormMessage.text}</div>}
                </div>
              </form>
            </div>
          )}

          {activeTab === "showtimes" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-500 pb-2">Schedule a Movie</h2>
              <form onSubmit={handleAddShowtime} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold mb-1">Select Movie <span className="text-red-400">*</span></label>
                  <select name="movieId" value={showtimeData.movieId} onChange={handleShowtimeChange} className="w-full p-3 bg-[#ECDFCC] text-[#1E201E] rounded font-bold">
                    <option value="" disabled>-- Select a Movie --</option>
                    {moviesList.map((movie: any) => (
                      <option key={movie.id || movie.movieId} value={movie.id || movie.movieId}>{movie.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Showroom <span className="text-red-400">*</span></label>
                  <select name="showroomId" value={showtimeData.showroomId} onChange={handleShowtimeChange} className="w-full p-3 bg-[#ECDFCC] text-[#1E201E] rounded font-bold">
                    <option value="1">Showroom 1</option>
                    <option value="2">Showroom 2</option>
                    <option value="3">Showroom 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Start Time <span className="text-red-400">*</span></label>
                  <select name="startTime" value={showtimeData.startTime} onChange={handleShowtimeChange} className="w-full p-3 bg-[#ECDFCC] text-[#1E201E] rounded font-bold">
                    <option value="12:00pm">12:00pm</option>
                    <option value="3:00pm">3:00pm</option>
                    <option value="6:00pm">6:00pm</option>
                    <option value="9:00pm">9:00pm</option>
                  </select>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold mb-1">Show Date <span className="text-red-400">*</span></label>
                  <input type="date" name="showDate" value={showtimeData.showDate} onChange={handleShowtimeChange} className="w-full p-3 bg-[#ECDFCC] text-[#1E201E] rounded" />
                </div>
                <div className="col-span-1 md:col-span-2 mt-4">
                  <button type="submit" disabled={isShowtimeLoading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg disabled:opacity-50">
                    {isShowtimeLoading ? "Scheduling..." : "Schedule Showtime"}
                  </button>
                  {showtimeFormMessage.text && <div className={`mt-4 p-4 rounded text-center font-bold ${showtimeFormMessage.type === "success" ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"}`}>{showtimeFormMessage.text}</div>}
                </div>
              </form>
            </div>
          )}

          {activeTab === "promotions" && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4 text-white">Manage Promotions</h2>
              <p className="text-gray-400">Promotions interface goes here.</p>
            </div>
          )}

          {activeTab === "users" && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4 text-white">Manage Users</h2>
              <p className="text-gray-400">User management interface goes here.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}