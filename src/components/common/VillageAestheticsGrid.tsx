import React from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';

const aesthetics = [
  {
    id: 1,
    src: '/images/aesthetics/aes_mustard_field.png',
    alt: 'Golden Mustard Fields',
    span: 'col-span-1 row-span-2'
  },
  {
    id: 2,
    src: '/images/aesthetics/aes_clay_pots.png',
    alt: 'Traditional Clay Pots',
    span: 'col-span-1 row-span-1'
  },
  {
    id: 3,
    src: '/images/aesthetics/aes_farmer_hands.png',
    alt: 'Farmer holding Jaggery',
    span: 'col-span-1 row-span-2'
  },
  {
    id: 4,
    src: '/images/aesthetics/aes_village_morning.png',
    alt: 'Misty Village Morning',
    span: 'col-span-1 row-span-1'
  }
];

export default function VillageAestheticsGrid() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-[#D4AF37] font-bold tracking-widest uppercase text-sm mb-2">Our Roots</p>
          <h2 className="text-3xl md:text-5xl font-serif text-[#111111] mb-4">
            Gaon Ki <span className="italic font-light">Asli Mithaas</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Experience the unfiltered, authentic life of our villages. Join our community and embrace the heritage we preserve in every jar.
          </p>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px]">
          {aesthetics.map((item) => (
            <div 
              key={item.id} 
              className={`relative rounded-2xl overflow-hidden group ${item.span} cursor-pointer`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                <Camera className="w-8 h-8 text-white mb-2" />
                <span className="text-white font-medium tracking-wide">@MadhurGram</span>
              </div>
            </div>
          ))}
          
          {/* Join Us Block */}
          <div className="col-span-2 md:col-span-1 bg-[#FDFBF7] rounded-2xl border border-[#E5E5E5] flex flex-col items-center justify-center p-8 text-center group hover:border-[#D4AF37] transition-colors cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-[#111111] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-serif text-xl text-[#111111] mb-2">Follow Our Journey</h3>
            <p className="text-sm text-gray-500 mb-4">See how we bring the village to your table every day.</p>
            <span className="text-[#D4AF37] font-bold text-sm tracking-wider uppercase">Follow Us</span>
          </div>
        </div>

      </div>
    </section>
  );
}
