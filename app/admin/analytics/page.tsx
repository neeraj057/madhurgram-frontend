"use client";
import React from "react";
import { RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAdminAnalytics } from "../../hooks/useAdminAnalytics"; 
import { AnalyticsGrid } from "../../../components/AnalyticsGrid";

export default function AdminAnalyticsPage() {
  const { metrics, loading, error, fetchAnalytics } = useAdminAnalytics();

  return (
    <main className="min-h-screen bg-[#111111] text-[#FDFBF7] p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800 pb-6">
          <div>
            <div className="flex items-center space-x-4 mb-2">
              <Link href="/admin" className="text-gray-500 hover:text-[#D4AF37] transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-3xl font-serif font-bold text-[#D4AF37] tracking-wide">
                Overview Dashboard
              </h1>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-widest ml-9">
              Live Village Grid Analytics
            </p>
          </div>
          
          {/* 👉 ये रहा वो SYNC DATA बटन! */}
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-[#161616] border border-gray-800 rounded-lg text-xs font-bold text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-[#D4AF37]" : ""}`} />
            <span>Sync Data</span>
          </button>
        </div>

        {/* 📊 Analytics Grid UI */}
        <AnalyticsGrid metrics={metrics} loading={loading} error={error} />

      </div>
    </main>
  );
}