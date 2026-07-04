/**
 * MADHURGRAM PREMIUM PRODUCT GRID COMPONENT
 * * USE CASE:
 * 1. यह कंपोनेंट स्प्रिंग बूट REST API (port 8080) से लाइव प्रोडक्ट्स का डेटा फेच करता है।
 * 2. 'activeCategory' प्रोप के चेंज होते ही यह ऑटोमैटिकली API को हिट करके प्रोडक्ट्स को फ़िल्टर करता है।
 * 3. इसमें लोडिंग स्टेट और एरर हैंडलिंग बाउंड्रीज़ लगाई गई हैं।
 * 4. अब इसमें 'Quick View Modal' इंटीग्रेट किया गया है ताकि यूजर प्रोडक्ट की ट्रेडिशनल स्टोरी और मेकिंग देख सके।
 */

"use client";
import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Leaf, Flame } from 'lucide-react'; // मोडल के लिए नए आइकॉन्स
import { API_ENDPOINTS } from '@/apis/api';


interface ProductGridProps {
  activeCategory: string; 
  onAddToCart: (product: Product) => void; 
  addedProductId?: number | null;
}

interface Product {
  id: number;
  name: string;
  price: number;
  volume: string;
  imageUrl: string; 
  tag: string;
  category: string;
  stock: number;
}

export default function ProductGrid({ activeCategory, onAddToCart, addedProductId }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // 🔍 क्विक व्यू मोडल के लिए स्टेट
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_ENDPOINTS.getProducts(activeCategory));
        
        if (!response.ok) {
          throw new Error("Failed to fetch products from MadhurGram Java Server");
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("API Error:", err);
        setError(err instanceof Error ? err.message : "Something went wrong while connecting to Backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

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
          <div className="mx-auto mt-4 h-[1px] w-20 bg-[#D4AF37]" />
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
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="group relative flex flex-col justify-between rounded-xl border border-gray-200/60 bg-white p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <span className="absolute top-4 right-4 rounded-full bg-[#111111] px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-[#D4AF37] z-10">
                    {product.stock === 0 ? 'Sold Out' : product.tag}
                  </span>

                  {/* Image Box - Click to Open Modal */}
                  <div 
                    onClick={() => setSelectedProduct(product)}
                    className="mb-6 flex h-52 w-full items-center justify-center rounded-lg bg-gray-50 p-4 overflow-hidden cursor-pointer"
                  >
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        onError={(e) => { 
                          e.currentTarget.src = "https://placehold.co/300x300/e6e6e6/111111?text=MadhurGram"; 
                        }}
                        className="h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-lg bg-[#e6e6e6] text-xs uppercase text-gray-500">
                        Image unavailable
                      </div>
                    )}
                  </div>

                  {/* Info Section */}
                  <div>
                    <h3 
                      onClick={() => setSelectedProduct(product)}
                      className="font-serif text-base font-bold text-[#111111] tracking-wide min-h-[48px] cursor-pointer hover:text-[#D4AF37] transition-colors"
                    >
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 font-medium">{product.volume}</p>
                    
                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                      <span className="text-xl font-bold text-[#111111]">₹{product.price}</span>
                      
                      <button 
                        disabled={product.stock === 0}
                        onClick={() => onAddToCart(product)}
                        className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                          product.stock === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200/50'
                            : product.id === addedProductId
                              ? 'bg-[#111111] text-[#FDFBF7] opacity-90 cursor-default'
                              : 'bg-[#D4AF37] text-[#111111] hover:bg-[#111111] hover:text-[#FDFBF7]'
                        }`}
                      >
                        {product.stock === 0 ? 'Out of Stock' : product.id === addedProductId ? 'Added!' : 'Add To Cart'}
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500 tracking-widest text-sm">
              Coming Soon! We are crafting pure batches right now.
            </div>
          )
        )}

        {/* ================= PREMIUM QUICK VIEW MODAL ================= */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm transition-opacity duration-300">
            {/* Backdrop click close */}
            <div className="absolute inset-0" onClick={() => setSelectedProduct(null)} />
            
            {/* Modal Box */}
            <div className="relative w-full max-w-3xl bg-[#FDFBF7] text-[#111111] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col md:flex-row z-10 max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible">
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white border border-gray-200 hover:text-[#D4AF37] transition-colors z-20 shadow-sm"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Left Side: Product Image Showcase */}
              <div className="w-full md:w-1/2 bg-gray-50 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-200/60 min-h-[300px]">
                {selectedProduct.imageUrl ? (
                  <img 
                    src={selectedProduct.imageUrl} 
                    alt={selectedProduct.name} 
                    className="max-h-64 object-contain"
                    onError={(e) => { e.currentTarget.src = "https://placehold.co/400x400/e6e6e6/111111?text=MadhurGram"; }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-lg bg-[#e6e6e6] text-center p-4 text-sm text-gray-500">
                    Image unavailable
                  </div>
                )}
              </div>

              {/* Right Side: Luxury Heritage Story Details */}
              <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase">
                    {selectedProduct.category} • {selectedProduct.tag}
                  </span>
                  <h3 className="font-serif text-2xl font-bold tracking-wide mt-2 text-[#111111]">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 font-mono">{selectedProduct.volume}</p>
                  
                  <div className="text-2xl font-bold mt-4 text-[#111111]">₹{selectedProduct.price}</div>
                  
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
                    disabled={selectedProduct.stock === 0}
                    onClick={() => {
                      onAddToCart(selectedProduct);
                      setSelectedProduct(null); // ऐड करते ही मोडल क्लोज
                    }}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all text-center ${
                      selectedProduct.stock === 0 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-[#111111] text-[#FDFBF7] hover:bg-[#D4AF37] hover:text-[#111111] active:scale-95'
                    }`}
                  >
                    {selectedProduct.stock === 0 ? 'Sold Out' : 'Add To Cart'}
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}