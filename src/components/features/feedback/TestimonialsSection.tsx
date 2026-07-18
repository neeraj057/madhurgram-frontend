"use client";

import React, { useState, useEffect } from "react";
import { Star, X, Camera } from "lucide-react";
import { API_ENDPOINTS } from "@/apis/api";
import { showToast } from "@/components/ui/Toast";

interface Testimonial {
  id: number;
  customerName: string;
  sentiment: string;
  rating: number;
  feedbackText?: string;
  selectedChips?: string;
  productImageUrl?: string;
  createdAt: string;
  isApproved?: boolean;
  orderId?: number;
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Write review form states
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [emailConfirm, setEmailConfirm] = useState(""); // Honeypot state

  const fetchTestimonials = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.publicFeedbackTestimonials);
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

  useEffect(() => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("कृपया अपना नाम लिखें!", "error");
      return;
    }
    setIsSubmitting(true);
    let productImageUrl = "";

    try {
      // 1. Upload review image if selected
      if (selectedFile) {
        setIsUploading(true);
        const fileData = new FormData();
        fileData.append("file", selectedFile);
        
        const uploadRes = await fetch(API_ENDPOINTS.publicFeedbackUpload, {
          method: "POST",
          body: fileData
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          productImageUrl = uploadData.url || "";
        } else {
          showToast("फ़ोटो अपलोड करने में विफल।", "error");
        }
      }

      // 2. Map numeric rating to mood sentiment
      let sentiment = "HAPPY";
      if (rating === 5) sentiment = "LOVED_IT";
      else if (rating === 4) sentiment = "HAPPY";
      else if (rating === 3) sentiment = "NEUTRAL";
      else if (rating === 2) sentiment = "SAD";
      else if (rating === 1) sentiment = "ANGRY";

      const reviewPayload = {
        customerName: name.trim(),
        rating,
        sentiment,
        feedbackText: comment.trim(),
        productImageUrl,
        emailConfirm
      };

      // 3. Submit feedback details payload (orderId is null, will trigger isApproved = false in backend)
      const submitRes = await fetch(API_ENDPOINTS.publicFeedbackSubmit, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(reviewPayload)
      });

      if (submitRes.ok) {
        showToast("धन्यवाद! आपका रिव्यू सबमिट हो गया है। एडमिन द्वारा स्वीकृत होने के बाद यह यहाँ दिखाई देगा। 💛", "success");
        setIsWriteModalOpen(false);
        setName("");
        setComment("");
        setRating(5);
        setSelectedFile(null);
        setEmailConfirm("");
        fetchTestimonials(); // Refresh list just in case
      } else {
        showToast("रिव्यू सबमिट करने में विफल। कृपया पुन: प्रयास करें।", "error");
      }
    } catch (err) {
      console.error("Submit review error:", err);
      showToast("सर्वर त्रुटि। कृपया बाद में प्रयास करें।", "error");
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-[#111111] border-t border-gray-800/40 animate-fadeIn">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-2">
            <div className="h-3 w-20 bg-gray-200 animate-pulse mx-auto rounded" />
            <div className="h-8 w-60 bg-gray-200 animate-pulse mx-auto rounded" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-48 rounded-2xl border border-gray-200 bg-gray-100/50 p-6 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const row1 = testimonials.filter((_, idx) => idx % 2 === 0);
  const row2 = testimonials.filter((_, idx) => idx % 2 !== 0);

  const getRepeatedItems = (items: Testimonial[]) => {
    if (items.length === 0) return [];
    let repeated = [...items];
    while (repeated.length < 8) {
      repeated = [...repeated, ...items];
    }
    return [...repeated, ...repeated];
  };

  return (
    <section className="relative py-24 text-[#111111] overflow-hidden border-t border-gray-200/50">
      {/* Luxury gold glowing backdrops */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#D4AF37]/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#D4AF37]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <header className="text-center space-y-4 mb-10">
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.35em] text-[#D4AF37] uppercase animate-pulse block animate-fadeIn">
            शुद्धता का अनुभव
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#111111] tracking-wide leading-tight">
            Our Customers Say
          </h2>
          <p className="text-xs sm:text-sm font-sans font-bold text-[#D4AF37] select-none tracking-widest uppercase">
            (कस्टमर की पसंद)
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 select-none">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[#D4AF37] text-[10px]">✦</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
          
          {/* Write a Review Button */}
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="px-6 py-2.5 rounded-xl border-2 border-[#D4AF37] text-[#D4AF37] bg-white text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-[#111111] transition-all duration-300 active:scale-95 shadow-sm hover:shadow-md"
            >
              Write A Review
            </button>
          </div>
        </header>

        {testimonials.length === 0 ? (
          <div className="text-center py-10 bg-white/50 border border-gray-200/60 rounded-2xl max-w-md mx-auto p-8 animate-fadeIn">
            <p className="text-gray-500 text-sm font-sans font-light">
              No testimonials have been published yet. Be the first to share your authentic experience! 💛
            </p>
          </div>
        ) : (
          <div className="space-y-8 overflow-hidden py-4 relative">
            <style>{`
              @keyframes marquee-left {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              @keyframes marquee-right {
                0% { transform: translateX(-50%); }
                100% { transform: translateX(0); }
              }
              .animate-marquee-left {
                display: flex;
                width: max-content;
                animation: marquee-left 35s linear infinite;
              }
              .animate-marquee-right {
                display: flex;
                width: max-content;
                animation: marquee-right 35s linear infinite;
              }
              .animate-marquee-left:hover,
              .animate-marquee-right:hover {
                animation-play-state: paused;
              }
            `}</style>

            {/* Row 1 (Left scrolling) */}
            {row1.length > 0 && (
              <div className="relative w-full overflow-hidden select-none">
                <div className="animate-marquee-left gap-6 flex">
                  {getRepeatedItems(row1).map((t, idx) => (
                    <TestimonialCard key={`row1-${t.id}-${idx}`} testimonial={t} />
                  ))}
                </div>
                {/* Fade edges */}
                <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#FDFBF7] to-transparent pointer-events-none z-10" />
                <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#FDFBF7] to-transparent pointer-events-none z-10" />
              </div>
            )}

            {/* Row 2 (Right scrolling) */}
            {row2.length > 0 && (
              <div className="relative w-full overflow-hidden select-none">
                <div className="animate-marquee-right gap-6 flex">
                  {getRepeatedItems(row2).map((t, idx) => (
                    <TestimonialCard key={`row2-${t.id}-${idx}`} testimonial={t} />
                  ))}
                </div>
                {/* Fade edges */}
                <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#FDFBF7] to-transparent pointer-events-none z-10" />
                <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#FDFBF7] to-transparent pointer-events-none z-10" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Write a Review Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          {/* Click outside backdrop to close */}
          <div className="absolute inset-0" onClick={() => !isSubmitting && setIsWriteModalOpen(false)} />
          
          <div className="relative w-full max-w-md bg-[#111111] text-[#FDFBF7] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl flex flex-col z-10 animate-fadeIn">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-800/60">
              <h3 className="text-lg font-serif font-bold text-[#D4AF37] tracking-wide">
                Write A Review
              </h3>
              <button
                type="button"
                onClick={() => setIsWriteModalOpen(false)}
                disabled={isSubmitting}
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-all cursor-pointer disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleReviewSubmit} className="p-6 space-y-4">
              
              {/* Customer Name */}
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1.5 font-bold">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4AF37]/50 rounded-xl p-3 text-xs text-[#FDFBF7] placeholder-gray-700 outline-none transition-all"
                  placeholder="e.g. Ram Kumar"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Star Rating Selector */}
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1.5 font-bold">Rating</label>
                <div className="flex items-center gap-1.5 py-1 select-none">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const starVal = i + 1;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRating(starVal)}
                        disabled={isSubmitting}
                        className="p-1 text-gray-600 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            starVal <= rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-gray-700"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment text */}
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1.5 font-bold">Review Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4AF37]/50 rounded-xl p-3 text-xs text-[#FDFBF7] placeholder-gray-700 outline-none transition-all min-h-[90px] resize-none"
                  placeholder="Share your experience about MadhurGram's shuddhata..."
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* File upload */}
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1.5 font-bold">Upload Product Photo (optional)</label>
                <div className="flex items-center space-x-3 bg-[#0d0d0d] border border-gray-800 rounded-xl p-3 relative cursor-pointer hover:border-gray-700 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 w-full cursor-pointer"
                    disabled={isSubmitting}
                  />
                  <div className="h-9 w-9 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-[#D4AF37]">
                    <Camera className="h-4 w-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[11px] text-gray-300 font-bold truncate">
                      {selectedFile ? selectedFile.name : "Select Product Image"}
                    </p>
                    <p className="text-[9px] text-gray-600">JPG, PNG up to 5MB</p>
                  </div>
                </div>
              </div>

              {/* Honeypot field - hidden from real users but bots will fill it */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="email_confirm"
                  value={emailConfirm}
                  onChange={(e) => setEmailConfirm(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-3 border border-gray-800 text-gray-400 font-bold rounded-xl cursor-pointer hover:bg-gray-900 transition-all text-xs uppercase tracking-wider disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#D4AF37] text-[#111111] font-bold rounded-xl cursor-pointer hover:bg-[#FDFBF7] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-wider active:scale-95 flex items-center justify-center space-x-2"
                >
                  <span>{isSubmitting ? (isUploading ? "Uploading Image..." : "Submitting...") : "Submit Review"}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </section>
  );
}

function TestimonialCard({ testimonial: t }: { testimonial: Testimonial }) {
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

  const hasComment = t.feedbackText && t.feedbackText.trim().length > 0;
  const textToDisplay = hasComment
    ? t.feedbackText
    : t.selectedChips
      ? t.selectedChips.split(",")[0]
      : "Excellent products and service! Shuddh swad.";

  const isOrderVerified = !!t.orderId;

  return (
    <div
      className="group relative flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white/95 hover:bg-white p-6 transition-all duration-300 hover:border-[#D4AF37]/50 shadow-[0_4px_25px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_30px_rgba(212,175,55,0.05)] w-[280px] sm:w-[320px] flex-shrink-0"
    >
      {/* Decorative Quotation Mark */}
      <div className="absolute -top-3 -left-1 text-[#D4AF37]/5 group-hover:text-[#D4AF37]/15 transition-all text-7xl font-serif pointer-events-none select-none">
        “
      </div>

      <div className="space-y-3 relative z-10">
        {/* Stars & Emoji Row */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < t.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-gray-200"
              }`}
            />
          ))}
          <span className="text-xs ml-2 select-none">{getSentimentEmoji(t.sentiment)}</span>
        </div>

        {/* Customer product image */}
        {t.productImageUrl && (
          <div className="w-full h-24 rounded-lg overflow-hidden border border-gray-200/80 bg-gray-50 relative">
            <img
              src={t.productImageUrl}
              alt="Customer review product"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        {/* Feedback Text */}
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans font-light italic line-clamp-3">
          "{textToDisplay}"
        </p>
      </div>

      {/* Author Info */}
      <footer className="mt-6 border-t border-gray-100 pt-3 flex justify-between items-center relative z-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#111111] group-hover:text-[#D4AF37] transition-colors">
            {t.customerName}
          </p>
          <p className={`text-[8.5px] uppercase tracking-widest font-bold mt-0.5 ${
            isOrderVerified ? "text-[#D4AF37]" : "text-green-600"
          }`}>
            {isOrderVerified ? "Verified Buyer" : "Community Reviewer"}
          </p>
        </div>
        
        {/* Verified Check Badge */}
        <span className={`h-5 w-5 rounded-full border flex items-center justify-center text-[9px] select-none font-bold ${
          isOrderVerified 
            ? "bg-[#D4AF37]/10 border-[#D4AF37]/20 text-[#D4AF37]" 
            : "bg-green-500/10 border-green-500/20 text-green-600"
        }`}>
          ✓
        </span>
      </footer>
    </div>
  );
}
