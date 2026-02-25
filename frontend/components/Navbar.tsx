/* components/Navbar.tsx */
"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {

  /* PROTOTYPE: Default to false (not logged in) */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  /* PROTOTYPE: A function to fake the login/logout */
  const toggleAuth = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <nav className="flex justify-between items-center w-full p-4 bg-[#3C3D37] text-[#ECDFCC]">
      
      {/* Left Side Nav */}
      <div className="flex items-center gap-4">

        {/* Logo */}
        <div className="flex items-center justify-center">
            <svg className="w-10 h-10 text-[#ECDFCC]"
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor"  
            >
                <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                <path fillRule="evenodd"
                    d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clipRule="evenodd"
                />
            </svg>
        </div>

        {/* Website Name */}
        <Link className="text-xl font-bold tracking-wide hover:text-white transition-colors"
            href="/" 
        >
            MovieWebsite
        </Link>
    </div>

      {/* Right Side Nav */}
      <div className="flex items-center gap-4">
        {isLoggedIn ? (

            /* STATE A: User is Logged In */
            <div className="flex items-center gap-2">
                <span>Welcome, </span>

                {/* User Button */}
                <div className="relative">
                    <button className="bg-[#697565] hover:bg-white hover:text-[#1E201E] text-[#ECDFCC] px-4 py-2 rounded text-sm transition flex items-center gap-2"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)} /* Toggles the menu */
                    >
                        User
                    </button>

                    {/* User Button Dropdown Menu */}
                    {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-[#697565] rounded shadow-lg py-2 z-50">

                        <button className="block w-full text-left px-4 py-2 text-sm text-[#ECDFCC] duration-200 hover:bg-gray-100 hover:text-[#1E201E]"
                        onClick={() => {
                            toggleAuth();         /* Log out */
                            setIsDropdownOpen(false);
                        }}
                        >
                            Logout
                        </button>
                        
                        <button className="block w-full text-left px-4 py-2 text-sm text-[#ECDFCC] duration-200 hover:bg-gray-100 hover:text-[#1E201E]"
                        onClick={() => {
                            setIsDropdownOpen(false);
                        }}
                        >
                            Settings
                        </button>

                        <button className="block w-full text-left px-4 py-2 text-sm text-[#ECDFCC] duration-200 hover:bg-gray-100 hover:text-[#1E201E]"
                        onClick={() => {
                            setIsDropdownOpen(false);
                        }}
                        >
                            Profile
                        </button>

                    </div>
                    )}
                </div>
            </div>
            ) : (
                
            /* STATE B: User is NOT Logged In */
            <button className="bg-[#697565] hover:bg-white hover:text-[#1E201E] text-[#ECDFCC] px-4 py-2 rounded text-sm transition"
                onClick={toggleAuth}
            >
                Login
            </button>
            )}
        </div>
    </nav>
  );
}