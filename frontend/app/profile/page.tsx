"use client";

import { useState, useEffect } from "react";
import CardRow from "@/components/CardRow";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  cards?: {
    digits?: string;
    expirationMonth?: string;
    expirationYear?: string;
    cvv?: string;
    id?: string;
  }[];
  favorites?: { id: number }[];
};

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

type Ticket = {
  seatNumber: string;
  ticketType: string;
  price: number;
};

type Booking = {
  bookingId: number;
  movieTitle: string;
  showDate: string;
  showTime: string;
  numberOfTickets: number;
  totalPrice: number;
  status: string;
  tickets: Ticket[];
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    oldPassword: "",
    newPassword: "",
    cards: [] as {
      digits: string;
      expirationMonth: string;
      expirationYear: string;
      cvv: string;
      id?: string;
    }[],
  });

  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch user info
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8080/api/user/info", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data: User) => {
        setUser(data);
        setFormData({
          name: data.name || "",
          phone: data.phone || "",
          street: data.address?.street || "",
          city: data.address?.city || "",
          state: data.address?.state || "",
          zip: data.address?.zip || "",
          oldPassword: "",
          newPassword: "",
          cards:
            data.cards && data.cards.length > 0
              ? data.cards.map((c) => ({
                  digits: c.digits || "",
                  expirationMonth: c.expirationMonth || "",
                  expirationYear: c.expirationYear || "",
                  cvv: c.cvv || "",
                  id: c.id,
                }))
              : [],
        });

        if (data.favorites && Array.isArray(data.favorites)) {
          const favIds = data.favorites.map((m) => m.id);
          setFavorites(favIds);
        }
      })
      .catch((err) => console.error("Failed to fetch user info:", err));
  }, [token]);

  // Fetch favorite movies
  useEffect(() => {
    if (favorites.length === 0) return;

    fetch("http://localhost:8080/api/movies", { cache: "no-store" })
      .then((res) => res.json())
      .then((movies: Movie[]) => {
        const favMovies = movies.filter((movie) => favorites.includes(movie.id));
        setFavoriteMovies(favMovies);
      })
      .catch((err) => console.error("Failed to fetch movies:", err));
  }, [favorites]);

  // Fetch user bookings
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8080/api/bookings/my-bookings", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data: Booking[]) => {
        setBookings(data);
      })
      .catch((err) => console.error("Failed to fetch bookings:", err));
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCardChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
    field: "digits" | "expirationMonth" | "expirationYear" | "cvv"
  ) => {
    const updatedCards = [...formData.cards];
    updatedCards[idx][field] = e.target.value;
    setFormData((prev) => ({ ...prev, cards: updatedCards }));
  };

  const addCard = () => {
    if (formData.cards.length >= 3) return; // Max 3 cards
    setFormData((prev) => ({
      ...prev,
      cards: [...prev.cards, { digits: "", expirationMonth: "", expirationYear: "", cvv: "" }],
    }));
  };

  const handleSave = async () => {
    if (!token || !user) return;

    // Only send one card at a time
    let cardToSend = null;
    if (formData.cards.length > 0) {
      const lastCard = formData.cards[formData.cards.length - 1]; // take the last added card
      if (lastCard.digits) {
        cardToSend = { ...lastCard };
      }
    }

    const updateData: any = {};

    if (formData.name && formData.name !== user.name) updateData.name = formData.name;
    if (formData.phone && formData.phone !== user.phone) updateData.phone = formData.phone;

    if (formData.street || formData.city || formData.state || formData.zip) {
      updateData.address = {
        ...(formData.street && { street: formData.street }),
        ...(formData.city && { city: formData.city }),
        ...(formData.state && { state: formData.state }),
        ...(formData.zip && { zip: formData.zip }),
      };
    }

    if (formData.newPassword) {
      if (!formData.oldPassword) {
        alert("You must enter your old password to set a new password.");
        return;
      }
      updateData.oldPassword = formData.oldPassword;
      updateData.newPassword = formData.newPassword;
    }

    if (cardToSend) {
      updateData.card = cardToSend;
    }

    try {
      const res = await fetch("http://localhost:8080/api/user/update-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        alert("Failed to update profile. Incorrect password or invalid input.");
        return;
      }

      const updatedUser = await res.json();
      setUser(updatedUser);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Network error:", err);
      alert("Server error. Make sure your backend is running.");
    }
  };

  const onToggleFavorite = async (movieId: number) => {
    if (!token) return;

    try {
      await fetch(`http://localhost:8080/api/user/remove-favorite?movieId=${movieId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const newFavs = favorites.filter((id) => id !== movieId);
      setFavorites(newFavs);
      setFavoriteMovies(favoriteMovies.filter((movie) => movie.id !== movieId));
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!token) return;

    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/bookings/delete-booking/${bookingId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        // Remove the cancelled booking from state
        setBookings(bookings.filter(booking => booking.bookingId !== bookingId));
        alert("Booking cancelled successfully!");
      } else {
        alert("Failed to cancel booking. It may not exist or you may not have permission.");
      }
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      alert("Server error. Make sure your backend is running.");
    }
  };

  return (
    <main className="min-h-screen bg-[#1E201E] flex flex-col items-center justify-start p-8 gap-8">
      <h1 className="text-4xl text-[#ECDFCC] font-bold mb-4">My Profile</h1>

      <button
        onClick={() => setShowCard(!showCard)}
        className="bg-[#697565] text-[#ECDFCC] px-6 py-2 rounded-full font-semibold mb-6 hover:bg-white hover:text-[#1E201E] transition-colors"
      >
        {showCard ? "Hide Account Info" : "Show Account Info"}
      </button>

      {showCard && user && (
        <div className="bg-[#3C3D37] p-6 rounded-xl shadow-2xl w-full max-w-md flex flex-col gap-4">
          {/* Email (read-only) */}
          <label className="text-gray-300 font-semibold">Email</label>
          <input
            type="email"
            value={user.email}
            readOnly
            className="p-2 rounded text-black w-full bg-gray-200 cursor-not-allowed"
          />

          {/* Name */}
          <label className="text-gray-300 font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            readOnly={!editMode}
            className={`p-2 rounded text-black w-full ${editMode ? "bg-white" : "bg-gray-400"}`}
          />

          {/* Phone */}
          <label className="text-gray-300 font-semibold">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            readOnly={!editMode}
            className={`p-2 rounded text-black w-full ${editMode ? "bg-white" : "bg-gray-400"}`}
          />

          {/* Address */}
          <label className="text-gray-300 font-semibold">Address</label>
          <input
            type="text"
            name="street"
            placeholder="Street"
            value={formData.street}
            onChange={handleChange}
            readOnly={!editMode}
            className={`p-2 rounded text-black w-full ${editMode ? "bg-white" : "bg-gray-400"}`}
          />
          <div className="flex gap-2">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              readOnly={!editMode}
              className={`p-2 w-1/2 rounded text-black ${editMode ? "bg-white" : "bg-gray-400"}`}
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              readOnly={!editMode}
              className={`p-2 w-1/4 rounded text-black ${editMode ? "bg-white" : "bg-gray-400"}`}
            />
            <input
              type="text"
              name="zip"
              placeholder="Zip"
              value={formData.zip}
              onChange={handleChange}
              readOnly={!editMode}
              className={`p-2 w-1/4 rounded text-black ${editMode ? "bg-white" : "bg-gray-400"}`}
            />
          </div>

          {/* Password Change */}
          <label className="text-gray-300 font-semibold">New Password</label>
          <input
            type="password"
            name="newPassword"
            placeholder="New password"
            value={formData.newPassword}
            onChange={handleChange}
            readOnly={!editMode}
            className={`p-2 rounded text-black w-full ${editMode ? "bg-white" : "bg-gray-400"}`}
          />
          <label className="text-gray-300 font-semibold">Old Password (required for password change)</label>
          <input
            type="password"
            name="oldPassword"
            placeholder="Old password"
            value={formData.oldPassword}
            onChange={handleChange}
            readOnly={!editMode}
            className={`p-2 rounded text-black w-full ${editMode ? "bg-white" : "bg-gray-400"}`}
          />

          {/* Payment Cards */}
          <label className="text-gray-300 font-semibold">Cards</label>
          {formData.cards.map((card, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Card Digits"
                value={card.digits}
                onChange={(e) => handleCardChange(e, idx, "digits")}
                readOnly={!editMode}
                className={`p-2 rounded text-black w-full sm:w-1/2 text-lg font-mono placeholder-gray-400 ${editMode ? "bg-white" : "bg-gray-400"}`}
                maxLength={19}
              />
              <input
                type="text"
                placeholder="Exp Month"
                value={card.expirationMonth}
                onChange={(e) => handleCardChange(e, idx, "expirationMonth")}
                readOnly={!editMode}
                className={`p-2 rounded text-black w-1/6 text-lg placeholder-gray-400 ${editMode ? "bg-white" : "bg-gray-400"}`}
                maxLength={2}
              />
              <input
                type="text"
                placeholder="Exp Year"
                value={card.expirationYear}
                onChange={(e) => handleCardChange(e, idx, "expirationYear")}
                readOnly={!editMode}
                className={`p-2 rounded text-black w-1/6 text-lg placeholder-gray-400 ${editMode ? "bg-white" : "bg-gray-400"}`}
                maxLength={4}
              />
              <input
                type="text"
                placeholder="CVV"
                value={card.cvv}
                onChange={(e) => handleCardChange(e, idx, "cvv")}
                readOnly={!editMode}
                className={`p-2 rounded text-black w-1/6 text-lg placeholder-gray-400 ${editMode ? "bg-white" : "bg-gray-400"}`}
                maxLength={4}
              />
            </div>
          ))}
          {editMode && formData.cards.length < 3 && (
            <button
              onClick={addCard}
              className="bg-green-500 text-white px-4 py-2 rounded mb-2 hover:bg-green-600 transition-colors"
            >
              Add Card
            </button>
          )}

          {/* Change Info */}
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-[#697565] text-[#ECDFCC] px-6 py-2 rounded-full font-semibold mt-4 hover:bg-white hover:text-[#1E201E] transition-colors"
            >
              Change Info
            </button>
          ) : (
            <div className="flex justify-between mt-4">
              <button
                onClick={handleSave}
                className="bg-[#697565] text-[#ECDFCC] px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-[#1E201E] transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Favorite Movies */}
      <div className="w-full max-w-6xl">
        <h2 className="text-3xl text-[#ECDFCC] mb-4">My Favorite Movies</h2>
        {favoriteMovies.length > 0 ? (
          <CardRow
            genre=""
            movies={favoriteMovies}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
          />
        ) : (
          <p className="text-[#ECDFCC]">You have not favorited any movies yet.</p>
        )}
      </div>

      {/* My Bookings */}
      <div className="w-full max-w-6xl">
        <h2 className="text-3xl text-[#ECDFCC] mb-4">My Bookings</h2>
        {bookings.length > 0 ? (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <div key={booking.bookingId} className="bg-[#3C3D37] p-6 rounded-xl shadow-2xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#ECDFCC] mb-2">{booking.movieTitle}</h3>
                    <p className="text-[#ECDFCC] mb-1">
                      <span className="font-semibold">Date:</span> {booking.showDate}
                    </p>
                    <p className="text-[#ECDFCC] mb-1">
                      <span className="font-semibold">Time:</span> {booking.showTime}
                    </p>
                    <p className="text-[#ECDFCC] mb-1">
                      <span className="font-semibold">Tickets:</span> {booking.numberOfTickets}
                    </p>
                    <p className="text-[#ECDFCC] mb-3">
                      <span className="font-semibold">Total Price:</span> ${booking.totalPrice.toFixed(2)}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {booking.tickets.map((ticket, idx) => (
                        <span key={idx} className="bg-[#697565] text-[#ECDFCC] px-3 py-1 rounded-full text-sm">
                          {ticket.seatNumber} ({ticket.ticketType})
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      booking.status === 'CONFIRMED' ? 'bg-green-600 text-white' :
                      booking.status === 'CANCELLED' ? 'bg-red-600 text-white' :
                      'bg-yellow-600 text-white'
                    }`}>
                      {booking.status}
                    </span>
                    {booking.status !== 'CANCELLED' && (
                      <button
                        onClick={() => handleCancelBooking(booking.bookingId)}
                        className="block mt-2 bg-red-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-600 transition-colors text-sm"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#ECDFCC]">You have no bookings yet.</p>
        )}
      </div>
    </main>
  );
}