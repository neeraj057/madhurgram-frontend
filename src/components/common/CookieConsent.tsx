"use client";

import React, { useState, useEffect } from "react";
import { Shield } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if consent has already been accepted
    const consent = localStorage.getItem("mg_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setShowBanner(true), 1500); // load after 1.5s
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("mg_cookie_consent", "accepted");
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("mg_cookie_consent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-fade-in">
      <div className="bg-[#121212] border border-gray-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Subtle gold line at top */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
        
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 shrink-0 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
            <Shield className="h-5 w-5" />
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FDFBF7]">Cookie Consent</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed font-light">
              MadhurGram uses cookies to enhance your shopping experience and optimize our local artisanal product delivery logs. Do you agree?
            </p>
            
            <div className="flex gap-2 pt-2 border-t border-gray-800/40">
              <button
                onClick={handleAccept}
                className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[10px] font-bold uppercase tracking-widest text-[#111111] hover:brightness-110 active:scale-95 transition-all text-center"
              >
                Accept
              </button>
              <button
                onClick={handleDecline}
                className="flex-1 py-2 px-3 rounded-lg bg-[#181818] border border-gray-800 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:border-gray-700 active:scale-95 transition-all text-center"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
