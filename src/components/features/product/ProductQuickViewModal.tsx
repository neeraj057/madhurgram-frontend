"use client";
import React from 'react';
import { X, ShieldCheck, Leaf, Flame } from 'lucide-react';
import { DEFAULT_PRODUCT_RATING } from '@/utils/constants';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  volume: string;
  imageUrl: string; 
  tag: string;
  category: string;
  stock: number;
  rating?: number;
}

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductQuickViewModal({ product, onClose, onAddToCart }: ProductQuickViewModalProps) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm transition-opacity duration-300">
      {/* Backdrop click close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Modal Box */}
      <div className="relative w-full max-w-3xl bg-[#FDFBF7] text-[#111111] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col md:flex-row z-10 max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible animate-fadeIn">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white border border-gray-200 hover:text-[#D4AF37] transition-colors z-20 shadow-sm"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Side: Product Image Showcase */}
        <div className="w-full md:w-1/2 bg-gray-50 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-200/60 min-h-[300px]">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="max-h-64 object-contain"
              onError={(e) => { e.currentTarget.src = "/images/newlogo.svg?v=2"; }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-lg bg-[#FAF9F5]/40 text-center p-8 select-none">
              <img 
                src="/images/newlogo.svg?v=2" 
                alt="MadhurGram Logo" 
                className="max-h-32 max-w-[85%] object-contain opacity-40 transition-all duration-300 hover:scale-105 hover:opacity-60" 
              />
            </div>
          )}
        </div>

        {/* Right Side: Luxury Heritage Story Details */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase">
              {product.category} • {product.tag}
            </span>
            <h3 className="font-serif text-2xl font-bold tracking-wide mt-2 text-[#111111]">
              {product.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-2 select-none">
              <div className="flex items-center gap-0.5 px-2 py-0.5 bg-yellow-500/10 rounded border border-yellow-500/25 text-[#D4AF37] text-xs font-bold font-mono">
                <span>★</span>
                <span>{product.rating ? Number(product.rating).toFixed(1) : DEFAULT_PRODUCT_RATING}</span>
              </div>
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                Customer Choice
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2 font-mono">{product.volume}</p>
            
            <div className="flex flex-col mt-4">
              {product.originalPrice && product.originalPrice > product.price ? (
                <span className="text-xs text-gray-400 line-through">MRP: ₹{product.originalPrice}</span>
              ) : null}
              <div className="text-2xl font-bold text-[#111111]">₹{product.price}</div>
            </div>
            
            <div className="mt-6 border-t border-gray-200/60 pt-4 space-y-4">
              <p className="text-xs text-gray-600 font-light leading-relaxed">
                MadhurGram brings you pure, unadulterated heritage essentials directly from our village farms. Crafted using traditional, slow-cooked methods passed down through generations to preserve natural nutrition and rich, authentic flavor.
              </p>
              
              {/* Trust Badges Inside Modal */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="flex flex-col items-center p-2 bg-white border border-gray-100 rounded-xl text-center">
                  <Leaf className="h-4 w-4 text-[#D4AF37] mb-1" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gray-700">100% Pure</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-white border border-gray-100 rounded-xl text-center">
                  <Flame className="h-4 w-4 text-[#D4AF37] mb-1" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Slow Cooked</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-white border border-gray-100 rounded-xl text-center">
                  <ShieldCheck className="h-4 w-4 text-[#D4AF37] mb-1" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gray-700">Lab Tested</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action inside Modal */}
          <div className="mt-8 pt-4 border-t border-gray-100 flex items-center space-x-4">
            <button 
              disabled={product.stock === 0}
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all text-center ${
                product.stock === 0 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-[#111111] text-[#FDFBF7] hover:bg-[#D4AF37] hover:text-[#111111] active:scale-95'
              }`}
            >
              {product.stock === 0 ? 'Sold Out' : 'Add To Cart'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
