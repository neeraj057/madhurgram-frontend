"use client";

import React, { useState } from 'react';
import { ChevronDown, Copy, Check } from 'lucide-react';
import { useHeroConfig } from '@/hooks/useHeroConfig';

export default function HeroSection() {
  const { config, loading } = useHeroConfig();
  const [copied, setCopied] = useState(false);

  const handleCopyCoupon = (code: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="relative h-[calc(100vh-88px)] w-full overflow-hidden bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]/75 font-semibold">
            Loading Purity...
          </span>
        </div>
      </div>
    );
  }

  const { heroContentType, offerTitle, offerSubtitle, offerLink, offerCoupon } = config;

  return (
    <div className="relative h-[calc(100vh-88px)] w-full overflow-hidden bg-[#111111]">
      
      {/* Dynamic Keyframes for Premium Shimmer & Text Glow */}
      <style>{`
        @keyframes shimmer-btn {
          0% { transform: translateX(-150%) skewX(-25deg); }
          50% { transform: translateX(150%) skewX(-25deg); }
          100% { transform: translateX(150%) skewX(-25deg); }
        }
        .animate-shimmer-btn {
          animation: shimmer-btn 4s infinite ease-in-out;
        }
        @keyframes text-glow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-text-glow {
          background-size: 200% auto;
          animation: text-glow 5s infinite linear;
        }
      `}</style>

      {/* 1. MEDIA BACKDROP SLOT (Conditional Rendering) */}
      <div className="absolute inset-0 z-0 h-full w-full">
        {heroContentType === 'video' ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          >
            <source src="/videos/bg_video.mp4" type="video/mp4" />
          </video>
        ) : heroContentType === 'offer' ? (
          <img 
            src="/images/hero_offer.png" 
            alt="Swadeshi Deals"
            className="h-full w-full object-cover animate-fade-in"
          />
        ) : (
          <img 
            src="/images/hero_purity.png" 
            alt="MadhurGram Ghee Purity"
            className="h-full w-full object-cover animate-fade-in"
          />
        )}
        
        {/* Luxury Scrim Layer: Dark overlay to secure typography readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-black/40 to-black/60" />
      </div>

      {/* 2. DYNAMIC CONTENT OVERLAY */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 text-center">
        
        {heroContentType === 'offer' ? (
          /* PREMIUM CAMPAIGN OFFER TEMPLATE CARD (Luxury Glassmorphism & Gold Highlights) */
          <div className="relative max-w-3xl rounded-[32px] border border-[#D4AF37]/25 bg-[#090909]/75 backdrop-blur-xl p-10 md:p-14 shadow-[0_0_80px_-15px_rgba(212,175,55,0.18)] hover:border-[#D4AF37]/50 hover:shadow-[0_0_100px_-10px_rgba(212,175,55,0.25)] transition-all duration-500 scale-[0.98] animate-fade-in-up flex flex-col items-center group">
            
            {/* Embedded Ambient Radial Pulse Glow */}
            <div className="absolute inset-0 -z-10 rounded-[32px] bg-radial from-[#D4AF37]/5 via-transparent to-transparent opacity-60 pointer-events-none" />

            {/* Premium Pill Badge */}
            <span className="mb-6 inline-block rounded-full border border-[#D4AF37]/45 bg-[#D4AF37]/10 px-4.5 py-1 text-[9px] font-bold tracking-[0.4em] text-[#D4AF37] uppercase animate-pulse">
              Limited Swadeshi Special Offer
            </span>
            
            {/* Dynamic Gold-Glistening Headline */}
            <h1 className="font-serif text-3xl font-extrabold leading-tight text-[#FDFBF7] md:text-5xl tracking-wide select-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDFBF7] via-[#D4AF37] to-[#FDFBF7] animate-text-glow">
                {offerTitle || "Festive Swadeshi Deal"}
              </span>
            </h1>

            {/* Dynamic Offer Description */}
            <p className="mt-5 max-w-xl text-xs tracking-wider leading-relaxed text-[#FDFBF7]/85 md:text-base font-light select-none">
              {offerSubtitle || "Experience traditional purity from the farms of Gopiganj at a special discount."}
            </p>

            {/* Click-to-copy Voucher Ticket Box */}
            {offerCoupon && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold select-none">
                  Use Coupon:
                </span>
                
                <div className="relative">
                  <button
                    onClick={() => handleCopyCoupon(offerCoupon)}
                    className="flex items-center gap-3.5 rounded-2xl border border-dashed border-[#D4AF37]/50 bg-[#161616]/95 hover:bg-[#222]/95 hover:border-[#D4AF37] transition-all duration-300 px-6 py-3 cursor-pointer group active:scale-95 shadow-md transform hover:scale-[1.03]"
                    title="Click to copy coupon code"
                  >
                    <span className="font-mono text-base font-extrabold tracking-widest text-[#D4AF37]">
                      {offerCoupon}
                    </span>
                    {copied ? (
                      <Check className="h-4.5 w-4.5 text-green-400" />
                    ) : (
                      <Copy className="h-4.5 w-4.5 text-[#D4AF37]/80 group-hover:text-[#D4AF37] transition-all" />
                    )}
                  </button>

                  {/* Micro Copied Notification Overlay */}
                  {copied && (
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-green-500 text-black text-[9px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-md shadow-lg animate-bounce select-none">
                      Copied!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Call-to-action button with golden shimmer */}
            <div className="mt-9">
              <a
                href={offerLink || "/#products"}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-[#D4AF37] bg-[#D4AF37] px-10 py-4 font-semibold tracking-[0.25em] text-[#111111] transition-all duration-300 hover:bg-transparent hover:text-[#FDFBF7] hover:shadow-[0_0_25px_rgba(212,175,55,0.45)]"
              >
                {/* Golden light sweep effect */}
                <span className="absolute inset-0 w-[40px] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer-btn" />
                
                <span className="relative z-10 flex items-center text-[10px] uppercase font-bold tracking-widest">
                  Claim Discount
                </span>
              </a>
            </div>

          </div>
        ) : (
          /* STANDARD BRAND LANDING PAGE HERO */
          <>
            {/* Subtle Subtitle Token */}
            <span className="mb-5 text-[10px] font-bold tracking-[0.35em] text-[#D4AF37] uppercase md:text-xs animate-pulse">
              100% PURE & TRADITIONAL HANDCRAFTED GOODS
            </span>
            
            {/* Main Brand Tagline */}
            <h1 className="max-w-5xl font-serif text-4xl font-bold leading-[1.25] text-[#FDFBF7] md:text-6xl lg:text-7xl tracking-wide select-none">
              गाँव की असली मिठास,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDFBF7] via-[#D4AF37] to-[#FDFBF7]">
                अब हर घर में।
              </span>
            </h1>

            {/* Short Premium Brand Description */}
            <p className="mt-6 max-w-xl text-xs tracking-[0.08em] leading-relaxed text-[#FDFBF7]/80 md:text-base font-light select-none">
              Direct from the trusted farmers of Gopiganj to your luxury lifestyle. 
              Experience handcrafted purity with zero preservatives.
            </p>

            {/* Premium Call-to-Action (CTA) Button */}
            <div className="mt-10">
              <a
                href="#products"
                className="group relative inline-flex items-center justify-center overflow-hidden border border-[#D4AF37]/50 px-9 py-4 font-medium tracking-[0.25em] text-[#FDFBF7] transition-all duration-300 hover:text-[#111111]"
              >
                {/* Hover Slide Background Animation */}
                <span className="absolute inset-0 h-full w-full -translate-x-full bg-[#D4AF37] transition-transform duration-300 ease-out group-hover:translate-x-0" />
                
                <span className="relative z-10 flex items-center text-[10px] uppercase font-semibold">
                  Explore Purity
                  <ChevronDown className="ml-2.5 h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
                </span>
              </a>
            </div>
          </>
        )}
      </div>

    </div>
  );
}