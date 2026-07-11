"use client";
import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative h-[calc(100vh-88px)] w-full overflow-hidden bg-[#111111]">
      
      {/* 1. CINEMATIC VIDEO BACKGROUND */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          {/* Path pointing directly to public/videos/bg_video.mp4 */}
          <source src="/videos/bg_video.mp4" type="video/mp4" />
        </video>
        
        {/* Luxury Black Scrim Layer: वीडियो के ऊपर एक हल्का डार्क ग्रेडिएंट ओवरले 
            ताकि वीडियो भी दिखे और उसके ऊपर हमारा टेक्स्ट भी एकदम चमचमाता हुआ साफ़ दिखे */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-black/40 to-black/60" />
      </div>

      {/* 2. PREMIUM TEXT OVERLAY (THE "WOW" CONTENT) */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 text-center">
        
        {/* Subtle Subtitle Token */}
        <span className="mb-5 text-[10px] font-bold tracking-[0.35em] text-[#D4AF37] uppercase md:text-xs animate-pulse">
          100% PURE & TRADITIONAL HANDCRAFTED GOODS
        </span>
        
        {/* Main Brand Tagline */}
        <h1 className="max-w-5xl font-serif text-4xl font-bold leading-[1.25] text-[#FDFBF7] md:text-6xl lg:text-7xl tracking-wide">
          गाँव की असली मिठास,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDFBF7] via-[#D4AF37] to-[#FDFBF7]">
            अब हर घर में।
          </span>
        </h1>

        {/* Short Premium Brand Description */}
        <p className="mt-6 max-w-xl text-xs tracking-[0.08em] leading-relaxed text-[#FDFBF7]/80 md:text-base font-light">
          Direct from the trusted farmers of Gopiganj to your luxury lifestyle. 
          Experience handcrafted purity with zero preservatives.
        </p>

        {/* Premium Call-to-Action (CTA) Button */}
        <div className="mt-10">
          <a
            href="#products"
            className="group relative inline-flex items-center justify-center overflow-hidden border border-[#D4AF37]/50 px-9 py-4 font-medium tracking-[0.25em] text-[#FDFBF7] transition-all duration-300 hover:text-[#111111]"
          >
            {/* Hover Slide Background Animation (Apple-Style) */}
            <span className="absolute inset-0 h-full w-full -translate-x-full bg-[#D4AF37] transition-transform duration-300 ease-out group-hover:translate-x-0" />
            
            <span className="relative z-10 flex items-center text-[10px] uppercase font-semibold">
              Explore Purity
              <ChevronDown className="ml-2.5 h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
            </span>
          </a>
        </div>
      </div>

    </div>
  );
}