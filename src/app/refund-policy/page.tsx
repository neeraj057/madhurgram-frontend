"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, AlertCircle, HelpCircle } from "lucide-react";

export default function RefundPolicyPage() {
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
            <RefreshCw className="h-3.5 w-3.5" /> Return Standards
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-wide">Cancellation & Refund</h1>
          <p className="text-xs text-gray-500 tracking-wider uppercase font-mono">Last Updated: July 2026</p>
        </header>

        {/* Content Body */}
        <div className="space-y-8 text-sm leading-relaxed text-gray-700 font-light">
          <p>
            Thank you for shopping at MadhurGram. We want to ensure a clear and transparent cancellation and refund process for all our customers.
          </p>

          <section className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-[#111111] flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-[#D4AF37]" /> 1. Order Cancellations
            </h2>
            <p>
              Orders can be canceled within <strong>2 hours</strong> of placement or before they are dispatched (whichever comes first). Once shipped from Gopiganj, cancellations cannot be processed.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-[#111111] flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-[#D4AF37]" /> 2. Returns & Food Safety
            </h2>
            <p>
              As we ship natural food products (ghee, honey, sweets), we **do not accept returns** once a container seal has been broken.
            </p>
            <p>
              If you receive a defective or damaged product (e.g. glass bottle breakage during transit), please share a photo of the box and product with us within <strong>24 hours</strong> of delivery at <a href="mailto:support@madhurgram.com" className="text-[#D4AF37] hover:underline font-normal">support@madhurgram.com</a> to get a free replacement or complete refund.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-[#111111] flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-[#D4AF37]" /> 3. Refund Timelines
            </h2>
            <p>
              Once a refund request is approved, the funds are credited back to your original source of payment (Bank account, Credit Card, or UPI) within <strong>5 to 7 business days</strong>.
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
