"use client";
 
import React from 'react';

const BilonaIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
    <line x1="32" y1="8" x2="32" y2="44" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M22 38H42" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M19 24C19 18 23 17 32 17C41 17 45 18 45 24C45 37 41 48 32 48C23 48 19 37 19 24Z" stroke="#D4AF37" strokeWidth="2" strokeLinejoin="round" fill="#FAF3E0" />
    <ellipse cx="32" cy="17" rx="9" ry="2.5" stroke="#D4AF37" strokeWidth="2" fill="#ffffff" />
    <path d="M23 28C26 27 28 29 32 28C36 27 38 29 41 28" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M25 34C28 33 30 35 34 34C38 33 40 35 43 34" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
  </svg>
);

const OrganicIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
    <circle cx="32" cy="26" r="10" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
    <path d="M16 48C24 48 28 46 32 46C36 46 40 48 48 48" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
    <path d="M32 46V24C32 20 37 15 43 18" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M32 34C27 32 23 26 26 22C29 22 32 27 32 30" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#FAF3E0" />
    <path d="M32 27C37 26 41 20 38 16C35 16 32 21 32 24" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#FAF3E0" />
  </svg>
);

const FarmIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
    <circle cx="44" cy="20" r="4" stroke="#D4AF37" strokeWidth="1.5" fill="#ffffff" />
    <path d="M14 44L22 33L30 44" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
    <path d="M26 44H46V34L36 27L26 34V44Z" stroke="#D4AF37" strokeWidth="2" strokeLinejoin="round" fill="#FAF3E0" />
    <path d="M24 34L36 25L48 34" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="33" y="37" width="6" height="7" rx="1" stroke="#D4AF37" strokeWidth="1.5" fill="#ffffff" />
    <path d="M16 48H48" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
    <path d="M18 52H46" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
  </svg>
);

const QualityIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
    <path d="M26 36V50L32 46L38 50V36" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#FAF3E0" />
    <circle cx="32" cy="25" r="15" stroke="#D4AF37" strokeWidth="2" fill="#FAF3E0" />
    <circle cx="32" cy="25" r="11" stroke="#D4AF37" strokeWidth="1" strokeDasharray="2 2" fill="#ffffff" />
    <path d="M28 25L31 28L36 21" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function TrustStrip() {
  const promises = [
    {
      icon: <BilonaIcon />,
      title: "धीमी आँच पर पका घी",
      englishTitle: "Traditional Slow-Cooked Ghee",
      description: "हमारा घी 100% ताज़ा शुद्ध मलाई को धीमी आँच पर तपाकर पारंपरिक विधि से तैयार किया जाता है, जिससे इसकी सोंधी महक और प्राकृतिक दानेदार बनावट बनी रहती है।",
      englishDesc: "Slow-cooked on low flame from pure fresh cream, preserving authentic village aroma and granular texture."
    },
    {
      icon: <OrganicIcon />,
      title: "100% जैविक और शुद्ध",
      englishTitle: "100% Organic & Pure",
      description: "रसायनों, कृत्रिम मिठास और मिलावट से कोसों दूर। हमारे अचार, गुड़ और तेल पारंपरिक रूप से बिना किसी प्रिज़र्वेटिव के तैयार होते हैं।",
      englishDesc: "Grown organically and processed without chemicals, sulfur, or artificial preservatives."
    },
    {
      icon: <FarmIcon />,
      title: "सीधे किसानों से sourced",
      englishTitle: "Directly Farm Sourced",
      description: "गोपीगंज (भदोही) के खेतों और पशुपालकों से सीधा जुड़ाव। हर खरीदारी सीधे ग्रामीण अर्थव्यवस्था और किसानों को मज़बूत करती है।",
      englishDesc: "Directly sourced from Bhadohi local farmers, ensuring fair prices and fresh batches."
    },
    {
      icon: <QualityIcon />,
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
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF3E0]/70 border border-[#D4AF37]/25 shadow-sm group-hover:bg-white group-hover:border-[#D4AF37]/50 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300 mb-5">
                <div className="group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
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
