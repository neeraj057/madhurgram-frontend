"use client";
import React, { useState, useEffect } from 'react';
import ProductQuickViewModal from './ProductQuickViewModal';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/services/productService';
import { DEFAULT_PRODUCT_RATING } from '@/utils/constants';

interface ProductGridProps {
  activeCategory: string; 
  onAddToCart: (product: Product) => void; 
  addedProductId?: number | null;
}

export default function ProductGrid({ activeCategory, onAddToCart, addedProductId }: ProductGridProps) {
  const { products, loading, error } = useProducts(activeCategory);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  return (
    <section id="products" className="py-20 px-6 md:px-16 bg-[#FDFBF7] text-[#111111]">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Title */}
        <div className="mb-16 text-center">
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase">
            Our Handcrafted Collection
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-wide md:text-5xl capitalize">
            {activeCategory === 'shop-all' ? 'Gaon Se Seedhe Aapke Ghar Tak' : `${activeCategory} Collection`}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4 select-none">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[#D4AF37] text-[10px]">✦</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
        </div>

        {loading && (
          <div className="text-center py-20 text-gray-400 tracking-widest text-sm animate-pulse">
            Loading Fresh Batches from Village...
          </div>
        )}

        {error && (
          <div className="text-center py-12 px-4 text-red-600 tracking-wide text-sm border border-red-200/50 rounded-xl bg-red-50/30 max-w-2xl mx-auto">
            <p className="font-semibold">{error}</p>
            <span className="text-xs text-gray-500 mt-2 block font-mono">
              Check if SpringBoot Application is running on port 8080 & MySQL is connected.
            </span>
          </div>
        )}

        {!loading && !error && (
          products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
              {products.map((product) => {
                const isImageValid = product.imageUrl && !failedImages[product.id];
                return (
                  <div 
                    key={product.id} 
                    className="group relative flex flex-col justify-between rounded-2xl border border-gray-200/60 bg-white p-3 sm:p-5 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_30px_rgba(212,175,55,0.06)] hover:border-[#D4AF37]/45 hover:-translate-y-1"
                  >
                    {product.stock === 0 ? (
                      <span className="absolute top-3 right-3 sm:top-4 sm:right-4 rounded-full bg-red-500/10 border border-red-500/25 px-2 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-red-400 z-10">
                        Sold Out
                      </span>
                    ) : (product.tag && product.tag.toLowerCase() !== "out of stock") ? (
                      <span className="absolute top-3 right-3 sm:top-4 sm:right-4 rounded-full bg-[#111111] px-2 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-[#D4AF37] z-10">
                        {product.tag}
                      </span>
                    ) : null}

                    {product.stock > 0 && product.originalPrice && product.originalPrice > product.price ? (
                      <span className="absolute top-3 left-3 sm:top-4 sm:left-4 rounded-full bg-[#D4AF37] px-2 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-[#111111] z-10 shadow-sm">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    ) : null}

                    {/* Image Box - Click to Open Modal */}
                    <div 
                      onClick={() => setSelectedProduct(product)}
                      className="mb-4 sm:mb-6 flex h-36 sm:h-52 w-full items-center justify-center rounded-xl bg-gray-50/50 p-2 sm:p-4 overflow-hidden cursor-pointer border border-gray-100/50"
                    >
                      {isImageValid ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          onError={() => { 
                            setFailedImages(prev => ({ ...prev, [product.id]: true }));
                          }}
                          className="h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-[#FAF9F5]/40 rounded-lg p-6 select-none">
                          <img 
                            src="/images/newlogo.svg?v=2" 
                            alt="MadhurGram Logo" 
                            className="max-h-24 max-w-[80%] object-contain opacity-40 transition-all duration-300 group-hover:scale-105 group-hover:opacity-60" 
                          />
                        </div>
                      )}
                    </div>

                    {/* Info Section */}
                    <div>
                      <h3 
                        onClick={() => setSelectedProduct(product)}
                        className="font-serif text-sm sm:text-base font-bold text-[#111111] tracking-wide min-h-[40px] sm:min-h-[48px] cursor-pointer hover:text-[#D4AF37] transition-colors line-clamp-2"
                      >
                        {product.name}
                      </h3>
                      <div className="mt-1.5 flex items-center gap-1.5 select-none text-[11px] text-gray-500 font-medium">
                        <span>{product.volume}</span>
                        <span className="text-gray-300 text-[9px]">|</span>
                        <div className="flex items-center gap-0.5 text-xs text-[#D4AF37]">
                          <span className="text-sm leading-none">★</span>
                          <span className="font-bold text-gray-800 text-[11px] font-mono leading-none">
                            {product.rating ? Number(product.rating).toFixed(1) : DEFAULT_PRODUCT_RATING}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-col xs:flex-row xs:items-center xs:justify-between border-t border-gray-100 pt-4 gap-2">
                        <div className="flex flex-col">
                          {product.originalPrice && product.originalPrice > product.price ? (
                            <span className="text-[10px] sm:text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                          ) : null}
                          <span className="text-base sm:text-xl font-bold text-[#111111]">₹{product.price}</span>
                        </div>
                        
                        <button 
                          disabled={product.stock === 0}
                          onClick={() => onAddToCart(product)}
                          className={`rounded-lg px-2.5 py-2 sm:px-4 sm:py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md w-full xs:w-auto text-center ${
                            product.stock === 0
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200/50'
                              : product.id === addedProductId
                                ? 'bg-[#111111] text-[#FDFBF7] opacity-90 cursor-default'
                                : 'bg-[#D4AF37] text-[#111111] hover:bg-[#111111] hover:text-[#FDFBF7] hover:-translate-y-0.5'
                          }`}
                        >
                          {product.stock === 0 ? 'Out of Stock' : product.id === addedProductId ? 'Added!' : 'Add To Cart'}
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500 tracking-widest text-sm">
              Coming Soon! We are crafting pure batches right now.
            </div>
          )
        )}

        {/* ================= PREMIUM QUICK VIEW MODAL ================= */}
        <ProductQuickViewModal 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={onAddToCart}
        />

      </div>
    </section>
  );
}