"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Copy, Check } from "lucide-react";
import { useHeroBanners, HeroSlide } from "@/hooks/useHeroBanners";

export default function HeroSection() {
  const { slides, loading } = useHeroBanners();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copied, setCopied] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto-play slider timer (5 seconds)
  useEffect(() => {
    if (loading || slides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [loading, slides.length, isPaused]);

  const handleCopyCoupon = (code: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  // Touch Swipe handlers for Mobile UX
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  if (loading) {
    return (
      <div className="relative min-h-[85vh] h-[calc(100vh-88px)] w-full overflow-hidden bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]/75 font-semibold">
            Loading Purity...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative min-h-[85vh] h-[calc(100vh-88px)] w-full overflow-hidden bg-[#111111] select-none group/hero"
    >
      {/* Keyframe styles for luxury shimmer & glow */}
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

      {/* 1. SLIDES CONTAINER (Velvet Smooth Fade Transition) */}
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 z-0 h-full w-full transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 pointer-events-auto z-10" : "opacity-0 pointer-events-none z-0"
            }`}
          >
            {/* Background Media Backdrop */}
            <div className="absolute inset-0 h-full w-full">
              {slide.type === "video" ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover object-center transition-opacity duration-700"
                >
                  <source src={slide.bgMedia || "/videos/bg_video.mp4"} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={slide.bgMedia || "/images/hero_purity.png"}
                  alt={slide.headline}
                  className="h-full w-full object-cover object-center transition-opacity duration-700"
                />
              )}

              {/* Luxury Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-black/50 to-black/70" />
            </div>

            {/* Slide Content Overlay */}
            <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 text-center">
              {slide.type === "offer" ? (
                /* OFFER CARD SLIDE TEMPLATE */
                <div className="relative max-w-3xl rounded-[32px] border border-[#D4AF37]/35 bg-[#090909]/80 backdrop-blur-xl p-8 sm:p-12 md:p-14 shadow-[0_0_80px_-15px_rgba(212,175,55,0.2)] hover:border-[#D4AF37]/60 transition-all duration-500 flex flex-col items-center">
                  <div className="absolute inset-0 -z-10 rounded-[32px] bg-radial from-[#D4AF37]/10 via-transparent to-transparent opacity-60 pointer-events-none" />

                  <span className="mb-5 inline-block rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/15 px-4.5 py-1 text-[9px] font-bold tracking-[0.4em] text-[#D4AF37] uppercase animate-pulse">
                    {slide.badge}
                  </span>

                  <h1 className="font-serif text-3xl font-extrabold leading-relaxed text-[#FDFBF7] md:text-5xl tracking-wide select-none py-1">
                    <span className="inline-block py-2 px-1 text-transparent bg-clip-text bg-gradient-to-r from-[#FDFBF7] via-[#D4AF37] to-[#FDFBF7] animate-text-glow">
                      {slide.headline}
                    </span>
                  </h1>

                  <p className="mt-4 max-w-xl text-xs tracking-wider leading-relaxed text-[#FDFBF7]/85 md:text-base font-light select-none">
                    {slide.subtitle}
                  </p>

                  {slide.couponCode && (
                    <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold select-none">
                        Use Coupon:
                      </span>
                      <div className="relative">
                        <button
                          onClick={() => handleCopyCoupon(slide.couponCode || "")}
                          className="flex items-center gap-3.5 rounded-2xl border border-dashed border-[#D4AF37]/60 bg-[#161616]/95 hover:bg-[#222]/95 hover:border-[#D4AF37] transition-all duration-300 px-6 py-3 cursor-pointer group active:scale-95 shadow-md"
                          title="Click to copy coupon code"
                        >
                          <span className="font-mono text-base font-extrabold tracking-widest text-[#D4AF37]">
                            {slide.couponCode}
                          </span>
                          {copied ? (
                            <Check className="h-4.5 w-4.5 text-green-400" />
                          ) : (
                            <Copy className="h-4.5 w-4.5 text-[#D4AF37]/80 group-hover:text-[#D4AF37] transition-all" />
                          )}
                        </button>
                        {copied && (
                          <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-green-500 text-black text-[9px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-md shadow-lg animate-bounce select-none">
                            Copied!
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-8">
                    <a
                      href={slide.ctaLink}
                      className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-[#D4AF37] bg-[#D4AF37] px-10 py-4 font-semibold tracking-[0.25em] text-[#111111] transition-all duration-300 hover:bg-transparent hover:text-[#FDFBF7] hover:shadow-[0_0_25px_rgba(212,175,55,0.45)]"
                    >
                      <span className="absolute inset-0 w-[40px] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer-btn" />
                      <span className="relative z-10 flex items-center text-[10px] uppercase font-bold tracking-widest">
                        {slide.ctaText}
                      </span>
                    </a>
                  </div>
                </div>
              ) : (
                /* BRAND / PRODUCT STORY SLIDE TEMPLATE */
                <>
                  <span className="mb-5 text-[10px] font-bold tracking-[0.35em] text-[#D4AF37] uppercase md:text-xs animate-pulse">
                    {slide.badge}
                  </span>

                  <h1 className="max-w-5xl font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-relaxed md:leading-[1.35] text-[#FDFBF7] tracking-wide select-none py-1">
                    <span className="block">{slide.headline}</span>
                    {slide.highlightText && (
                      <span className="inline-block py-2 px-1 text-transparent bg-clip-text bg-gradient-to-r from-[#FDFBF7] via-[#D4AF37] to-[#FDFBF7]">
                        {slide.highlightText}
                      </span>
                    )}
                  </h1>

                  <p className="mt-6 max-w-xl text-xs tracking-[0.08em] leading-relaxed text-[#FDFBF7]/85 md:text-base font-light select-none">
                    {slide.subtitle}
                  </p>

                  <div className="mt-10">
                    <a
                      href={slide.ctaLink}
                      className="group relative inline-flex items-center justify-center overflow-hidden border border-[#D4AF37]/50 px-9 py-4 font-medium tracking-[0.25em] text-[#FDFBF7] transition-all duration-300 hover:text-[#111111]"
                    >
                      <span className="absolute inset-0 h-full w-full -translate-x-full bg-[#D4AF37] transition-transform duration-300 ease-out group-hover:translate-x-0" />
                      <span className="relative z-10 flex items-center text-[10px] uppercase font-semibold">
                        {slide.ctaText}
                        <ChevronDown className="ml-2.5 h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
                      </span>
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}

      {/* 2. NAVIGATION ARROWS (Hidden on Mobile, Visible on Desktop Hover) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full border border-[#D4AF37]/30 bg-black/40 backdrop-blur-md text-[#D4AF37] flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-all duration-300 hover:bg-[#D4AF37] hover:text-[#111111] hover:scale-110 cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full border border-[#D4AF37]/30 bg-black/40 backdrop-blur-md text-[#D4AF37] flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-all duration-300 hover:bg-[#D4AF37] hover:text-[#111111] hover:scale-110 cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* 3. GOLDEN PROGRESS DOT INDICATORS (Bottom Centered) */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
                idx === currentIndex
                  ? "w-8 bg-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.8)]"
                  : "w-2.5 bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}