/* components/Navbar.tsx */
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const RESERVATION_DURATION_MS = 5 * 60 * 1000;

type CheckoutData = {
    movieId?: number;
    showingId?: number;
    selectedSeats: Record<string, string>;
    bookingId?: number;
    reservationExpiresAt?: number;
    date?: string;
    time?: string;
    email?: string;
};

type ShowSeat = {
    id: number;
    seatIdentifier: string;
};

type BookingResponse = {
    success?: boolean;
    message?: string;
    bookingId?: number;
    id?: number;
};

const getAuthHeader = (token: string) => {
    const trimmedToken = token.trim();
    return trimmedToken.startsWith("Bearer ") ? trimmedToken : `Bearer ${trimmedToken}`;
};

const reserveCheckoutSeats = async (checkoutData: CheckoutData, token: string) => {
    if (!checkoutData.showingId || checkoutData.bookingId) return checkoutData;

    const seatsResponse = await fetch(`http://localhost:8080/api/showSeats/get-showSeats/${checkoutData.showingId}`);
    const seatsData = await seatsResponse.json();
    const showSeats: ShowSeat[] = Array.isArray(seatsData?.showSeats) ? seatsData.showSeats : [];

    const seats = Object.entries(checkoutData.selectedSeats).map(([seatId, type]) => {
        const seat = showSeats.find(showSeat => showSeat.seatIdentifier === seatId);
        if (!seat) {
            throw new Error(`Seat ${seatId} is no longer available.`);
        }

        return {
            showSeatId: seat.id,
            ticketType: type.toUpperCase()
        };
    });

    const response = await fetch("http://localhost:8080/api/bookings/create-booking", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: getAuthHeader(token)
        },
        body: JSON.stringify({
            showId: checkoutData.showingId,
            seats
        })
    });

    const data: BookingResponse = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {
        throw new Error(data.message || "Unable to reserve those seats. Please choose again.");
    }

    return {
        ...checkoutData,
        bookingId: data.bookingId ?? data.id,
        reservationExpiresAt: Date.now() + RESERVATION_DURATION_MS
    };
};

export default function Navbar() {
  const router = useRouter();

  /* Auth State */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("User"); // NEW: Track the user's name

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

  /* NEW: Verification Modal States */
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  /* Check if the user is already logged in when the page loads */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name"); // NEW: Check for name
    if (token) {
        setIsLoggedIn(true);
        if (role) setUserRole(role);
        if (name) setUserName(name);
    }
  }, []);

  /* Listen for open login dropdown event */
  useEffect(() => {
    const handleOpenLogin = () => {
      setIsLoginDropdownOpen(true);
    };
    window.addEventListener('openLoginDropdown', handleOpenLogin);
    return () => window.removeEventListener('openLoginDropdown', handleOpenLogin);
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
        
        let data: any = {};
        if (rawText) {
            try {
                data = JSON.parse(rawText);
            } catch (parseError) {
                console.warn("Backend did not return JSON. Raw response:", rawText);
            }
        }

        if (response.ok) {
            // Success! Grab name or fallback to email prefix
            const displayName = data.name || (data.email ? data.email.split('@')[0] : "User");

            localStorage.setItem("token", data.token || "");
            localStorage.setItem("role", data.role || "");
            localStorage.setItem("email", data.email || loginEmail);
            localStorage.setItem("name", displayName);

            setIsLoggedIn(true);
            setUserRole(data.role || "");
            setUserName(displayName);
            setIsLoginDropdownOpen(false); 
            
            setLoginPassword("");
            setLoginMessage("");

            // Check if user was in the middle of checkout
            const checkoutData = localStorage.getItem("checkoutData");
            const loginForCheckout = localStorage.getItem("loginForCheckout") === "true";
            if (checkoutData && loginForCheckout) {
                try {
                    const reservedCheckoutData = await reserveCheckoutSeats(JSON.parse(checkoutData), data.token || "");
                    localStorage.setItem("checkoutData", JSON.stringify(reservedCheckoutData));
                    localStorage.removeItem("loginForCheckout");

                    if (typeof window !== "undefined" && window.location.pathname === "/order-summary") {
                        window.location.reload();
                        return;
                    }

                    router.push("/order-summary");
                } catch (error: unknown) {
                    localStorage.removeItem("loginForCheckout");
                    setLoginMessage(error instanceof Error ? error.message : "Unable to reserve those seats. Please choose again.");
                }
                return;
            }

            if (data.role === "ADMIN") {
                router.push("/admin"); 
            } else {
                router.push("/profile"); 
            }
            
        } else {
            const errorMessage = data.message || rawText || "";

            // Check if account is inactive
            if (errorMessage.toLowerCase().includes("inactive") || errorMessage.toLowerCase().includes("not verified")) {
                setIsLoginDropdownOpen(false); 
                setShowVerification(true);     
                setModalMessage("Sending a new verification code...");

                try {
                    await fetch('http://localhost:8080/api/auth/resend-code', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: loginEmail })
                    });
                    setModalMessage("Account inactive. A new code was sent to your email!");
                } catch (resendError) {
                    setModalMessage("Account inactive, but failed to resend code.");
                }

            } else {
                setLoginMessage(errorMessage || "Invalid email or password.");
            }
        }
    } catch (error) {
        console.error("Login error:", error);
        setLoginMessage("Server error. Is the backend running?");
    }
  };

  /* VERIFY ACCOUNT FETCH */
  const handleVerify = async () => {
    if (!loginEmail) {
        setModalMessage("Please enter your email.");
        return;
    }
    if (!verificationCode) {
        setModalMessage("Please enter the code.");
        return;
    }
    setModalMessage("Verifying...");

    try {
        const response = await fetch('http://localhost:8080/api/auth/verify-registration', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: loginEmail, code: verificationCode })
        });

        if (response.ok) {
            setModalMessage("Account verified! You can now log in.");
            setTimeout(() => {
                setShowVerification(false);
                setIsLoginDropdownOpen(true);
                setVerificationCode("");
                setModalMessage("");
            }, 2000);
        } else {
            setModalMessage("Verification failed. Incorrect code?");
        }
    } catch (error) {
        setModalMessage("Server error during verification.");
    }
  };

  /* LOGOUT FUNCTION */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("name");

    setIsLoggedIn(false);
    setUserRole("");
    setUserName("User");
    setIsDropdownOpen(false);
    
    // Kick them back to the home page and refresh
    window.location.href = "/";
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
        setLoginMessage("Server error.");
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
            <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-400">[{userRole}]</span>
                <span className="text-[#ECDFCC]">Welcome, <span className="font-bold text-white">{userName}</span>!</span>

                <div className="relative">
                    <button className="bg-[#697565] hover:bg-white hover:text-[#1E201E] text-[#ECDFCC] px-4 py-2 rounded text-sm transition flex items-center gap-2 font-semibold shadow-md"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        Account ▼
                    </button>

                    {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-[#697565] rounded shadow-lg py-2 z-50 border border-gray-500">
                        
                        {userRole === "ADMIN" && (
                            <button className="block w-full text-left px-4 py-2 text-sm font-bold text-blue-300 duration-200 hover:bg-gray-100 hover:text-[#1E201E]" 
                                onClick={() => { setIsDropdownOpen(false); router.push('/admin'); }}>
                                Admin Portal
                            </button>
                        )}

                        <button className="block w-full text-left px-4 py-2 text-sm text-[#ECDFCC] duration-200 hover:bg-gray-100 hover:text-[#1E201E]" 
                            onClick={() => { setIsDropdownOpen(false); router.push('/profile'); }}>
                            Profile
                        </button>
                        
                        <div className="border-t border-gray-500 my-1"></div>

                        <button className="block w-full text-left px-4 py-2 text-sm text-[#ECDFCC] duration-200 hover:bg-red-500 hover:text-white" 
                            onClick={handleLogout}>
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
                            <div className="text-center text-sm text-[#ECDFCC] mt-2 border-t border-gray-500 pt-3 flex flex-col gap-2">
                                {/* NEW: Manual Verify Account Button */}
                                <button 
                                    className="font-bold hover:text-white transition-colors"
                                    onClick={() => {
                                        setIsLoginDropdownOpen(false);
                                        setShowVerification(true);
                                        setModalMessage("");
                                    }}
                                >
                                    Verify Account
                                </button>
                                <span>
                                    <p>Don't have an account?</p>{' '}
                                    <Link href="/register" className="font-bold hover:text-white hover:underline transition-colors" onClick={() => setIsLoginDropdownOpen(false)}>
                                        Register here
                                    </Link>
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
            )}
        </div>

      {/* --- INACTIVE / MANUAL VERIFICATION POPUP MODAL --- */}
      {showVerification && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] p-4">
              <div className="bg-[#3C3D37] p-8 rounded-xl shadow-2xl max-w-sm w-full flex flex-col items-center gap-4 border border-gray-600">
                  
                  <h2 className="text-2xl font-bold text-[#ECDFCC]">Verify Account</h2>
                  <p className="text-sm text-center text-[#ECDFCC] mb-2">
                      Enter your email and the 6-digit code we sent you.
                  </p>

                  <input 
                      type="email" 
                      placeholder="Email Address" 
                      value={loginEmail} 
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full p-3 bg-[#ECDFCC] text-[#1E201E] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 font-semibold"
                  />

                  <input 
                      type="text" 
                      maxLength={6}
                      placeholder="000000" 
                      value={verificationCode} 
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="w-full p-4 text-center tracking-[0.5em] text-2xl bg-[#ECDFCC] text-[#1E201E] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 font-bold"
                  />

                  <button 
                      onClick={async () => {
                          if (!loginEmail) return setModalMessage("Please enter your email first.");
                          setModalMessage("Sending new code...");
                          try {
                              await fetch('http://localhost:8080/api/auth/resend-code', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ email: loginEmail })
                              });
                              setModalMessage("A new code was sent to your email!");
                          } catch (e) { setModalMessage("Failed to resend code."); }
                      }}
                      className="text-sm text-blue-300 hover:text-blue-100 transition-colors"
                  >
                      Resend Code
                  </button>

                  <button 
                      onClick={handleVerify}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors mt-2"
                  >
                      Activate Account
                  </button>

                  <button 
                      onClick={() => { setShowVerification(false); setModalMessage(""); }}
                      className="w-full bg-transparent border border-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg transition-colors text-sm mt-1"
                  >
                      Cancel
                  </button>

                  {modalMessage && (
                      <p className={`text-sm font-bold mt-2 text-center ${modalMessage.includes("verified") || modalMessage.includes("sent") ? "text-green-400" : "text-red-400"}`}>
                          {modalMessage}
                      </p>
                  )}
                  
              </div>
          </div>
      )}
    </nav>
  );
}
