/* app/profile/page.tsx */
"use client";

import { useState, useEffect } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  // Fetch user info when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8080/api/user/info", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setFormData({
          name: data.name,
          email: data.email,
          role: data.role,
        });
      })
      .catch((err) => console.error("Failed to fetch user info:", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:8080/api/user/update/${user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update user");

      const updatedUser = await res.json();
      setUser(updatedUser);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating profile. Try again later.");
    }
  };

  return (
    <main className="min-h-screen bg-[#1E201E] flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl text-[#ECDFCC] font-bold mb-4">My Profile</h1>

      <button
        onClick={() => setShowCard(!showCard)}
        className="bg-[#697565] text-[#ECDFCC] px-6 py-2 rounded-full font-semibold mb-6 hover:bg-white hover:text-[#1E201E] transition-colors"
      >
        {showCard ? "Hide Account Info" : "Show Account Info"}
      </button>

      {showCard && user && (
        <div className="bg-[#3C3D37] p-6 rounded-xl shadow-2xl w-full max-w-md flex flex-col gap-4">
          
          <label className="text-gray-300 font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            readOnly={!editMode}
            className={`p-2 rounded text-black w-full ${editMode ? "bg-white" : "bg-gray-400"} `}
          />

          <label className="text-gray-300 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            readOnly={!editMode}
            className={`p-2 rounded text-black w-full ${editMode ? "bg-white" : "bg-gray-400"} `}
          />

          <label className="text-gray-300 font-semibold">Role</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            readOnly
            className="p-2 rounded text-black w-full bg-gray-400"
          />

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
    </main>
  );
}