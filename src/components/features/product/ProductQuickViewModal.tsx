"use client";
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { DEFAULT_PRODUCT_RATING } from '@/utils/constants';
import { getProductVariants, getVariantProduct } from '@/utils/productUtils';
import { Product } from '@/services/productService';
import { showToast } from '@/components/ui/Toast';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
}

interface ProductSpec {
  label: string;
  value: string;
}

/**
 * Returns 3 punchy, high-trust highlights for each category to build instant value.
 */
function getProductHighlights(product: Product): string[] {
  const nameLower = product.name.toLowerCase();

  if (nameLower.includes("ghee")) {
    return [
      "Pure A2 Cow Ghee made using Curd-Churned Bilona method",
      "Slow-cooked in small village batches for rich grainy texture",
      "Naturally packed with healthy fats & essential vitamins A, D, E, K"
    ];
  }
  if (nameLower.includes("dahi")) {
    return [
      "Clay-pot fermented slowly with natural organic cultures",
      "Thick, creamy texture containing zero added thickeners",
      "Rich in active probiotics for healthy digestion"
    ];
  }
  if (nameLower.includes("jaggery") || nameLower.includes("gur")) {
    return [
      "100% Organic sugarcane juice processed without chemicals",
      "Handcrafted in traditional iron pots preserving natural molasses",
      "Healthy sweetener loaded with natural iron and minerals"
    ];
  }
  if (nameLower.includes("oil")) {
    return [
      "Cold-pressed (Kachchi Ghani) in wooden churners",
      "Unrefined & pesticide-free oil with authentic pungent aroma",
      "High smoke point - perfect for healthy daily cooking"
    ];
  }
  if (nameLower.includes("pickle")) {
    return [
      "Traditional recipe slow-cured under direct sunlight",
      "Mixed in pure cold-pressed mustard oil with ground spices",
      "Naturally preserved without synthetic chemicals"
    ];
  }
  
  return [
    "100% Pure, chemical-free farm heritage foods",
    "Ethically sourced directly from local village farmers",
    "Crafted using traditional hand-processed methods"
  ];
}

/**
 * Returns dynamic storytelling process details for each product.
 */
function getProductStory(product: Product): string {
  const nameLower = product.name.toLowerCase();
  
  if (nameLower.includes("ghee")) {
    return "Our A2 Cow Ghee is made using the ancient Bilona method. We boil pure milk, set it to curd overnight, churn it with a wooden churner to separate butter, and slow-cook the butter on firewood until it clarifies into golden, granular ghee.";
  }
  if (nameLower.includes("dahi")) {
    return "Fermented slowly inside clay vessels, our dahi preserves live gut microbes. We set fresh village milk using natural heirloom starter cultures, allowing it to solidify naturally over 8-12 hours without any stabilizers.";
  }
  if (nameLower.includes("jaggery") || nameLower.includes("gur")) {
    return "Handcrafted in traditional open iron pans, our jaggery is made by clarifying fresh sugarcane juice naturally with organic wild okra plant extracts. It is concentrated under firewood heat without sulfur or bleaching chemicals.";
  }
  if (nameLower.includes("oil")) {
    return "Our mustard seeds are cold-pressed in traditional wooden Kolhus (presses) at very slow speeds, ensuring the extraction temperature remains low to preserve vitamins, antioxidants, and pungent natural aroma.";
  }
  if (nameLower.includes("pickle")) {
    return "Crafted using our grandmother's secret recipe, we hand-toss mature fresh ingredients with dry-roasted spices, submerge them in wood-pressed mustard oil, and place the jars in the direct sun for 25-30 days to naturally cure.";
  }
  return "MadhurGram brings you pure, unadulterated heritage essentials directly from our village farms. Crafted using traditional, slow-cooked methods passed down through generations to preserve natural nutrition and rich, authentic flavor.";
}

/**
 * Returns dynamic key-value specifications for each product type.
 */
function getProductSpecs(product: Product): ProductSpec[] {
  const nameLower = product.name.toLowerCase();
  const specs: ProductSpec[] = [
    { label: "Purity", value: "100% Preservative Free" },
    { label: "Pesticides", value: "Zero Chemical Residue" },
    { label: "Source", value: "Direct Village Farms, India" },
    { label: "Lab Check", value: "Verified Pure & Safe" }
  ];

  if (nameLower.includes("ghee")) {
    specs.unshift(
      { label: "Ingredients", value: "A2 Cow Milk Curd Butter" },
      { label: "Process", value: "Bilona Hand-Churned" },
      { label: "Shelf Life", value: "12 Months (Granular)" }
    );
  } else if (nameLower.includes("dahi")) {
    specs.unshift(
      { label: "Ingredients", value: "A2 Milk, Starter Culture" },
      { label: "Process", value: "Clay Pot Fermented" },
      { label: "Shelf Life", value: "7 Days (Refrigerate)" }
    );
  } else if (nameLower.includes("jaggery") || nameLower.includes("gur")) {
    specs.unshift(
      { label: "Ingredients", value: "Organic Sugarcane Juice" },
      { label: "Process", value: "Firewood Pot Concentrated" },
      { label: "Shelf Life", value: "12 Months" }
    );
  } else if (nameLower.includes("oil")) {
    specs.unshift(
      { label: "Ingredients", value: "Organic Mustard Seeds" },
      { label: "Process", value: "Wooden Kolhu Cold-Pressed" },
      { label: "Shelf Life", value: "12 Months" }
    );
  } else if (nameLower.includes("pickle")) {
    specs.unshift(
      { label: "Ingredients", value: "Fresh Fruit/Veg, Spices, Oil" },
      { label: "Process", value: "Barni Sun-Cured (30 Days)" },
      { label: "Shelf Life", value: "12 Months" }
    );
  } else {
    specs.unshift(
      { label: "Ingredients", value: "100% Farm Organic" },
      { label: "Shelf Life", value: "6 Months" }
    );
  }

  return specs;
}

export default function ProductQuickViewModal({ product, onClose, onAddToCart }: ProductQuickViewModalProps) {
  const variants = product ? (product.variants || getProductVariants(product)) : null;
  const [selectedVolume, setSelectedVolume] = useState<string>(
    product ? (variants && variants.length > 0 ? variants[0].volume : product.volume) : ""
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"buy" | "story" | "specs">("buy");

  useEffect(() => {
    if (product) {
      const vars = product.variants || getProductVariants(product);
      setSelectedVolume(vars && vars.length > 0 ? vars[0].volume : product.volume);
      setQuantity(1); // Reset quantity on product swap
      setActiveTab("buy"); // Reset to default purchase tab
    }
  }, [product]);

  if (!product) return null;

  const displayProduct = variants ? getVariantProduct(product, selectedVolume) : product;
  const highlights = getProductHighlights(product);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm transition-opacity duration-300">
      {/* Backdrop click close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Modal Box - Optimized for Mobile Viewport Height (Zero Scroll) */}
      <div className="relative w-full max-w-2xl bg-[#FDFBF7] text-[#111111] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col sm:flex-row z-10 max-h-[90vh] sm:max-h-none overflow-y-auto sm:overflow-visible animate-fadeIn">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white border border-gray-200 hover:text-[#D4AF37] transition-colors z-20 shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Left Side: Product Image Showcase */}
        <div className="w-full sm:w-5/12 bg-gray-50/80 p-6 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-gray-200/50 min-h-[180px] sm:min-h-[320px]">
          {displayProduct.imageUrl ? (
            <img 
              src={displayProduct.imageUrl} 
              alt={product.name} 
              className="max-h-36 sm:max-h-56 object-contain animate-fadeIn"
              onError={(e) => { e.currentTarget.src = "/images/newlogo.svg?v=2"; }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-lg bg-[#FAF9F5]/40 text-center p-6 select-none">
              <img 
                src="/images/newlogo.svg?v=2" 
                alt="MadhurGram Logo" 
                className="max-h-24 object-contain opacity-40" 
              />
            </div>
          )}
        </div>

        {/* Right Side: Heritage Details Pane (Tabbed Navigation for Dynamic storytelling) */}
        <div className="w-full sm:w-7/12 p-6 flex flex-col justify-between">
          <div>
            <span className="text-[8px] font-bold tracking-[0.25em] text-[#D4AF37] uppercase">
              {displayProduct.category}
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide mt-1 text-[#111111] leading-snug">
              {displayProduct.name}
            </h3>

            {/* Elegant Luxury Tabs */}
            <div className="flex border-b border-gray-200 mt-3.5 select-none text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setActiveTab("buy")}
                className={`flex-1 pb-1.5 border-b-2 text-center transition-all ${
                  activeTab === "buy"
                    ? "border-[#D4AF37] text-[#111111]"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                Quick Buy
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("story")}
                className={`flex-1 pb-1.5 border-b-2 text-center transition-all ${
                  activeTab === "story"
                    ? "border-[#D4AF37] text-[#111111]"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                Our Process
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("specs")}
                className={`flex-1 pb-1.5 border-b-2 text-center transition-all ${
                  activeTab === "specs"
                    ? "border-[#D4AF37] text-[#111111]"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                Purity Specs
              </button>
            </div>

            {/* Tab Contents Pane (Fixed height to prevent modal size jumps) */}
            <div className="mt-4 h-[160px] sm:h-[185px] overflow-y-auto scrollbar-thin pr-1">
              
              {/* Tab 1: Buy Options */}
              {activeTab === "buy" && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Rating */}
                  <div className="flex items-center gap-1.5 select-none text-[10px] text-gray-500 font-medium">
                    <span className="text-[#D4AF37]">★</span>
                    <span className="font-bold text-gray-800">{displayProduct.rating ? Number(displayProduct.rating).toFixed(1) : DEFAULT_PRODUCT_RATING}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-[9px] uppercase tracking-wider text-[#D4AF37] font-semibold">100% Organic</span>
                  </div>

                  {/* Size selection */}
                  {variants && (
                    <div className="flex gap-2 select-none">
                      {variants.map((v) => (
                        <button
                          key={v.volume}
                          type="button"
                          onClick={() => setSelectedVolume(v.volume)}
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

                  {/* Price and Quantity Selector */}
                  <div className="flex items-center justify-between bg-gray-50/60 p-2.5 rounded-xl border border-gray-150/40">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-gray-400 uppercase tracking-widest font-mono">Price</span>
                      <span className="text-lg font-extrabold text-[#111111]">₹{displayProduct.price}</span>
                    </div>
                    
                    {displayProduct.stock > 0 && (
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white p-0.5 select-none shadow-xs">
                        <button
                          type="button"
                          onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#D4AF37] font-bold text-md hover:bg-gray-50 rounded transition-colors"
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-xs font-bold font-mono text-[#111111]">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (quantity >= displayProduct.stock) {
                              showToast(`माफ़ करना भाई, वेयरहाउस में केवल ${displayProduct.stock} यूनिट्स बची हैं।`, "error");
                            } else {
                              setQuantity(prev => prev + 1);
                            }
                          }}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#D4AF37] font-bold text-md hover:bg-gray-50 rounded transition-colors"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Highlights Summary */}
                  <ul className="space-y-1 text-[10px] text-gray-500 font-medium">
                    {highlights.slice(0, 2).map((h, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#D4AF37]">✓</span>
                        <span className="leading-tight">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tab 2: Story & Process */}
              {activeTab === "story" && (
                <div className="space-y-2.5 animate-fadeIn">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#D4AF37]">How It's Crafted</span>
                  <p className="text-xs text-gray-600 font-light leading-relaxed">
                    {getProductStory(product)}
                  </p>
                  <div className="flex items-center gap-1.5 text-[9px] text-[#D4AF37] font-bold uppercase tracking-wider bg-yellow-50/50 p-2 rounded-lg border border-yellow-100/50 w-max select-none">
                    <span>🔥 Wood Fire Cooked</span>
                    <span>•</span>
                    <span>🌿 Traditional Process</span>
                  </div>
                </div>
              )}

              {/* Tab 3: Purity Specs */}
              {activeTab === "specs" && (
                <div className="space-y-2.5 animate-fadeIn">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#D4AF37]">Quality Specifications</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {getProductSpecs(product).map((s, i) => (
                      <div key={i} className="bg-gray-50 p-2 rounded-lg border border-gray-150/45 flex flex-col justify-center">
                        <span className="text-[9px] text-gray-400 font-mono uppercase leading-none mb-1">{s.label}</span>
                        <span className="font-bold text-gray-800 leading-tight">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Bottom Action inside Modal */}
          <div className="mt-5">
            <button 
              disabled={displayProduct.stock === 0}
              onClick={() => {
                onAddToCart(displayProduct, quantity);
                onClose();
              }}
              className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all text-center shadow-md active:scale-95 ${
                displayProduct.stock === 0 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-[#111111] text-[#FDFBF7] hover:bg-[#D4AF37] hover:text-[#111111] shadow-md hover:shadow-lg'
              }`}
            >
              {displayProduct.stock === 0 ? 'Sold Out' : `Add To Cart • ₹${displayProduct.price * quantity}`}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
