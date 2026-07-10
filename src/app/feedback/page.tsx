"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Heart, Sparkles, Check, Loader2, ArrowRight, MessageSquare, PenTool, Camera, X } from "lucide-react";

interface OrderResponse {
  id: number;
  customerName: string;
  orderItems: Array<{ productName: string }>;
}

const EMOJI_OPTIONS = [
  { rating: 1, emoji: "😡", label: "Angry", sentiment: "ANGRY", color: "hover:bg-red-500/10 hover:border-red-500/40 text-red-400" },
  { rating: 2, emoji: "😢", label: "Sad", sentiment: "SAD", color: "hover:bg-orange-500/10 hover:border-orange-500/40 text-orange-400" },
  { rating: 3, emoji: "😐", label: "Neutral", sentiment: "NEUTRAL", color: "hover:bg-yellow-500/10 hover:border-yellow-500/40 text-yellow-400" },
  { rating: 4, emoji: "🙂", label: "Happy", sentiment: "HAPPY", color: "hover:bg-green-500/10 hover:border-green-500/40 text-green-400" },
  { rating: 5, emoji: "😍", label: "Loved it", sentiment: "LOVED_IT", color: "hover:bg-pink-500/10 hover:border-pink-500/40 text-pink-400" },
];

function FeedbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderIdParam = searchParams.get("orderId");
  const orderId = orderIdParam ? parseInt(orderIdParam, 10) : null;

  const [rating, setRating] = useState<number>(0);
  const [sentiment, setSentiment] = useState<string>("");
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [customerName, setCustomerName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showCustomNote, setShowCustomNote] = useState<boolean>(false);
  const [productImageUrl, setProductImageUrl] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  // Fetch contextual suggestions and customer info
  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      try {
        // 1. Fetch customer order info if orderId is present
        if (orderId) {
          const orderResponse = await fetch(`http://localhost:8080/api/orders/${orderId}`);
          if (orderResponse.ok) {
            const orderData: OrderResponse = await orderResponse.json();
            setCustomerName(orderData.customerName);
          }
        }

        // 2. Fetch context suggestion chips
        const suggResponse = await fetch(
          `http://localhost:8080/api/public/feedback/suggestions${orderId ? `?orderId=${orderId}` : ""}`
        );
        if (suggResponse.ok) {
          const chips: string[] = await suggResponse.json();
          setSuggestions(chips);
        }
      } catch (err) {
        console.error("Failed to load page context", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [orderId]);

  // Handle rating click
  const handleRatingSelect = (selectedRating: number, selectedSentiment: string) => {
    setRating(selectedRating);
    setSentiment(selectedSentiment);

    // Auto-reveal text box for Neutral/Sad/Angry, auto-collapse or keep option for Happy/Loved it
    if (selectedRating <= 3) {
      setShowCustomNote(true);
    } else {
      setShowCustomNote(false);
    }
  };

  // Toggle suggestion chips selection
  const handleChipToggle = (chip: string) => {
    if (selectedChips.includes(chip)) {
      setSelectedChips(selectedChips.filter((c) => c !== chip));
    } else {
      setSelectedChips([...selectedChips, chip]);
    }
  };

  // Handle file select and upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);

    setUploadingImage(true);
    try {
      const res = await fetch("http://localhost:8080/api/public/feedback/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setProductImageUrl(data.url);
      } else {
        alert("Image upload failed. Please try again.");
      }
    } catch (err) {
      console.error("Upload error", err);
      alert("Failed to connect to the server for image upload.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Submit Feedback
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setSubmitting(true);
    try {
      const payload = {
        orderId: orderId,
        customerName: customerName || "Guest Customer",
        sentiment: sentiment,
        rating: rating,
        feedbackText: feedbackText,
        selectedChips: selectedChips.join(","),
        productImageUrl: productImageUrl,
      };

      const response = await fetch("http://localhost:8080/api/public/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("Failed to submit feedback. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Something went wrong. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#FDFBF7] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 text-[#D4AF37] animate-spin mx-auto" />
          <p className="text-gray-400 text-xs uppercase tracking-widest">Loading Feedback Console...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#FDFBF7] flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-3xl border border-gray-800 bg-[#121212]/90 p-8 text-center shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="h-16 w-16 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full flex items-center justify-center mx-auto mb-6 scale-up animate-pulse">
            <Check className="h-8 w-8 text-[#D4AF37]" />
          </div>

          <h2 className="text-2xl font-serif font-bold text-[#FDFBF7] mb-3">Feedback Received! 💛</h2>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            {customerName ? `${customerName}, ` : ""}aapka feedback humare liye bohot kimti hai. Isse hume MadhurGram ki shuddhata aur behtar karne ka hausla milta hai.
          </p>

          <button
            onClick={() => router.push("/")}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] px-5 py-4 text-xs font-bold uppercase tracking-widest text-[#111111] hover:brightness-110 active:scale-95 transition-all shadow-lg"
          >
            Go to Storefront <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FDFBF7] flex items-center justify-center p-4 sm:p-6 md:p-12 relative overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full rounded-3xl border border-gray-800/80 bg-[#121212]/95 p-6 sm:p-10 shadow-2xl relative backdrop-blur-lg">
        <header className="text-center mb-8 border-b border-gray-800/60 pb-6">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full px-4 py-1.5 text-xs text-[#D4AF37] font-semibold mb-4">
            <Sparkles className="h-3 w-3" /> Smart Customer Care
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#FDFBF7] tracking-wide mb-2">
            Share Your Experience
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            {customerName ? `Namaste ${customerName}, ` : "Namaste! "}MadhurGram ke products ka swad aapko kaisa laga?
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Rating Emoji Selector */}
          <div className="space-y-4">
            <label className="block text-[10px] sm:text-xs uppercase tracking-widest text-gray-500 font-bold text-center">
              Tap to Rate
            </label>
            <div className="grid grid-cols-5 gap-2 sm:gap-4 justify-items-center">
              {EMOJI_OPTIONS.map((opt) => {
                const isSelected = rating === opt.rating;
                return (
                  <button
                    key={opt.rating}
                    type="button"
                    onClick={() => handleRatingSelect(opt.rating, opt.sentiment)}
                    className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all duration-300 w-full active:scale-95 ${
                      isSelected
                        ? "bg-[#D4AF37]/10 border-[#D4AF37] scale-105 shadow-md shadow-[#D4AF37]/5"
                        : "bg-[#161616]/60 border-gray-800/80 text-gray-400 " + opt.color
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl mb-1 sm:mb-2">{opt.emoji}</span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? "text-[#D4AF37]" : "text-gray-500"}`}>
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {rating > 0 && (
            <div className="space-y-6 animate-fade-in duration-300">
              {/* Suggestion Chips */}
              <div className="space-y-3">
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                  ⚡ Smart Suggestions (Tap to select)
                </label>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((sugg) => {
                    const isSelected = selectedChips.includes(sugg);
                    return (
                      <button
                        key={sugg}
                        type="button"
                        onClick={() => handleChipToggle(sugg)}
                        className={`px-4 py-2.5 rounded-full text-[11px] font-medium transition-all duration-200 border text-left flex items-center gap-2 ${
                          isSelected
                            ? "bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]"
                            : "bg-[#181818] border-gray-800/80 text-gray-400 hover:border-gray-700 hover:text-gray-300"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 shrink-0" />}
                        <span>{sugg}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Show Add note option if not shown */}
              {!showCustomNote && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowCustomNote(true)}
                    className="inline-flex items-center gap-2 text-xs text-[#D4AF37] hover:underline"
                  >
                    <MessageSquare className="h-3 w-3" /> Add detailed note (Optional)
                  </button>
                </div>
              )}

              {/* Custom Textarea Note */}
              {showCustomNote && (
                <div className="space-y-3 animate-slide-down duration-200">
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                    💬 Detailed Review (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Apna anubhav vistaron se share karein..."
                    className="w-full rounded-2xl border border-gray-800 bg-[#161616]/70 p-4 text-xs sm:text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-[#D4AF37] transition-all custom-scrollbar"
                  />
                </div>
              )}

              {/* Image Upload Block */}
              <div className="space-y-3">
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                  📸 Upload Packaging / Product Photo (Optional)
                </label>

                {productImageUrl ? (
                  <div className="relative w-36 h-36 rounded-2xl overflow-hidden border border-gray-800 bg-[#161616] group">
                    <img
                      src={productImageUrl}
                      alt="Uploaded product feedback"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setProductImageUrl("")}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black text-gray-300 hover:text-white transition-all border border-gray-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 rounded-2xl border border-dashed border-gray-800 bg-[#161616]/40 hover:bg-[#161616]/70 hover:border-[#D4AF37]/50 transition-all cursor-pointer">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploadingImage ? (
                        <>
                          <Loader2 className="h-6 w-6 text-[#D4AF37] animate-spin mb-2" />
                          <p className="text-xs text-gray-400">Uploading photo...</p>
                        </>
                      ) : (
                        <>
                          <Camera className="h-6 w-6 text-gray-500 mb-2 group-hover:text-[#D4AF37] transition-all" />
                          <p className="text-xs text-gray-400">Click to upload product photo</p>
                          <p className="text-[9px] text-gray-600 mt-1">PNG, JPG or JPEG up to 10MB</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-gray-800/40">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] px-5 py-4 text-xs font-bold uppercase tracking-widest text-[#111111] hover:brightness-110 active:scale-95 transition-all shadow-lg disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      Submit Feedback <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] text-[#FDFBF7] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#D4AF37] animate-spin" />
      </div>
    }>
      <FeedbackContent />
    </Suspense>
  );
}
