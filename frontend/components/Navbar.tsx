/* components/Navbar.tsx */
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  /* Auth State */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");

  /* Dropdown States */
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);

  /* Form Data States */
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  /* Reset Password Flow States */
  const [resetStep, setResetStep] = useState(0); 
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  /* Check if the user is already logged in when the page loads */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
        setIsLoggedIn(true);
        if (role) setUserRole(role);
    }
  }, []);

  /* LOGIN FETCH */
  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
        setLoginMessage("Please enter email and password.");
        return;
    }

    setLoginMessage("Authenticating...");

    try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: loginEmail, password: loginPassword })
        });

        const rawText = await response.text();
        
        // Parse it into JSON if it exists
        let data: any = {};
        if (rawText) {
            try {
                data = JSON.parse(rawText);
            } catch (parseError) {
                console.warn("Backend did not return JSON. Raw response:", rawText);
            }
        }

        // Handle the response based on the HTTP status code
        if (response.ok) {
            // Success!
            localStorage.setItem("token", data.token || "");
            localStorage.setItem("role", data.role || "");
            localStorage.setItem("email", data.email || loginEmail);

            setIsLoggedIn(true);
            setUserRole(data.role || "");
            setIsLoginDropdownOpen(false); 
            
            setLoginPassword("");
            setLoginEmail("");
            setLoginMessage("");

            if (data.role === "ADMIN") {
                router.push("/admin"); 
            } else {
                router.push("/profile"); 
            }
            
        } else {
            setLoginMessage(data.message || rawText || "Invalid email or password.");
        }
    } catch (error) {
        console.error("Login error:", error);
        setLoginMessage("Server error. Is the backend running?");
    }
  };

  /* LOGOUT FUNCTION */
  const handleLogout = () => {
    // Destroy the token to completely cut off API access
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");

    // Reset UI
    setIsLoggedIn(false);
    setUserRole("");
    setIsDropdownOpen(false);

    // Kick them back to the home page
    router.push("/");
  };

  /* Request Password Reset */
  const handleForgotPassword = async () => {
    if (!loginEmail) {
        setLoginMessage("Please enter your email above first.");
        return;
    }
    setLoginMessage("Sending...");
    try {
        const response = await fetch('http://localhost:8080/api/auth/password-reset-request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: loginEmail })
        });
        if (response.ok) {
            setLoginMessage("Code sent! Check your email.");
            setResetStep(1); 
        } else {
            setLoginMessage("Failed to send reset link.");
        }
    } catch (error) {
        setLoginMessage("Server error. Is the backend running?");
    }
  };

  /* Verify and Change Password */
  const handleResetVerification = async () => {
    if (newPassword.length < 6) {
        setLoginMessage("New password must be at least 6 characters.");
        return;
    }
    if (!resetCode) {
        setLoginMessage("Please enter the verification code.");
        return;
    }
    setLoginMessage("Verifying...");
    try {
        const response = await fetch('http://localhost:8080/api/auth/password-reset-verification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: loginEmail, code: resetCode, newPassword })
        });
        if (response.ok) {
            setLoginMessage("Password updated! Please log in.");
            setResetStep(0);
            setResetCode("");
            setNewPassword("");
            setLoginPassword(""); 
        } else {
            setLoginMessage("Verification failed. Invalid code?");
        }
    } catch (error) {
        setLoginMessage("Server error.");
    }
  };

  return (
    <nav className="flex justify-between items-center w-full p-4 bg-[#3C3D37] text-[#ECDFCC]">
      
      {/* Left Side Nav */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center justify-center">
            <svg className="w-10 h-10 text-[#ECDFCC]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
        </div>
        <Link className="text-xl font-bold tracking-wide hover:text-white transition-colors" href="/" >
            MovieWebsite
        </Link>
    </div>

      {/* Right Side Nav */}
      <div className="flex items-center gap-4">
        {isLoggedIn ? (

            /* STATE A: User is Logged In */
            <div className="flex items-center gap-2">
                
                <span className="text-sm font-semibold text-gray-400">[{userRole}]</span>
                <span>Welcome!</span>

                <div className="relative">
                    <button className="bg-[#697565] hover:bg-white hover:text-[#1E201E] text-[#ECDFCC] px-4 py-2 rounded text-sm transition flex items-center gap-2"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        User
                    </button>

                    {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-[#697565] rounded shadow-lg py-2 z-50 border border-gray-500">
                        
                        {/* NEW: ONLY SHOW IF ADMIN */}
                        {userRole === "ADMIN" && (
                            <button 
                                className="block w-full text-left px-4 py-2 text-sm font-bold text-blue-300 duration-200 hover:bg-gray-100 hover:text-[#1E201E]" 
                                onClick={() => { setIsDropdownOpen(false); router.push('/admin'); }}
                            >
                                Admin Portal
                            </button>
                        )}

                        <button 
                            className="block w-full text-left px-4 py-2 text-sm text-[#ECDFCC] duration-200 hover:bg-gray-100 hover:text-[#1E201E]" 
                            onClick={() => { setIsDropdownOpen(false); router.push('/profile'); }}
                        >
                            Profile
                        </button>
                        
                        <button 
                            className="block w-full text-left px-4 py-2 text-sm text-[#ECDFCC] duration-200 hover:bg-gray-100 hover:text-[#1E201E]" 
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            Settings
                        </button>
                        
                        {/* Divider Line */}
                        <div className="border-t border-gray-500 my-1"></div>

                        {/* THE REAL LOGOUT BUTTON */}
                        <button 
                            className="block w-full text-left px-4 py-2 text-sm text-[#ECDFCC] duration-200 hover:bg-red-500 hover:text-white" 
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                    )}
                </div>
            </div>
            ) : (
                
            /* STATE B: User is NOT Logged In */
            <div className="relative">
                <button className="bg-[#697565] hover:bg-white hover:text-[#1E201E] text-[#ECDFCC] px-4 py-2 rounded text-sm transition"
                    onClick={() => {
                        setIsLoginDropdownOpen(!isLoginDropdownOpen);
                        setLoginMessage(""); 
                        setResetStep(0);     
                    }}
                >
                    Login
                </button>

                {/* Login Dropdown Menu */}
                {isLoginDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-[#697565] rounded shadow-lg p-4 z-50 flex flex-col gap-3 border border-gray-500">
                        
                        <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                            readOnly={resetStep === 1}
                            className={`w-full p-2 bg-[#ECDFCC] text-[#1E201E] rounded focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-600 ${resetStep === 1 ? 'opacity-70 cursor-not-allowed' : ''}`}
                        />
                        
                        {resetStep === 0 ? (
                            <>
                                <div>
                                    <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                                        className="w-full p-2 bg-[#ECDFCC] text-[#1E201E] rounded focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-600"
                                    />
                                    <div className="flex justify-end mt-1">
                                        <button onClick={handleForgotPassword} className="text-xs text-[#ECDFCC] hover:text-white hover:underline transition-colors">
                                            Forgot Password?
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Login Button */}
                                <button className="w-full bg-[#3C3D37] hover:bg-[#1E201E] text-white py-2 rounded transition-colors font-semibold mt-1"
                                    onClick={handleLogin}
                                >
                                    Sign In
                                </button>
                            </>
                        ) : (
                            <>
                                <input type="text" placeholder="Verification Code" value={resetCode} onChange={(e) => setResetCode(e.target.value)}
                                    className="w-full p-2 bg-[#ECDFCC] text-[#1E201E] rounded focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-600" />
                                <input type="password" placeholder="New Password (min 6 chars)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full p-2 bg-[#ECDFCC] text-[#1E201E] rounded focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-600" />
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors font-semibold mt-1" onClick={handleResetVerification}>
                                    Update Password
                                </button>
                                <button className="w-full bg-transparent border border-gray-400 hover:bg-gray-500 text-white py-1 rounded transition-colors text-sm mt-1"
                                    onClick={() => { setResetStep(0); setLoginMessage(""); }}>
                                    Back to Login
                                </button>
                            </>
                        )}

                        {loginMessage && (
                            <div className={`text-xs text-center font-bold mt-1 ${loginMessage.includes("sent") || loginMessage.includes("successfully") ? "text-green-300" : "text-red-300"}`}>
                                {loginMessage}
                            </div>
                        )}

                        {resetStep === 0 && (
                            <div className="text-center text-sm text-[#ECDFCC] mt-2 border-t border-gray-500 pt-3">
                                Don't have an account? <br/>
                                <Link href="/register" className="font-bold hover:text-white hover:underline transition-colors" onClick={() => setIsLoginDropdownOpen(false)}>
                                    Register here
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
            )}
        </div>
    </nav>
  );
}