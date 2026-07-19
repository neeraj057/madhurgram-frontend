"use client";

import React, { useState } from "react";
import { MessageSquare, ArrowLeft, RefreshCw, Search, Star, Loader2, Check, Trash } from "lucide-react";
import Link from "next/link";
import { useAdminFeedback } from "@/hooks/useAdminFeedback";

export default function AdminFeedbackPage() {
  const { feedbacks, page, totalPages, setPage, loading, error, approveFeedback, deleteFeedback, refresh } = useAdminFeedback();
  const [searchQuery, setSearchQuery] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL"); // "ALL", "PENDING", "APPROVED"

  // Calculate Metrics
  const totalSubmissions = feedbacks.length;
  const averageRating = totalSubmissions > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalSubmissions).toFixed(1)
    : "0.0";

  const sentimentStats = {
    LOVED_IT: feedbacks.filter(f => f.sentiment === "LOVED_IT").length,
    HAPPY: feedbacks.filter(f => f.sentiment === "HAPPY").length,
    NEUTRAL: feedbacks.filter(f => f.sentiment === "NEUTRAL").length,
    SAD: feedbacks.filter(f => f.sentiment === "SAD").length,
    ANGRY: feedbacks.filter(f => f.sentiment === "ANGRY").length,
  };

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

  const getSentimentName = (sentiment: string) => {
    switch (sentiment) {
      case "LOVED_IT": return "Loved it";
      case "HAPPY": return "Happy";
      case "NEUTRAL": return "Neutral";
      case "SAD": return "Sad";
      case "ANGRY": return "Angry";
      default: return "Feedback";
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "LOVED_IT": return "text-pink-400 bg-pink-500/10 border-pink-500/20";
      case "HAPPY": return "text-green-400 bg-green-500/10 border-green-500/20";
      case "NEUTRAL": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "SAD": return "text-orange-400 bg-orange-500/10 border-orange-500/20";
      case "ANGRY": return "text-red-400 bg-red-500/10 border-red-500/20";
      default: return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  // Filter feedbacks
  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesSearch =
      feedback.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (feedback.feedbackText && feedback.feedbackText.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (feedback.selectedChips && feedback.selectedChips.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSentiment = sentimentFilter === "ALL" || feedback.sentiment === sentimentFilter;

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "PENDING" && !feedback.isApproved) ||
      (statusFilter === "APPROVED" && feedback.isApproved);

    return matchesSearch && matchesSentiment && matchesStatus;
  });

  return (
    <main className="min-h-screen bg-[#111111] text-[#FDFBF7] p-6 sm:p-12 animate-fadeIn">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-800/60 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="h-6 w-6 text-[#D4AF37]" />
              <h1 className="text-3xl font-serif font-bold tracking-wide">Customer Feedbacks</h1>
            </div>
            <p className="text-sm text-gray-400 font-sans font-light">Monitor customer experience, approve direct reviews, and delete spam comments.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/analytics" className="text-xs uppercase tracking-widest text-gray-400 hover:text-[#D4AF37] font-bold">
              <ArrowLeft className="inline h-4 w-4 mr-1" /> Back To Dashboard
            </Link>
            <button
              onClick={refresh}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-800 bg-[#161616] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-300 hover:border-[#D4AF37]/60 hover:text-[#D4AF37] disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-900/30 bg-red-950/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Average Rating */}
          <div className="rounded-3xl border border-gray-800/60 bg-[#161616]/60 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Average Score</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold font-mono text-[#D4AF37]">{averageRating}</span>
                <span className="text-gray-500 text-sm">/ 5.0</span>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= Math.round(parseFloat(averageRating));
                return (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${filled ? "fill-[#D4AF37] text-[#D4AF37]" : "text-gray-700"}`}
                  />
                );
              })}
              <span className="text-xs text-gray-500 ml-2">({totalSubmissions} submissions)</span>
            </div>
          </div>

          {/* Sentiment Distribution */}
          <div className="rounded-3xl border border-gray-800/60 bg-[#161616]/60 p-6 shadow-sm flex flex-col justify-between lg:col-span-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Sentiment Distribution</p>
              <div className="grid grid-cols-5 gap-2 text-center">
                {Object.entries(sentimentStats).map(([sent, count]) => {
                  const percent = totalSubmissions > 0
                    ? Math.round((count / totalSubmissions) * 100)
                    : 0;
                  return (
                    <div key={sent} className="space-y-2 p-2 rounded-xl bg-[#111111]/80 border border-gray-800/40">
                      <div className="text-xl">{getSentimentEmoji(sent)}</div>
                      <div className="text-xs font-semibold text-gray-400 font-mono">{percent}%</div>
                      <div className="text-[9px] uppercase tracking-wider text-gray-600 font-bold">({count})</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Filters and List */}
        <div className="rounded-3xl border border-gray-800/60 bg-[#161616] p-6 shadow-sm">
          
          {/* Moderation Status Tabs Row */}
          <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-gray-800/60 pb-4">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === "ALL"
                  ? "bg-[#D4AF37] text-[#111111]"
                  : "bg-[#111111] text-gray-400 hover:text-white"
              }`}
            >
              All Submissions
            </button>
            <button
              onClick={() => setStatusFilter("PENDING")}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === "PENDING"
                  ? "bg-[#D4AF37] text-[#111111]"
                  : "bg-orange-500/10 text-orange-400 border border-orange-500/25 hover:bg-orange-500/15"
              }`}
            >
              Pending Approval ({feedbacks.filter(f => !f.isApproved).length})
            </button>
            <button
              onClick={() => setStatusFilter("APPROVED")}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === "APPROVED"
                  ? "bg-[#D4AF37] text-[#111111]"
                  : "bg-green-500/10 text-green-400 border border-green-500/25 hover:bg-green-500/15"
              }`}
            >
              Approved ({feedbacks.filter(f => f.isApproved).length})
            </button>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSentimentFilter("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  sentimentFilter === "ALL"
                    ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/35"
                    : "bg-[#111111] text-gray-400 hover:text-white"
                }`}
              >
                All Emotions
              </button>
              {["LOVED_IT", "HAPPY", "NEUTRAL", "SAD", "ANGRY"].map((sent) => (
                <button
                  key={sent}
                  onClick={() => setSentimentFilter(sent)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                    sentimentFilter === sent
                      ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/35"
                      : "bg-[#111111] text-gray-400 hover:text-white"
                  }`}
                >
                  <span>{getSentimentEmoji(sent)}</span>
                  <span className="hidden sm:inline">{getSentimentName(sent)}</span>
                </button>
              ))}
            </div>

            <div className="relative min-w-[280px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, text or chips..."
                className="w-full rounded-xl border border-gray-800 bg-[#111111] px-10 py-3 text-xs text-white outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* List Wrapper */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 text-[#D4AF37] animate-spin mx-auto mb-4" />
                <p className="text-xs uppercase tracking-widest text-gray-500">Loading reviews...</p>
              </div>
            ) : filteredFeedbacks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-800 bg-[#111111] p-12 text-center text-sm text-gray-500">
                No customer feedbacks found matching your filters.
              </div>
            ) : (
              filteredFeedbacks.map((feedback) => (
                <div
                  key={feedback.id}
                  className="rounded-2xl border border-gray-800 bg-[#111111] p-6 space-y-4 hover:border-[#D4AF37]/30 transition-all duration-200"
                >
                  <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-800/40 pb-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-bold uppercase tracking-wider text-[#FDFBF7]">
                        {feedback.customerName}
                      </span>
                      {feedback.orderId ? (
                        <Link
                          href={`/admin/orders?search=${feedback.orderId}`}
                          className="text-[9px] font-bold font-mono text-[#D4AF37] hover:underline bg-[#D4AF37]/10 px-2.5 py-0.5 rounded border border-[#D4AF37]/20"
                        >
                          Verified Order #MG-000{feedback.orderId}
                        </Link>
                      ) : (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-green-400 bg-green-500/10 px-2.5 py-0.5 rounded border border-green-500/20">
                          Homepage Review
                        </span>
                      )}
                      
                      {/* Approval Status Badge */}
                      <span className={`text-[8.5px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                        feedback.isApproved
                          ? "text-green-400 bg-green-500/10 border border-green-500/20"
                          : "text-orange-400 bg-orange-500/10 border border-orange-500/20 animate-pulse"
                      }`}>
                        {feedback.isApproved ? "Approved" : "Pending Approval"}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-500">
                      {new Date(feedback.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </header>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider border ${getSentimentColor(feedback.sentiment)}`}>
                      <span>{getSentimentEmoji(feedback.sentiment)}</span>
                      <span>{getSentimentName(feedback.sentiment)}</span>
                    </span>
                    <span className="text-xs text-gray-500 font-mono flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < feedback.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-gray-800"}`}
                        />
                      ))}
                    </span>
                  </div>

                  {feedback.selectedChips && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Suggestions Selected</p>
                      <div className="flex flex-wrap gap-1.5">
                        {feedback.selectedChips.split(",").map((chip, idx) => (
                          <span
                            key={idx}
                            className="bg-[#161616] border border-gray-800 text-gray-400 rounded-full px-3 py-1 text-[10px]"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {feedback.feedbackText && (
                    <div className="space-y-1.5 bg-[#0A0A0A]/50 border border-gray-800/40 rounded-xl p-4">
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Comments Log</p>
                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans font-light">
                        "{feedback.feedbackText}"
                      </p>
                    </div>
                  )}

                  {feedback.productImageUrl && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Uploaded Photo</p>
                      <a href={feedback.productImageUrl} target="_blank" rel="noopener noreferrer" className="inline-block relative w-32 h-32 rounded-xl overflow-hidden border border-gray-800 bg-[#161616] group">
                        <img
                          src={feedback.productImageUrl}
                          alt="Customer uploaded bottle or package"
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </a>
                    </div>
                  )}

                  {/* Action Moderation Bar */}
                  <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-800/40 mt-2">
                    <div>
                      {!feedback.isApproved ? (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => approveFeedback(feedback.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-[#FDFBF7] text-[11px] font-bold uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-md hover:shadow-green-600/10"
                          >
                            <Check className="h-3.5 w-3.5" /> Approve Review
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("क्या आप वाकई इस रिव्यू को रिजेक्ट और डिलीट करना चाहते हैं?")) {
                                deleteFeedback(feedback.id);
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 text-red-400 text-[11px] font-bold uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
                          >
                            <Trash className="h-3.5 w-3.5" /> Reject / Delete
                          </button>
                        </div>
                      ) : (
                        <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-1">
                          <span>✓</span> Live on Storefront Testimonials
                        </p>
                      )}
                    </div>

                    {feedback.isApproved && (
                      <button
                        onClick={() => {
                          if (confirm("क्या आप वाकई इस लाइव रिव्यू को डिलीट करना चाहते हैं?")) {
                            deleteFeedback(feedback.id);
                          }
                        }}
                        className="inline-flex items-center gap-1 text-[10px] text-gray-500 hover:text-red-400 font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        <Trash className="h-3 w-3" /> Delete Review
                      </button>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-800/60 pt-6 mt-10">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-4 py-2 border border-gray-800 bg-[#161616] rounded-xl text-xs font-bold text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
              >
                Previous
              </button>
              <span className="text-xs font-mono text-gray-400">
                Page <span className="text-[#D4AF37] font-bold">{page + 1}</span> of <span className="text-white font-bold">{totalPages}</span>
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page === totalPages - 1}
                className="px-4 py-2 border border-gray-800 bg-[#161616] rounded-xl text-xs font-bold text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
