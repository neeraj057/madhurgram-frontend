import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Leaf, ShieldCheck, HeartHandshake, ArrowRight } from "lucide-react";

export default function FarmToTableStory() {
  return (
    <section className="relative w-full bg-[#111111] text-white py-20 overflow-hidden">
      {/* Background Texture/Image Overlay */}
      <div className="absolute inset-0 opacity-20">
        <Image 
          src="/images/village_seamless_bg.png" 
          alt="Farm Background" 
          fill
          className="object-cover opacity-50 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/80 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold tracking-widest uppercase">
              <Leaf className="w-4 h-4" />
              <span>Our Heritage</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold font-serif leading-tight">
              From the Heart of <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F7D070]">
                Indian Villages
              </span>
            </h2>
            
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-xl font-light">
              We believe in the power of purity. Our journey starts in remote villages where traditional farming meets sustainable practices. Every jar of MadhurGram brings you the unfiltered, uncompromised essence of nature.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-gray-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">100% Pure</h4>
                  <p className="text-sm text-gray-500">No chemicals, no preservatives. Just nature in its purest form.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-gray-800 flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Fair Trade</h4>
                  <p className="text-sm text-gray-500">Empowering local farmers and preserving indigenous wisdom.</p>
                </div>
              </div>
            </div>

            <Link href="/blog" className="group mt-8 inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-[#D4AF37] hover:text-white transition-all duration-300 w-fit">
              Read Our Full Story
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right Images Layout */}
          <div className="relative h-[500px] lg:h-[600px] w-full hidden md:block">
            {/* Main Image */}
            <div className="absolute top-0 right-0 w-[80%] h-[80%] rounded-2xl overflow-hidden border-4 border-[#111111] shadow-2xl z-10">
              <Image 
                src="/images/hero_purity.png" 
                alt="Farmer working" 
                fill
                className="object-cover"
              />
            </div>
            {/* Secondary Image */}
            <div className="absolute bottom-0 left-0 w-[55%] h-[45%] rounded-2xl overflow-hidden border-4 border-[#111111] shadow-2xl z-20">
              <Image 
                src="/images/traditional_bilona_process.png" 
                alt="Traditional Bilona process" 
                fill
                className="object-cover"
              />
            </div>
            {/* Premium Badge */}
            <div className="absolute bottom-[40%] right-[10%] z-30 bg-[#111111]/80 backdrop-blur-md border border-[#D4AF37]/40 w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-2xl transition-transform hover:scale-110 duration-500">
              <div className="flex flex-col items-center justify-center rounded-full border border-dashed border-[#D4AF37]/40 w-32 h-32">
                <Leaf className="w-6 h-6 text-[#D4AF37] mb-1" />
                <span className="text-[9px] font-medium tracking-[0.3em] text-gray-300 uppercase mt-1">Certified</span>
                <span className="text-xl font-serif font-bold text-[#F7D070] tracking-wide">ORGANIC</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
