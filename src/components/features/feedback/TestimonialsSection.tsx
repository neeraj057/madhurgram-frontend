"use client";

import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";

interface Testimonial {
  id: number;
  customerName: string;
  sentiment: string;
  rating: number;
  feedbackText?: string;
  selectedChips?: string;
  productImageUrl?: string;
  createdAt: string;
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/public/feedback/testimonials");
        if (res.ok) {
          const data = await res.json();
          setTestimonials(data);
        }
      } catch (err) {
        console.error("Failed to load storefront testimonials", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case "LOVED_IT": return "😍";
      case "HAPPY": return "🙂";
      case "NEUTRAL": return "😐";
      case "SAD": return "😢";
      case "ANGRY": return "😡";
      default: return "💬";
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-[#111111] border-t border-gray-800/40">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-2">
            <div className="h-3 w-20 bg-gray-800 animate-pulse mx-auto rounded" />
            <div className="h-8 w-60 bg-gray-800 animate-pulse mx-auto rounded" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-48 rounded-2xl border border-gray-800 bg-[#161616] p-6 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Gracefully hide section if no positive feedback is available yet
  if (testimonials.length === 0) {
    return null;
  }

  // 📐 Centering layout grids dynamically based on active review count
  const testimonialCount = testimonials.length;
  let gridColsClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
  let maxContainerWidth = "max-w-7xl";

  if (testimonialCount === 1) {
    gridColsClass = "grid-cols-1";
    maxContainerWidth = "max-w-md";
  } else if (testimonialCount === 2) {
    gridColsClass = "grid-cols-1 sm:grid-cols-2";
    maxContainerWidth = "max-w-3xl";
  } else if (testimonialCount === 3) {
    gridColsClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    maxContainerWidth = "max-w-5xl";
  }

  return (
    <section className="py-24 bg-[#111111] border-t border-gray-800/40 relative overflow-hidden">
      {/* Luxury gold glowing backdrops */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className={`${maxContainerWidth} mx-auto px-6 relative z-10`}>
        <header className="text-center space-y-4 mb-16">
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.35em] text-[#D4AF37] uppercase animate-pulse block">
            SHUDDHATA KA ANUBHAV
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#FDFBF7] tracking-wide">
            Our Customers Say (कस्टमर की पसंद)
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4 select-none">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[#D4AF37] text-[10px]">✦</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
        </header>

        <div className={`grid gap-6 ${gridColsClass} justify-center`}>
          {testimonials.map((t) => {
            const hasComment = t.feedbackText && t.feedbackText.trim().length > 0;
            const textToDisplay = hasComment
              ? t.feedbackText
              : t.selectedChips
                ? t.selectedChips.split(",")[0]
                : "Excellent products and service! Shuddh swad.";

            return (
              <div
                key={t.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-gray-800/50 bg-[#161616]/75 hover:bg-[#1d1d1d]/80 p-8 transition-all duration-300 hover:border-[#D4AF37]/40 hover:-translate-y-1 shadow-2xl backdrop-blur-sm"
              >
                {/* Decorative Quotation Mark */}
                <div className="absolute -top-3 -left-1 text-[#D4AF37]/10 group-hover:text-[#D4AF37]/25 transition-all text-7xl font-serif pointer-events-none select-none">
                  “
                </div>

                <div className="space-y-4 relative z-10">
                  {/* Stars & Emoji Row */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < t.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-gray-800"
                        }`}
                      />
                    ))}
                    <span className="text-xs ml-2 select-none">{getSentimentEmoji(t.sentiment)}</span>
                  </div>

                  {/* Customer product image (if present) */}
                  {t.productImageUrl && (
                    <div className="w-full h-32 rounded-xl overflow-hidden border border-gray-800 bg-[#0B0B0B] relative">
                      <img
                        src={t.productImageUrl}
                        alt="Customer feedback product"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Feedback Text */}
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans font-light italic">
                    "{textToDisplay}"
                  </p>
                </div>

                {/* Author Info */}
                <footer className="mt-8 border-t border-gray-800/40 pt-4 flex justify-between items-center relative z-10">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#FDFBF7] group-hover:text-[#D4AF37] transition-colors">
                      {t.customerName}
                    </p>
                    <p className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-semibold mt-0.5">
                      Verified Customer
                    </p>
                  </div>
                  
                  {/* Gold Verified Check Badge */}
                  <span className="h-6 w-6 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[10px] text-[#D4AF37] select-none font-bold">
                    ✓
                  </span>
                </footer>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
