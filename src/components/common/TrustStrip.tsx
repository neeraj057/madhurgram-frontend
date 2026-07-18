"use client";

import React from 'react';
import { Sprout, ShieldCheck, Users, Award } from 'lucide-react';

export default function TrustStrip() {
  const promises = [
    {
      icon: <Award className="h-6 w-6 text-[#D4AF37]" />,
      title: "पारंपरिक बिलोना विधि",
      englishTitle: "Traditional Bilona Ghee",
      description: "हमारा घी पारंपरिक रूप से गाय के दूध से दही बनाकर, फिर मथनी से मथकर (बिलोना विधि) तैयार किया जाता है, न कि दूध की मलाई से।",
      englishDesc: "Churned from curd using traditional wooden churners, preserving maximum nutrition and granular texture."
    },
    {
      icon: <Sprout className="h-6 w-6 text-[#D4AF37]" />,
      title: "100% जैविक और शुद्ध",
      englishTitle: "100% Organic & Pure",
      description: "रसायनों, कृत्रिम मिठास और मिलावट से कोसों दूर। हमारे अचार, गुड़ और तेल पारंपरिक रूप से बिना किसी प्रिज़र्वेटिव के तैयार होते हैं।",
      englishDesc: "Grown organically and processed without chemicals, sulfur, or artificial preservatives."
    },
    {
      icon: <Users className="h-6 w-6 text-[#D4AF37]" />,
      title: "सीधे किसानों से sourced",
      englishTitle: "Directly Farm Sourced",
      description: "गोपीगंज (भदोही) के खेतों और पशुपालकों से सीधा जुड़ाव। हर खरीदारी सीधे ग्रामीण अर्थव्यवस्था और किसानों को मज़बूत करती है।",
      englishDesc: "Directly sourced from Bhadohi local farmers, ensuring fair prices and fresh batches."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-[#D4AF37]" />,
      title: "लैब प्रमाणित गुणवत्ता",
      englishTitle: "Lab Tested Purity",
      description: "हमारे सभी उत्पादों की शुद्धता और गुणवत्ता का कड़ा परीक्षण किया जाता है, ताकि आप तक सिर्फ सर्वोत्तम और सुरक्षित आहार पहुँचे।",
      englishDesc: "Rigorous quality checks ensuring zero adulteration, heavy metals, or chemical residue."
    }
  ];

  return (
    <section className="relative py-16 px-6 md:px-16 text-[#111111] overflow-hidden border-t border-gray-200/50">
      {/* Background Subtle Highlights */}
      <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-[#D4AF37]/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#D4AF37]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Title */}
        <div className="mb-12 text-center">
          <span className="text-[10px] font-bold tracking-[0.35em] text-[#D4AF37] uppercase">
            Our Promise of Purity
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-wide md:text-4xl capitalize">
            शुद्धता और प्राचीन धरोहर का संगम
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-light">
            (Why Choose MadhurGram)
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 select-none">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[#D4AF37] text-[10px]">✦</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((item, idx) => (
            <div 
              key={idx}
              className="group flex flex-col items-center text-center p-6 rounded-2xl border border-gray-200/70 bg-white/70 backdrop-blur-sm shadow-[0_4px_25px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_30px_rgba(212,175,55,0.06)] hover:border-[#D4AF37]/45 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Icon Container */}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF3E0] border border-[#D4AF37]/20 group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] transition-all duration-300 mb-5">
                <div className="group-hover:scale-110 group-hover:text-white transition-transform duration-300">
                  {React.cloneElement(item.icon, {
                    className: "h-5 w-5 text-[#D4AF37] group-hover:text-white transition-colors duration-300"
                  })}
                </div>
              </div>

              {/* Title (Hindi & English) */}
              <h3 className="text-base font-bold text-[#111111] tracking-wide mb-1 font-serif">
                {item.title}
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] mb-4">
                {item.englishTitle}
              </span>

              {/* Descriptions */}
              <p className="text-xs text-gray-700 leading-relaxed font-sans font-light mb-3">
                {item.description}
              </p>
              <p className="text-[10.5px] text-gray-400 italic leading-relaxed font-light border-t border-gray-100 pt-3 w-full">
                {item.englishDesc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
