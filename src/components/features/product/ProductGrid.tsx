"use client";
import React, { useState, useEffect } from 'react';
import ProductQuickViewModal from './ProductQuickViewModal';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/services/productService';
import { DEFAULT_PRODUCT_RATING } from '@/utils/constants';
import { getProductVariants, getVariantProduct, groupProducts } from '@/utils/productUtils';

interface ProductGridProps {
  activeCategory: string; 
  onAddToCart: (product: Product) => void; 
  addedProductId?: number | null;
}

export default function ProductGrid({ activeCategory, onAddToCart, addedProductId }: ProductGridProps) {
  const { products, loading, error } = useProducts(activeCategory);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const displayProducts = groupProducts(products);

  return (
    <section id="products" className="relative py-20 px-6 md:px-16 text-[#111111] overflow-hidden">
      {/* Premium Heritage Village Journey Background Image */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.85]"
        style={{
          backgroundImage: "url('/images/village_seamless_bg.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: '750px',
        }}
      />
      {/* Soft gradient edges to blend with neighboring sections */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#FDFBF7] via-transparent to-[#FDFBF7]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        
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
          displayProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
              {displayProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  addedProductId={addedProductId}
                  onQuickView={(prod) => setSelectedProduct(prod)}
                />
              ))}
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

// ================= ProductCard Subcomponent for Dynamic Variants =================
function ProductCard({ 
  product, 
  onAddToCart, 
  addedProductId, 
  onQuickView 
}: { 
  product: Product; 
  onAddToCart: (product: Product) => void; 
  addedProductId?: number | null;
  onQuickView: (product: Product) => void;
}) {
  const [failedImage, setFailedImage] = useState(false);
  const variants = product.variants;
  
  // Default to 500ml or first option if variants exist, otherwise base volume
  const [selectedVolume, setSelectedVolume] = useState<string>(
    variants && variants.length > 0 ? variants[0].volume : product.volume
  );

  const displayProduct = variants ? getVariantProduct(product, selectedVolume) : product;
  const isImageValid = displayProduct.imageUrl && !failedImage;

  return (
    <div 
      className="group relative flex flex-col justify-between rounded-2xl border border-gray-200/60 bg-white p-3 sm:p-5 transition-[box-shadow,border-color,transform] duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_30px_rgba(212,175,55,0.06)] hover:border-[#D4AF37]/45 hover:-translate-y-1"
    >
      {displayProduct.stock === 0 ? (
        <span className="absolute top-3 right-3 sm:top-4 sm:right-4 rounded-full bg-red-500/10 border border-red-500/25 px-2 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-red-400 z-10 animate-fadeIn">
          Sold Out
        </span>
      ) : (displayProduct.tag && displayProduct.tag.toLowerCase() !== "out of stock") ? (
        <span className="absolute top-3 right-3 sm:top-4 sm:right-4 rounded-full bg-[#111111] px-2 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-[#D4AF37] z-10">
          {displayProduct.tag}
        </span>
      ) : null}

      {displayProduct.stock > 0 && displayProduct.originalPrice && displayProduct.originalPrice > displayProduct.price ? (
        <span className="absolute top-3 left-3 sm:top-4 sm:left-4 rounded-full bg-[#D4AF37] px-2 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-[#111111] z-10 shadow-sm">
          {Math.round(((displayProduct.originalPrice - displayProduct.price) / displayProduct.originalPrice) * 100)}% OFF
        </span>
      ) : null}

      {/* Image Box - Click to Open Modal */}
      <div 
        onClick={() => onQuickView(displayProduct)}
        className="mb-4 sm:mb-6 flex h-36 sm:h-52 w-full items-center justify-center rounded-xl bg-gray-50/50 p-2 sm:p-4 overflow-hidden cursor-pointer border border-gray-100/50"
      >
        {isImageValid ? (
          <img 
            src={displayProduct.imageUrl} 
            alt={product.name}
            onError={() => setFailedImage(true)}
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
          onClick={() => onQuickView(displayProduct)}
          className="font-serif text-sm sm:text-base font-bold text-[#111111] tracking-wide min-h-[40px] sm:min-h-[48px] cursor-pointer hover:text-[#D4AF37] transition-colors line-clamp-2"
        >
          {product.name}
        </h3>

        {/* Dynamic Variant Selector (Pills) */}
        {variants && (
          <div className="flex gap-2 mt-2 select-none h-7 items-center">
            {variants.map((v) => (
              <button
                key={v.volume}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedVolume(v.volume);
                }}
                className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all border ${
                  selectedVolume === v.volume
                    ? "bg-[#D4AF37] text-[#111111] border-[#D4AF37] shadow-sm font-extrabold"
                    : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                }`}
              >
                {v.volume}
              </button>
            ))}
          </div>
        )}

        <div className="mt-2.5 flex items-center gap-1.5 select-none text-[11px] text-gray-500 font-medium flex-wrap">
          <span>{displayProduct.volume}</span>
          <span className="text-gray-300 text-[9px]">|</span>
          <div className="flex items-center gap-0.5 text-xs text-[#D4AF37]">
            <span className="text-sm leading-none">★</span>
            <span className="font-bold text-gray-800 text-[11px] font-mono leading-none">
              {displayProduct.rating ? Number(displayProduct.rating).toFixed(1) : DEFAULT_PRODUCT_RATING}
            </span>
          </div>
          {displayProduct.showSalesCount ? (
            <>
              <span className="text-gray-300 text-[9px]">|</span>
              <span className="text-[9.5px] text-amber-600 font-bold bg-amber-50/70 px-1.5 py-0.5 rounded border border-amber-100/40 flex items-center gap-0.5 leading-none">
                <span>🔥</span>
                <span>{((displayProduct.salesCount || 0) + (displayProduct.realSalesCount || 0))}+ bought</span>
              </span>
            </>
          ) : null}
        </div>
        
        <div className="mt-4 flex flex-col xs:flex-row xs:items-center xs:justify-between border-t border-gray-100 pt-4 gap-2">
          <div className="flex flex-col justify-end min-h-[36px] sm:min-h-[44px]">
            {displayProduct.originalPrice && displayProduct.originalPrice > displayProduct.price ? (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through leading-tight">₹{displayProduct.originalPrice}</span>
            ) : (
              <span className="text-[10px] sm:text-xs text-transparent select-none leading-tight">&nbsp;</span>
            )}
            <span className="text-base sm:text-xl font-bold text-[#111111] leading-none">₹{displayProduct.price}</span>
          </div>
          
          <button 
            disabled={displayProduct.stock === 0}
            onClick={() => onAddToCart(displayProduct)}
            className={`rounded-lg px-2.5 py-2 sm:px-4 sm:py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md w-full xs:w-auto text-center ${
              displayProduct.stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200/50'
                : displayProduct.id === addedProductId
                  ? 'bg-[#111111] text-[#FDFBF7] opacity-90 cursor-default'
                  : 'bg-[#D4AF37] text-[#111111] hover:bg-[#111111] hover:text-[#FDFBF7] hover:-translate-y-0.5'
            }`}
          >
            {displayProduct.stock === 0 ? 'Out of Stock' : displayProduct.id === addedProductId ? 'Added!' : 'Add To Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}