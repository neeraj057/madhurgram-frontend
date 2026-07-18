"use client";

import React, { useState, useEffect } from 'react';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show tooltip after 4 seconds to catch attention without being annoying
    const timer = setTimeout(() => {
      setShowTooltip(true);
      // Auto-hide tooltip after 8 seconds
      const hideTimer = setTimeout(() => setShowTooltip(false), 8000);
      return () => clearTimeout(hideTimer);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const waLink = "https://wa.me/919988776655?text=Hello%20MadhurGram%2C%20I%20want%20to%20inquire%20about%20your%20pure%20village%20products.";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 font-sans select-none">
      
      {/* Dynamic Keyframes for Glow Pulse */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5); }
          50% { box-shadow: 0 0 18px 6px rgba(37, 211, 102, 0.25); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2.5s infinite ease-in-out;
        }
      `}</style>

      {/* Tooltip Message */}
      <div 
        className={`bg-white text-[#111111] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.08)] py-2 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all duration-500 ease-out transform origin-right flex items-center gap-1.5 ${
          showTooltip 
            ? 'opacity-100 translate-x-0 scale-100' 
            : 'opacity-0 translate-x-4 scale-75 pointer-events-none'
        }`}
      >
        <span className="text-emerald-500 animate-bounce">●</span>
        <span>गाँव से सीधा संपर्क करें! 🌾</span>
        <button 
          onClick={() => setShowTooltip(false)}
          className="ml-2 text-gray-400 hover:text-gray-600 text-[10px]"
        >
          ✕
        </button>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order on WhatsApp"
        onClick={() => setShowTooltip(false)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#20ba5a] to-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 animate-pulse-glow"
      >
        {/* WhatsApp SVG Icon */}
        <svg 
          viewBox="0 0 24 24" 
          className="h-7 w-7 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.528 2.008 14.056.979 11.43 1.01c-5.44 0-9.863 4.372-9.867 9.802-.001 1.73.473 3.41 1.37 4.915l-1.093 3.996 4.217-1.127zm11.306-7.077c-.305-.153-1.802-.888-2.08-.988-.278-.1-.482-.15-.68.15-.2.3-.773.976-.948 1.176-.175.2-.35.225-.655.073-1.202-.534-2.074-1.008-2.836-2.316-.2-.343.2-.32.57-.96.084-.153.042-.288-.021-.413-.063-.125-.482-1.163-.661-1.588-.175-.418-.364-.36-.482-.36h-.414c-.143 0-.376.054-.572.271-.196.218-.75.733-.75 1.788 0 1.055.766 2.074.872 2.215.107.141 1.51 2.3 3.657 3.228.512.222.912.355 1.223.454.514.163.982.14 1.352.085.412-.06 1.802-.738 2.057-1.453.255-.715.255-1.328.18-1.453-.075-.125-.278-.201-.583-.353z" />
        </svg>
      </a>

    </div>
  );
}
