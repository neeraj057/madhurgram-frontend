import React, { useState, useEffect } from 'react';

interface ViewedProduct {
  id: number | string;
  name: string;
  imageUrl: string;
  price: number;
  volume: string;
  stock: number;
}

export default function RecentlyViewed() {
  const [viewedProducts, setViewedProducts] = useState<ViewedProduct[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('mg_recently_viewed');
      if (stored) {
        setViewedProducts(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not load recently viewed products");
    }
  }, []);

  if (viewedProducts.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-10 border-t border-gray-100">
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-2xl font-serif font-bold text-[#111111]">Recently Viewed</h2>
        <div className="w-16 h-0.5 bg-[#D4AF37] mt-3"></div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {viewedProducts.map((product) => (
          <div key={product.id} className="group flex flex-col bg-white rounded-2xl p-3 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => window.location.href = `/?product=${product.id}#products`}>
            <div className="relative aspect-square w-full rounded-xl bg-[#FDFBF7] overflow-hidden mb-3 border border-gray-50 flex items-center justify-center p-4">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.currentTarget.src = "/images/newlogo.svg?v=2"; }}
              />
              {product.stock === 0 && (
                <div className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                  Sold Out
                </div>
              )}
            </div>
            
            <div className="flex flex-col flex-1 justify-between">
              <div>
                <h3 className="text-xs md:text-sm font-bold text-[#111111] line-clamp-2 leading-tight group-hover:text-[#D4AF37] transition-colors">{product.name}</h3>
                <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{product.volume}</p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-mono font-bold text-[#111111] text-sm md:text-base">₹{product.price}</span>
                <span className="text-[10px] text-[#D4AF37] font-semibold underline underline-offset-2 opacity-0 group-hover:opacity-100 transition-opacity">View Details</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
