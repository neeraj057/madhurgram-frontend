"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Clock, Eye, Database } from "lucide-react";

export default function PrivacyPolicyPage() {
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
            <Shield className="h-3.5 w-3.5" /> Purity & Trust
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-wide">Privacy Policy</h1>
          <p className="text-xs text-gray-500 tracking-wider uppercase font-mono">Last Updated: July 2026</p>
        </header>

        {/* Content Body */}
        <div className="space-y-8 text-sm leading-relaxed text-gray-700 font-light">
          <p>
            At MadhurGram, we respect your privacy and are committed to protecting the personal data of our customers who enjoy Gopiganj's traditional Bilona products. This policy describes how we collect, store, and utilize your personal information.
          </p>

          <section className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-[#111111] flex items-center gap-2">
              <Database className="h-5 w-5 text-[#D4AF37]" /> 1. Information We Collect
            </h2>
            <p>
              We collect the minimal required information necessary to deliver pure organic products to your doorstep:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Delivery Details:</strong> Customer name, shipping address, and active telephone numbers (used for dispatch and Twilio tracking messages).</li>
              <li><strong>Payment Logs:</strong> All transactions are securely routed through certified UPI/Razorpay channels. MadhurGram does not store raw credit card details or net-banking logs on our databases.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-[#111111] flex items-center gap-2">
              <Eye className="h-5 w-5 text-[#D4AF37]" /> 2. How We Use Your Data
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To ship, track, and manage your dairy and sweet order logistics.</li>
              <li>To send order confirmation, dispatch notes, and automated delivery links.</li>
              <li>To gather verified user feedback to improve packaging and taste.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-[#111111] flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#D4AF37]" /> 3. Data Retention & Erasure
            </h2>
            <p>
              Your delivery profile records remain stored securely in our database to facilitate subsequent fast ordering. However, inactive shopping carts are automatically deleted after <strong>48 hours</strong> to keep database assets clean. You can request record erasure by contacting <a href="mailto:support@madhurgram.com" className="text-[#D4AF37] hover:underline font-normal">support@madhurgram.com</a>.
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
