"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, Lock, Loader2 } from "lucide-react";
import { API_ENDPOINTS } from "../../../apis/api";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.adminLogin, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid Username or Password");
      }

      const data = await response.json();
      
      // 🗝️ 1. टोकन को ब्राउज़र के LocalStorage में सेव करो
      localStorage.setItem("adminToken", data.token);
      // 🍪 2. Middleware के लिए टोकन को Cookie में भी सेट कर दो (10 घंटे की वैलिडिटी)
      document.cookie = `adminToken=${data.token}; path=/; max-age=36000`;
      
      // 🚀 2. सक्सेस होते ही सीधा प्रोडक्ट्स पेज पर भेज दो
      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message || "Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* 🌟 Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#161616] border border-gray-800 rounded-3xl p-8 shadow-2xl">
          
          {/* Logo & Header */}
          <div className="flex flex-col items-center justify-center mb-10">
            <div className="h-14 w-14 bg-[#D4AF37]/10 flex items-center justify-center rounded-2xl border border-[#D4AF37]/30 mb-4">
              <Store className="h-7 w-7 text-[#D4AF37]" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#FDFBF7] tracking-wide mb-1">
              MadhurGram Admin
            </h1>
            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">
              Secure Access Portal
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-center">
              <p className="text-xs text-red-400 uppercase tracking-wider font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-2 ml-1">Username</label>
              <input 
                required 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="w-full bg-[#111111] border border-gray-800 rounded-xl p-3.5 text-sm text-white outline-none focus:border-[#D4AF37] transition-colors" 
                placeholder="Enter admin username" 
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-2 ml-1">Password</label>
              <input 
                required 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-[#111111] border border-gray-800 rounded-xl p-3.5 text-sm text-white outline-none focus:border-[#D4AF37] transition-colors" 
                placeholder="••••••••" 
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full py-4 mt-4 bg-[#D4AF37] text-[#111111] font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-[#FDFBF7] transition-all flex justify-center items-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Secure Login</span>
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}