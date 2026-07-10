"use client";

import React from "react";
import { Wrench, Phone, Mail, Sparkles } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FDFBF7] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Golden gradient glowing backdrops */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-xl w-full rounded-3xl border border-gray-800 bg-[#121212]/90 p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden backdrop-blur-md">
        
        {/* Pulsating logo header */}
        <div className="font-serif text-3xl font-bold tracking-widest text-[#FDFBF7] mb-8 select-none">
          Madhur<span className="text-[#D4AF37]">Gram</span>
        </div>

        {/* Animated glowing loader icon */}
        <div className="relative h-20 w-20 mx-auto mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-[#D4AF37]/20 animate-ping duration-1000" />
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#D4AF37]/40 animate-spin duration-3000" />
          <div className="h-12 w-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shadow-inner">
            <Wrench className="h-6 w-6 animate-pulse" />
          </div>
        </div>

        {/* Maintenance Message */}
        <h1 className="text-3xl font-serif font-bold text-[#FDFBF7] mb-4">
          🔧 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDFBF7] via-[#D4AF37] to-[#FDFBF7]">Scheduled Maintenance</span>
        </h1>
        
        <p className="text-gray-400 text-sm leading-relaxed mb-8 font-light">
          गोपीगंज के हमारे पारंपरिक बिलोना कारीगर और टेक्निकल टीम वेबसाइट पर कुछ नए और शुद्ध स्वाद के फीचर्स जोड़ रहे हैं। हम बहुत जल्द आपके अनुभव को और भी बेहतर बनाने के लिए वापस आएंगे। 💛
        </p>

        {/* Decorative Divider */}
        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-8" />

        {/* Support Helpdesks */}
        <div className="grid grid-cols-2 gap-4">
          <a
            href="tel:+919876543210"
            className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-800/80 bg-[#161616]/40 hover:bg-[#D4AF37]/5 hover:border-[#D4AF37]/30 transition-all group"
          >
            <Phone className="h-5 w-5 text-gray-500 group-hover:text-[#D4AF37] transition-all mb-2" />
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Call Support</span>
            <span className="text-[11px] font-mono text-gray-400 mt-1">+91 98765 43210</span>
          </a>

          <a
            href="mailto:support@madhurgram.com"
            className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-800/80 bg-[#161616]/40 hover:bg-[#D4AF37]/5 hover:border-[#D4AF37]/30 transition-all group"
          >
            <Mail className="h-5 w-5 text-gray-500 group-hover:text-[#D4AF37] transition-all mb-2" />
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Email Us</span>
            <span className="text-[11px] font-mono text-gray-400 mt-1">support@madhurgram.com</span>
          </a>
        </div>
        
        <div className="mt-8 inline-flex items-center gap-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full px-4 py-1.5 text-[10px] text-[#D4AF37] font-semibold tracking-wider uppercase animate-pulse">
          <Sparkles className="h-3 w-3" /> Purity Is Coming Back Soon
        </div>
      </div>
    </div>
  );
}
