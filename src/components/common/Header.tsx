"use client";
import React, { useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';

interface HeaderProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  onCartClick: () => void; 
  cartCount: number; // लाइव कार्ट काउंट प्रोप
  cartPulse?: boolean;
}

export default function Header({ activeCategory, setActiveCategory, onCartClick, cartCount, cartPulse }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    { name: 'Dairy', slug: 'dairy' },
    { name: 'Sweeteners', slug: 'sweeteners' },
    { name: 'Oils', slug: 'oils' },
    { name: 'Pickles', slug: 'pickles' },
    { name: 'Shop All', slug: 'shop-all' }
  ];

  const handleCategoryClick = (slug: string) => {
    setActiveCategory(slug);
    setIsMenuOpen(false);
    
    // 50ms का छोटा सा डिले ताकि React स्टेट पहले सिंक हो जाए, फिर स्मूथ स्क्रॉल हो
    setTimeout(() => {
      const element = document.getElementById('products');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <header className="sticky top-0 left-0 z-50 w-full bg-[#050505] px-6 py-4 md:px-16 border-b border-gray-800/40">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* LEFT: LOGO */}
        <div className="flex items-center cursor-pointer" onClick={() => handleCategoryClick('shop-all')}>
          <div className="relative h-20 w-72 flex items-center justify-start group">
            {/* Continuous subtle gold pulse aura */}
            <div className="absolute inset-y-1 inset-x-2 bg-[#D4AF37]/5 rounded-xl blur-md animate-pulse pointer-events-none" />
            {/* Additional glow on hover */}
            <div className="absolute inset-0 bg-[#D4AF37]/8 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <img 
              src="/images/newlogo.svg?v=2" 
              alt="MadhurGram Logo" 
              className="h-full w-full object-contain object-left relative z-10 transition-all duration-300 group-hover:scale-[1.04]" 
            />
          </div>
        </div>

        {/* CENTER: NAVIGATION MENU WITH ACTIVE STATE */}
        <nav className="hidden space-x-12 md:flex items-center">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`text-xs uppercase tracking-[0.25em] font-semibold cursor-pointer transition-all duration-300 relative ${
                activeCategory === cat.slug ? 'text-[#D4AF37]' : 'text-[#FDFBF7] hover:text-[#D4AF37]'
              }`}
            >
              {cat.name}
              {activeCategory === cat.slug && (
                <span className="absolute bottom-[-6px] left-0 h-[1px] w-full bg-[#D4AF37]" />
              )}
            </button>
          ))}
        </nav>

        {/* RIGHT: CART STATUS */}
        <div className="flex items-center text-[#FDFBF7]">
          <button 
            onClick={onCartClick} 
            className={`flex items-center space-x-2.5 px-3 py-1.5 transition-all group ${cartPulse ? 'animate-pulse text-[#D4AF37]' : 'hover:text-[#D4AF37]'}`}
          >
            <ShoppingBag className="h-5 w-5 text-[#FDFBF7] group-hover:text-[#D4AF37]" />
            <span className="font-mono text-sm tracking-widest text-[#FDFBF7] group-hover:text-[#D4AF37]">
              [ <span className="text-[#D4AF37] font-bold">{cartCount}</span> ]
            </span>
          </button>

          {/* Mobile Menu Icon */}
          <button className="ml-4 md:hidden p-1.5 text-[#FDFBF7] hover:text-[#D4AF37]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#111111] border-b border-gray-800 px-8 py-8 md:hidden">
          <nav className="flex flex-col space-y-6">
            {categories.map((cat, index) => (
              <button
                key={index}
                onClick={() => handleCategoryClick(cat.slug)}
                className={`text-left text-xs font-bold tracking-[0.2em] uppercase transition-colors ${
                  activeCategory === cat.slug ? 'text-[#D4AF37]' : 'text-[#FDFBF7] hover:text-[#D4AF37]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}