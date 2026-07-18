"use client";
import React from 'react';
import Link from 'next/link';

export default function FooterSection() {
  return (
    <footer className="w-full relative z-10">
      
      {/* 1. OUR STORY / BRAND PHILOSOPHY BLOCK (Cream Background) */}
      <div className="mx-auto max-w-7xl px-6 md:px-16 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-16 border-b border-gray-200">
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase">
              Our Roots & Heritage
            </span>
            <h3 className="mt-3 font-serif text-2xl font-bold tracking-wide md:text-4xl text-[#111111]">
              गाँव की माटी, असली स्वाद और शुद्धता की कहानी
            </h3>
            <p className="mt-5 text-sm tracking-wide leading-relaxed text-gray-600 font-light">
              MadhurGram की शुरुआत गाँव की माटी से जुड़े असली और प्राकृतिक उत्पादों को सीधे आप तक पहुँचाने के संकल्प से हुई है। हमारा दानेदार देसी घी, पारंपरिक जैविक गुड़ (Jaggery), हाथ से तैयार पारंपरिक अचार, और लकड़ी के कोल्हू से निकला शुद्ध तेल—ये सभी उत्पाद गोपीगंज के खेतों और किसानों की सीधी देखरेख में तैयार होते हैं। मशीनों और रसायनों से कोसों दूर, मिट्टी की सौंधी खुशबू और प्राचीन धरोहर को सहेजते हुए, हम गाँव का असली और प्राकृतिक स्वाद आपके रसोई घर तक पहुँचाते हैं।
            </p>
          </div>
          <div className="flex flex-col justify-end lg:items-end">
            <div className="border border-[#D4AF37]/30 bg-white p-6 rounded-xl max-w-md shadow-sm">
              <h4 className="font-serif text-lg font-bold text-[#D4AF37] mb-2">100% Direct From Village Farms</h4>
              <p className="text-xs text-gray-600 leading-relaxed font-light">
                हमारा हर उत्पाद गोपीगंज (भदोही) के स्थानीय किसानों, पशुपालकों और कारीगरों की प्राचीन विधियों और सीधी भागीदारी से तैयार होता है। बिना किसी मिलावट, रसायनों या कृत्रिम मिठास के—सिर्फ शुद्ध गाँव की असली मिठास।
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BLACK SITEMAP & TRUST SECTION (with a sharp golden border and centerpiece badge) */}
      <div className="w-full bg-[#050505] text-[#FDFBF7] pt-20 pb-10 px-6 md:px-16 border-t border-[#D4AF37]/60 relative z-0 mt-12">
        {/* Centerpiece decorative gold star emblem placed exactly on the border seam */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
          <div className="bg-[#050505] border border-[#D4AF37]/45 px-3.5 py-1.5 rounded-full text-[#D4AF37] text-[8.5px] tracking-[0.25em] font-extrabold uppercase select-none flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.45)]">
            <span>✦</span> MADHURGRAM <span>✦</span>
          </div>
        </div>
        <div className="mx-auto max-w-7xl">
          
          {/* Sitemap columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-16 border-b border-gray-800/50">
            {/* Column 1: Brand Info */}
            <div className="space-y-4">
              <div className="relative h-14 w-52 flex items-center justify-start">
                <img 
                  src="/images/newlogo.svg?v=2" 
                  alt="MadhurGram Logo" 
                  className="h-full w-full object-contain object-left" 
                />
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                गोपीगंज (उत्तर प्रदेश) की पावन मिट्टी से सीधे आपके घर तक। हम पारंपरिक स्वाद, प्राचीन शुद्धता और जैविक गुणवत्ता को बनाए रखने के लिए समर्पित हैं।
              </p>
            </div>

            {/* Column 2: Products Links */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Our Products</h4>
              <ul className="space-y-2.5 text-xs text-gray-400">
                <li>
                  <a href="#products" className="hover:text-[#D4AF37] transition-colors">A2 Cow Ghee</a>
                </li>
                <li>
                  <a href="#products" className="hover:text-[#D4AF37] transition-colors">Premium Buffalo Ghee</a>
                </li>
                <li>
                  <a href="#products" className="hover:text-[#D4AF37] transition-colors">Artisanal Pickles</a>
                </li>
                <li>
                  <a href="#products" className="hover:text-[#D4AF37] transition-colors">Cold-Pressed Oils</a>
                </li>
              </ul>
            </div>

            {/* Column 3: Customer Care */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Customer Care</h4>
              <ul className="space-y-2.5 text-xs text-gray-400">
                <li>
                  <Link href="/my-orders" className="hover:text-[#D4AF37] transition-colors">
                    Track My Orders
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-[#D4AF37] transition-colors">
                    Easy Returns
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-[#D4AF37] transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-[#D4AF37] transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="hover:text-[#D4AF37] transition-colors">
                    Cancellation & Refund Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Village Office</h4>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                Gopiganj, Bhadohi District,<br />
                Uttar Pradesh - 221303, India
              </p>
              <p className="text-xs text-gray-400">
                <span className="font-semibold text-gray-300">Helpline:</span> +91 99887 76655<br />
                <span className="font-semibold text-gray-300">Email:</span> support@madhurgram.com
              </p>
              {/* Social Media Links */}
              <div className="pt-2">
                <h5 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2.5">Follow Our Journey</h5>
                <div className="flex items-center gap-3">
                  <a href="https://instagram.com/madhurgram" target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full bg-[#161616] border border-gray-800/80 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all duration-300">
                    <svg className="h-4 w-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a href="https://youtube.com/@madhurgram" target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full bg-[#161616] border border-gray-800/80 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all duration-300">
                    <svg className="h-4 w-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>
                  </a>
                  <a href="https://facebook.com/madhurgram" target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full bg-[#161616] border border-gray-800/80 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all duration-300">
                    <svg className="h-4 w-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </a>
                  <a href="https://wa.me/919988776655" target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full bg-[#161616] border border-gray-800/80 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all duration-300">
                    <svg className="h-4 w-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Info */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-10 border-b border-gray-800/50">
            {/* FSSAI Block */}
            <div className="flex items-center gap-3.5 border border-gray-800/80 bg-[#0d0d0d] px-4 py-2.5 rounded-xl hover:border-[#D4AF37]/20 transition-all duration-300 select-none">
              <div className="text-[11px] font-extrabold tracking-widest text-[#D4AF37] border-2 border-[#D4AF37] px-1.5 py-0.5 rounded font-mono leading-none">
                fssai
              </div>
              <span className="text-[10px] text-gray-400 font-light tracking-wide leading-tight">
                पंजीकरण संख्या / Reg. No.<br />
                <span className="font-semibold text-gray-300 font-mono">22724999000123</span>
              </span>
            </div>

            {/* Secure Payment Block */}
            <div className="flex flex-wrap items-center gap-2.5 text-gray-500 text-[10px]">
              <span className="font-semibold uppercase tracking-wider text-[#D4AF37] text-[9px] mr-1">100% Safe Payments:</span>
              <span className="bg-[#0f0f0f] px-2 py-1 rounded border border-gray-800/80 text-gray-400 font-bold font-mono text-[9px] hover:border-gray-700 hover:text-gray-300 transition-colors">UPI</span>
              <span className="bg-[#0f0f0f] px-2 py-1 rounded border border-gray-800/80 text-gray-400 font-bold font-mono text-[9px] hover:border-gray-700 hover:text-gray-300 transition-colors">COD</span>
              <span className="bg-[#0f0f0f] px-2 py-1 rounded border border-gray-800/80 text-gray-400 font-bold font-mono text-[9px] hover:border-gray-700 hover:text-gray-300 transition-colors">CARD</span>
              <span className="bg-[#0f0f0f] px-2 py-1 rounded border border-gray-800/80 text-gray-400 font-bold font-mono text-[9px] hover:border-gray-700 hover:text-gray-300 transition-colors">NETBANKING</span>
            </div>
          </div>

          {/* Copyright Info */}
          <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-500 tracking-wider">
            <div>
              <span>© {new Date().getFullYear()} MadhurGram Food Products. All Rights Reserved.</span>
            </div>
            <div className="text-[10px] text-gray-600 font-light flex items-center gap-1">
              Made with love in Uttar Pradesh, India 🌾
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}