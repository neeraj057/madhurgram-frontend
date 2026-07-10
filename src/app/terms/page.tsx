"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Truck, ShieldAlert, Award } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#111111] py-16 px-6 sm:px-12 relative overflow-hidden">
      <div className="max-w-3xl mx-auto space-y-10 relative z-10">
        
        {/* Back navigation */}
        <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-[#D4AF37] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Store
        </Link>

        {/* Page Header */}
        <header className="space-y-4 border-b border-gray-200 pb-8">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full px-4 py-1 text-xs text-[#D4AF37] font-semibold">
            <BookOpen className="h-3.5 w-3.5" /> Client Agreement
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-wide">Terms & Conditions</h1>
          <p className="text-xs text-gray-500 tracking-wider uppercase font-mono">Last Updated: July 2026</p>
        </header>

        {/* Content Body */}
        <div className="space-y-8 text-sm leading-relaxed text-gray-700 font-light">
          <p>
            Welcome to MadhurGram. By accessing this store and buying our traditional food products, you agree to comply with the terms and conditions outlined below.
          </p>

          <section className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-[#111111] flex items-center gap-2">
              <Award className="h-5 w-5 text-[#D4AF37]" /> 1. Freshness & Traditional Variation
            </h2>
            <p>
              All MadhurGram products (including our hand-churned Bilona Cow Ghee) are handcrafted in small rural batches. Natural variations in grain size, color tone, and aroma are normal characteristics of traditional dairy processing and do not indicate product defects.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-[#111111] flex items-center gap-2">
              <Truck className="h-5 w-5 text-[#D4AF37]" /> 2. Delivery Terms
            </h2>
            <p>
              We ship orders using secure third-party delivery partners. While we strive to dispatch within 24-48 hours, MadhurGram is not responsible for transit delays caused by courier strikes, bad weather, or logistics bottlenecks.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-[#111111] flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-[#D4AF37]" /> 3. Liability Limitation
            </h2>
            <p>
              In no event shall MadhurGram or its farmers be liable for indirect, incidental, or consequential damages resulting from product purchase or consumption. Our total liability for any transaction claim is strictly capped at the paid invoice value.
            </p>
          </section>
        </div>

        {/* Footer contact */}
        <footer className="border-t border-gray-200 pt-8 text-center text-xs text-gray-500">
          MadhurGram © {new Date().getFullYear()} Gopiganj Traditional Heritage. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
