"use client";
import React from 'react';

export default function FooterSection() {
  return (
    <footer className="w-full bg-[#111111] text-[#FDFBF7] pt-20 pb-10 px-6 md:px-16 border-t border-gray-800/30">
      <div className="mx-auto max-w-7xl">
        
        {/* 1. OUR STORY / BRAND PHILOSOPHY BLOCK */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-16 border-b border-gray-800/50">
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase">
              Our Roots & Heritage
            </span>
            <h3 className="mt-3 font-serif text-2xl font-bold tracking-wide md:text-4xl text-[#FDFBF7]">
              पारंपरिक बिलोना विधि और शुद्धता की कहानी
            </h3>
            <p className="mt-5 text-sm tracking-wide leading-relaxed text-gray-400 font-light">
              MadhurGram की शुरुआत मिट्टी की खुशबू और शुद्धता के संकल्प के साथ हुई है। हमारा देसी घी मशीनों से नहीं, बल्कि गोपीगंज के किसानों द्वारा पारंपरिक **मथानी और बिलोना विधि** से तैयार किया जाता है। हम मिट्टी के बर्तनों में दूध को धीमी आंच पर पकाते हैं ताकि उसके प्राकृतिक पोषक तत्व और असली दानेदार स्वाद बना रहे।
            </p>
          </div>
          <div className="flex flex-col justify-end lg:items-end">
            <div className="border border-[#D4AF37]/20 bg-[#161616] p-6 rounded-xl max-w-md">
              <h4 className="font-serif text-lg font-bold text-[#D4AF37] mb-2">100% Farmers Ecosystem</h4>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                हमारा हर बैच गोपीगंज (भदोही) के स्थानीय पशुपालकों और किसानों की सीधी देखरेख में बनता है। कोई मिलावट नहीं, कोई केमिकल्स नहीं—सिर्फ शुद्ध ग्रामीण धरोहर।
              </p>
            </div>
          </div>
        </div>

        {/* 2. NAVIGATION & COPYRIGHT FOOTER ROW */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-500 tracking-wider">
          <div className="flex items-center space-x-3">
            <span className="font-serif font-bold text-[#FDFBF7] tracking-widest text-sm">
              Madhur<span className="text-[#D4AF37]">Gram</span>
            </span>
            <span>© {new Date().getFullYear()} All Rights Reserved.</span>
          </div>
          
          <div className="flex space-x-8">
            <a href="#ghee" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</a>
            <a href="#story" className="hover:text-[#D4AF37] transition-colors">Terms of Service</a>
            <a href="#products" className="hover:text-[#D4AF37] transition-colors">Contact Us</a>
          </div>
        </div>

      </div>
    </footer>
  );
}