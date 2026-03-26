"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "", email: "", password: "", phone: "",
        street: "", city: "", state: "", zip: ""
    });
    const [message, setMessage] = useState("");

    const [showVerification, setShowVerification] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password.length < 6) {
            setMessage("Error: Password must be at least 6 characters long.");
            return;
        }

        const payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            address: {
                street: formData.street,
                city: formData.city,
                state: formData.state,
                zip: formData.zip
            }
        };

        try {
            setMessage("Registering...");
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setMessage("Registration successful!");
                
                setShowVerification(true); 
            } else {
                setMessage("Registration failed. Email might already be in use.");
            }
        } catch (error) {
            console.error(error);
            setMessage("Server error. Make sure your backend is running.");
        }
    };

    // Submit Verification Code
    const handleVerify = async () => {
        if (!verificationCode) {
            setModalMessage("Please enter the code.");
            return;
        }

        setModalMessage("Verifying...");

        try {
            const response = await fetch('http://localhost:8080/api/auth/verify-registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: formData.email,
                    code: verificationCode 
                })
            });

            if (response.ok) {
                const data = await response.json();
                // Save the token so we can make authenticated requests
                localStorage.setItem("token", data.token);
                alert("Account successfully verified! You may now log in.");
                router.push("/");
            } else {
                setModalMessage("Verification failed.");
            }
        } catch (error) {
            console.error(error);
            setModalMessage("Server error during verification.");
        }
    };

    return (
        <main className="min-h-screen bg-[#1E201E] flex flex-col items-center justify-center p-8 relative">
            <h1 className="text-4xl text-[#ECDFCC] font-bold mb-8">Create an Account</h1>
            <p className="text-l text-[#ECDFCC] font-bold mb-8">* indicates a required field.</p>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
                
                <input required type="text" name="name" placeholder="Name *" value={formData.name} onChange={handleChange}
                    className="p-3 bg-[#ECDFCC] text-[#1E201E] rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors" /> 
                
                <input required type="email" name="email" placeholder="Email *" value={formData.email} onChange={handleChange}
                    className="p-3 bg-[#ECDFCC] text-[#1E201E] rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors" /> 
                
                <input required type="password" name="password" placeholder="Password (min 6 chars) *" value={formData.password} onChange={handleChange}
                    className="p-3 bg-[#ECDFCC] text-[#1E201E] rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors" /> 
                
                <input required type="tel" name="phone" placeholder="Phone *" value={formData.phone} onChange={handleChange}
                    className="p-3 bg-[#ECDFCC] text-[#1E201E] rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors" /> 
                
                <input type="text" name="street" placeholder="Street" value={formData.street} onChange={handleChange}
                    className="p-3 bg-[#ECDFCC] text-[#1E201E] rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors" /> 
                
                <div className="flex gap-2">
                    <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange}
                        className="p-3 w-1/2 bg-[#ECDFCC] text-[#1E201E] rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors" /> 
                    
                    <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange}
                        className="p-3 w-1/4 bg-[#ECDFCC] text-[#1E201E] rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors" /> 
                    
                    <input type="text" name="zip" placeholder="Zip" value={formData.zip} onChange={handleChange}
                        className="p-3 w-1/4 bg-[#ECDFCC] text-[#1E201E] rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors" /> 
                </div>

                <button type="submit" className="mt-4 p-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors">
                    Register
                </button>

                {message && !showVerification && (
                    <p className={`text-center mt-4 font-semibold ${message.includes("successful") ? "text-green-400" : "text-red-400"}`}>
                        {message}
                    </p>
                )}
            </form>

            {showVerification && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#3C3D37] p-8 rounded-xl shadow-2xl max-w-sm w-full flex flex-col items-center gap-4 border border-gray-600">
                        
                        <h2 className="text-2xl font-bold text-[#ECDFCC]">Verify Account</h2>
                        <p className="text-sm text-center text-[#ECDFCC] mb-2">
                            We sent a 6-digit code to <br/>
                            <span className="font-bold text-white">{formData.email}</span>
                        </p>

                        <input 
                            type="text" 
                            maxLength={6}
                            placeholder="000000" 
                            value={verificationCode} 
                            onChange={(e) => setVerificationCode(e.target.value)}
                            className="w-full p-4 text-center tracking-[0.5em] text-2xl bg-[#ECDFCC] text-[#1E201E] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 font-bold"
                        />

                        <button 
                            onClick={handleVerify}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors mt-2"
                        >
                            Activate Account
                        </button>

                        {modalMessage && (
                            <p className={`text-sm font-bold mt-2 ${modalMessage.includes("Verifying") ? "text-blue-300" : "text-red-400"}`}>
                                {modalMessage}
                            </p>
                        )}
                        
                    </div>
                </div>
            )}
            
        </main>
    );
}