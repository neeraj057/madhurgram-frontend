"use client";
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { DEFAULT_PRODUCT_RATING } from '@/utils/constants';
import { getProductVariants, getVariantProduct } from '@/utils/productUtils';
import { Product } from '@/services/productService';
import { showToast } from '@/components/ui/Toast';
import { API_ENDPOINTS } from '@/apis/api';

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
      "100% Pure Desi Ghee slow-cooked from fresh cream",
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
    return "Our Desi Ghee is made using the traditional slow-cooking method. We take 100% pure fresh cream and gently simmer it on low fire in small batches until it clarifies into golden, highly aromatic, and naturally granular ghee.";
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
      { label: "Ingredients", value: "100% Pure Fresh Cream" },
      { label: "Process", value: "Traditional Slow-Cooked" },
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

  // Lock body scroll when modal is active using position:fixed technique
  // (overflow:hidden alone doesn't work reliably on iOS and some desktop browsers)
  useEffect(() => {
    if (product) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    };
  }, [product]);

  useEffect(() => {
    if (product) {
      const vars = product.variants || getProductVariants(product);
      setSelectedVolume(vars && vars.length > 0 ? vars[0].volume : product.volume);
      setQuantity(1); // Reset quantity on product swap
      setActiveTab("buy"); // Reset to default purchase tab
      setShowWhatsAppForm(false);
      setCustName("");
      setCustPhone("");
      setCustAddress("");
      setPincodeCheckVal("");
      setPincodeResult(null);
    }
  }, [product]);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("917899999902");
  const [whatsappTemplate, setWhatsappTemplate] = useState("");
  const [showWhatsAppForm, setShowWhatsAppForm] = useState(false);
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custAddress, setCustAddress] = useState("");
  
  // Pincode checker states
  const [pincodeCheckVal, setPincodeCheckVal] = useState("");
  const [pincodeResult, setPincodeResult] = useState<{
    available: boolean;
    tier: string;
    sla: string;
    message: string;
    location?: string;
    cod?: boolean;
    courier?: string;
    disclaimer?: string;
  } | null>(null);
  const [pincodeChecking, setPincodeChecking] = useState(false);

  useEffect(() => {
    if (!product) return;
    const fetchWhatsAppConfig = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.getWhatsAppConfig);
        if (res.ok) {
          const data = await res.json();
          console.log("Fetched WhatsApp Config:", data);
          setWhatsappEnabled(data.whatsappEnabled === "true");
          setWhatsappNumber(data.whatsappNumber || "917899999902");
          setWhatsappTemplate(data.whatsappTemplate || "");
        }
      } catch (e) {
        // Use console.warn instead of console.error to prevent Next.js dev overlay on network failures (e.g. backend down or adblocker)
        console.warn("Could not fetch WhatsApp config, using defaults. Error:", (e as Error).message);
      }
    };
    fetchWhatsAppConfig();
  }, [product]);

  const handleCheckPincode = async () => {
    const trimmed = pincodeCheckVal.trim();
    if (!trimmed || !/^[1-9][0-9]{5}$/.test(trimmed)) {
      showToast("Please enter a valid 6-digit Indian Pincode.", "error");
      return;
    }
    setPincodeChecking(true);
    setPincodeResult(null);
    try {
      const res = await fetch(API_ENDPOINTS.checkPincode(trimmed));
      if (res.ok) {
        const data = await res.json();
        setPincodeResult(data);
      } else {
        showToast("Error checking delivery availability for this pincode.", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Network error checking delivery availability.", "error");
    } finally {
      setPincodeChecking(false);
    }
  };

  if (!product) return null;

  const displayProduct = variants ? getVariantProduct(product, selectedVolume) : product;
  const highlights = getProductHighlights(product);

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm transition-opacity duration-300" style={{ zIndex: 99999 }}>
      {/* Backdrop click close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Modal Box - max height capped, internal scroll only */}
      <div className="relative w-full max-w-2xl bg-[#FDFBF7] text-[#111111] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col sm:flex-row z-10 max-h-[92vh] animate-fadeIn">
        
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
        <div className="w-full sm:w-7/12 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            {!showWhatsAppForm ? (
              <>
                {displayProduct.clearanceActive && (
                  <div className="mb-3 w-full bg-orange-50 border border-orange-200 text-orange-600 rounded-lg p-2 text-center text-[10px] font-bold uppercase tracking-wider animate-pulse shadow-sm">
                    ⚡ Clearance Flash Sale: Nearing expiry batch, grab it before it's gone!
                  </div>
                )}
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
              </>
            ) : (
              <>
                <span className="text-[8px] font-bold tracking-[0.25em] text-green-600 uppercase">
                  WhatsApp Direct Order
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold tracking-wide mt-1 text-[#111111] leading-snug">
                  Enter Delivery Details
                </h3>
                <p className="text-[9px] text-gray-500 mt-1 font-light leading-none">
                  We'll pre-fill these details so you don't have to type them on WhatsApp.
                </p>
              </>
            )}

            {/* Tab Contents Pane — fixed height so modal NEVER resizes on tab switch */}
            <div className="mt-4 h-[260px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent pr-1">
              
              {showWhatsAppForm ? (
                <div className="space-y-3 animate-fadeIn pr-1 text-[#111111] select-none">
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      autoComplete="off"
                      autoCorrect="off"
                      className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs text-[#111] outline-none focus:border-[#D4AF37] font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-1">WhatsApp Phone Number</label>
                    <input
                      type="text"
                      required
                      value={custPhone}
                      onChange={(e) => setCustPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      autoComplete="off"
                      autoCorrect="off"
                      className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs text-[#111] outline-none focus:border-[#D4AF37] font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-1">Delivery Address & Pincode</label>
                    <textarea
                      rows={2}
                      required
                      value={custAddress}
                      onChange={(e) => setCustAddress(e.target.value)}
                      placeholder="e.g. Near Shiv Temple, Gopiganj, Bhadohi, PIN: 221303"
                      autoComplete="off"
                      autoCorrect="off"
                      className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs text-[#111] outline-none focus:border-[#D4AF37] font-medium leading-relaxed"
                    />
                  </div>
                </div>
              ) : (
                <>
                  {/* Tab 1: Buy Options */}
                  {activeTab === "buy" && (
                    <div className="space-y-4 animate-fadeIn">
                      {/* Rating */}
                      <div className="flex items-center gap-1.5 select-none text-[10px] text-gray-500 font-medium flex-wrap">
                        <span className="text-[#D4AF37]">★</span>
                        <span className="font-bold text-gray-800">{displayProduct.rating ? Number(displayProduct.rating).toFixed(1) : DEFAULT_PRODUCT_RATING}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-[9px] uppercase tracking-wider text-[#D4AF37] font-semibold">100% Organic</span>
                        {displayProduct.showSalesCount ? (
                          <>
                            <span className="text-gray-300">|</span>
                            <span className="text-[9.5px] text-amber-600 font-bold bg-amber-50/70 px-1.5 py-0.5 rounded border border-amber-100/40 flex items-center gap-0.5 leading-none">
                              <span>🔥</span>
                              <span>{((displayProduct.salesCount || 0) + (displayProduct.realSalesCount || 0))}+ orders placed</span>
                            </span>
                          </>
                        ) : null}
                      </div>

                      {/* Size selection */}
                      {variants && (
                        <div className="flex gap-2 select-none h-10 items-center">
                          {variants.map((v) => (
                            <button
                              key={v.volume}
                              type="button"
                              onClick={() => setSelectedVolume(v.volume)}
                              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border min-h-[38px] flex items-center justify-center cursor-pointer ${
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
                          <span className="text-lg font-extrabold text-[#111111]">₹{displayProduct.price * quantity}</span>
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
                                  showToast("माफ़ करना भाई, वेयरहाउस में केवल " + displayProduct.stock + " यूनिट्स बची हैं।", "error");
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



                      {/* Pincode Availability Checker Widget */}
                      <div className="border border-gray-200 rounded-xl bg-gray-50/30 p-2.5 space-y-2 select-none">
                        <div className="flex items-center justify-between">
                          <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">Delivery Availability</label>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            value={pincodeCheckVal}
                            onChange={(e) => setPincodeCheckVal(e.target.value.replace(/\D/g, ""))}
                            placeholder="Enter 6-digit Pincode"
                            className="flex-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs text-[#111] outline-none focus:border-[#D4AF37] font-mono font-bold"
                          />
                          <button
                            type="button"
                            onClick={handleCheckPincode}
                            disabled={pincodeChecking}
                            className="px-4 py-1.5 bg-[#111111] hover:bg-[#D4AF37] text-[#FDFBF7] hover:text-[#111111] text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all disabled:opacity-50 cursor-pointer"
                          >
                            {pincodeChecking ? "Checking..." : "Check"}
                          </button>
                        </div>
                        {pincodeResult && (
                          <div className="animate-fadeIn">
                            {pincodeResult.available ? (
                              <div className="rounded-xl border border-gray-200 overflow-hidden">
                                {/* Top: Location + ETA */}
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50/60 border-b border-green-100 px-3 py-2 flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-green-600 text-xs font-bold">📦</span>
                                    <div>
                                      <div className="text-[10px] font-extrabold text-green-700">{pincodeResult.message}</div>
                                      {pincodeResult.location && (
                                        <div className="text-[8.5px] text-gray-400 font-mono">{pincodeResult.location}</div>
                                      )}
                                    </div>
                                  </div>
                                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                    pincodeResult.tier === 'LOCAL' 
                                      ? 'bg-[#D4AF37]/15 text-[#9a7c1f]' 
                                      : pincodeResult.tier === 'REGIONAL' 
                                        ? 'bg-blue-50 text-blue-600' 
                                        : 'bg-purple-50 text-purple-600'
                                  }`}>{pincodeResult.tier}</span>
                                </div>
                                {/* Bottom: Courier + COD */}
                                <div className="bg-white px-3 py-2 flex items-center justify-between">
                                  <div className="text-[9px] text-gray-500 font-medium">
                                    <span className="text-gray-400">via </span>
                                    <span className="font-bold text-gray-700">{pincodeResult.courier || 'Courier Partner'}</span>
                                  </div>
                                  <div className={`flex items-center gap-1 text-[8.5px] font-bold px-2 py-0.5 rounded-full ${
                                    pincodeResult.cod 
                                      ? 'bg-green-50 text-green-600 border border-green-100' 
                                      : 'bg-orange-50 text-orange-600 border border-orange-100'
                                  }`}>
                                    <span>{pincodeResult.cod ? '💵 COD Available' : '🏦 Prepaid Only'}</span>
                                  </div>
                                </div>
                                {/* Disclaimer */}
                                {pincodeResult.disclaimer && (
                                  <div className="bg-gray-50/80 border-t border-gray-100 px-3 py-1">
                                    <span className="text-[8px] text-gray-400 font-light italic">{pincodeResult.disclaimer}</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-red-600 bg-red-50/70 border border-red-100 p-2.5 rounded-xl flex items-start gap-2">
                                <span className="text-sm">🔴</span>
                                <div>
                                  <div className="text-[10px] font-bold">{pincodeResult.message || "Delivery unavailable to this pincode."}</div>
                                  <div className="text-[8.5px] text-red-400 font-light mt-0.5">Please contact us for alternative delivery options.</div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
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
                    <div className="animate-fadeIn">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#D4AF37]">Quality Specifications</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#D4AF37]/40 to-transparent" />
                      </div>
                      <div className="space-y-1.5">
                        {getProductSpecs(product).map((s, i) => (
                          <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-[#FDFBF7] to-gray-50/60 border border-gray-100 hover:border-[#D4AF37]/30 transition-colors group">
                            <div className="flex items-center gap-2.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] flex-shrink-0 group-hover:scale-125 transition-transform" />
                              <span className="text-[9.5px] text-gray-400 uppercase tracking-wider font-semibold font-mono">{s.label}</span>
                            </div>
                            <span className="text-[11px] font-extrabold text-[#111111] text-right leading-tight">{s.value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center gap-1.5 text-[9px] text-[#D4AF37] font-bold bg-amber-50/60 border border-amber-100/50 px-3 py-1.5 rounded-lg w-max select-none">
                        <span>🛡️</span>
                        <span>Lab Tested & Certified Pure</span>
                      </div>
                    </div>
                  )}
                </>
              )}

            </div>
          </div>

          {/* Bottom Action inside Modal */}
          <div className="mt-5 space-y-3">
            {showWhatsAppForm ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowWhatsAppForm(false)}
                  className="w-4/12 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold uppercase tracking-wider transition-all text-center cursor-pointer active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!custName.trim() || !custAddress.trim()) {
                      showToast("Please enter your Name and Address.", "error");
                      return;
                    }
                    
                    // Validate that the address contains a valid 6-digit Indian Pincode
                    const pincodeMatch = custAddress.match(/\b\d{6}\b/);
                    if (!pincodeMatch) {
                      showToast("Please include a valid 6-digit Pincode in your delivery address.", "error");
                      return;
                    }
                    
                    const pincode = pincodeMatch[0];
                    
                    // 1. Basic pattern check: Indian Pincodes only start with 1-8. Block repetitive sequences like 123456, 111111
                    if (/^(0|9)/.test(pincode) || /^(.)\1{5}$/.test(pincode) || pincode === "123456") {
                      showToast(`The pincode ${pincode} appears to be invalid.`, "error");
                      return;
                    }

                    // 2. Query official Indian Postal API to verify legitimacy (with 1.5s timeout graceful fallback)
                    let isValidPincode = true;
                    try {
                      const apiResponse = await Promise.race([
                        fetch(`https://api.postalpincode.in/pincode/${pincode}`),
                        new Promise<Response>((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1500))
                      ]);
                      if (apiResponse && apiResponse.ok) {
                        const apiData = await apiResponse.json();
                        if (apiData && apiData[0] && apiData[0].Status === "Error") {
                          isValidPincode = false;
                        }
                      }
                    } catch (e) {
                      console.warn("Pincode API offline or timed out. Degrading gracefully to bypass verification.", e);
                    }

                    if (!isValidPincode) {
                      showToast(`The pincode ${pincode} is not a valid delivery pincode.`, "error");
                      return;
                    }
                    
                    let message = whatsappTemplate || "Hello MadhurGram,\n\nMy name is *{custName}*.\nI want to order *{productName}* ({volume}) - {quantity} unit(s).\nMy delivery address is: *{custAddress}*.\n\nPlease confirm my order.";
                    message = message.replace(/{productName}/g, product.name);
                    message = message.replace(/{volume}/g, selectedVolume);
                    message = message.replace(/{quantity}/g, quantity.toString());
                    
                    // Replace inputs
                    message = message.replace(/{custName}/g, custName.trim());
                    message = message.replace(/{custPhone}/g, custPhone.trim());
                    message = message.replace(/{custAddress}/g, custAddress.trim());
                    
                    // If template did not have custom placeholders, overwrite with a clean structured message
                    if (!message.includes(custName.trim()) || !message.includes(custAddress.trim())) {
                      const isEnglish = !whatsappTemplate || /^[a-zA-Z0-9\s,.:'!?()&*-]+$/.test(whatsappTemplate.replace(/[^\x00-\x7F]/g, ""));
                      if (isEnglish) {
                        message = `Hello MadhurGram,\n\nMy name is *${custName.trim()}*.\nI want to order *${product.name}* (${selectedVolume}) - ${quantity} unit(s).\nMy delivery address is: *${custAddress.trim()}*.\n\nPlease confirm my order.`;
                      } else {
                        message = `नमस्ते MadhurGram,\n\nमेरा नाम: *${custName.trim()}*\nफ़ोन: *${custPhone.trim() || "—"}*\nपता: *${custAddress.trim()}*\n\nमुझे *${product.name}* (${selectedVolume}) की *${quantity}* यूनिट्स आर्डर करना है। कृपया कन्फर्म करें।`;
                      }
                    }
                    
                    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                    window.open(waUrl, "_blank");
                    
                    // Reset and close
                    setShowWhatsAppForm(false);
                    onClose();
                  }}
                  className="w-8/12 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all text-center shadow-md hover:shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Confirm & Go
                </button>
              </div>
            ) : (
              <>
                <button 
                  disabled={displayProduct.stock === 0}
                  onClick={() => {
                    onAddToCart(displayProduct, quantity);
                    onClose();
                  }}
                  className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all text-center shadow-md active:scale-95 cursor-pointer ${
                    displayProduct.stock === 0 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-[#111111] text-[#FDFBF7] hover:bg-[#D4AF37] hover:text-[#111111] shadow-md hover:shadow-lg'
                  }`}
                >
                  {displayProduct.stock === 0 ? 'Sold Out' : `Add To Cart • ₹${displayProduct.price * quantity}`}
                </button>

                {whatsappEnabled && displayProduct.stock > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowWhatsAppForm(true)}
                    className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all text-center shadow-md hover:shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.118-2.91-6.993-1.88-1.875-4.363-2.907-7.001-2.909-5.439 0-9.86 4.42-9.865 9.864-.002 1.76.461 3.473 1.34 5.016l-.995 3.635 3.737-.981zM17.16 14.86c-.283-.141-1.67-.824-1.928-.918-.258-.093-.446-.14-.633.14-.188.281-.727.918-.891 1.11-.164.19-.328.21-.61.07-.282-.14-1.194-.44-2.274-1.402-.84-.75-1.408-1.675-1.573-1.956-.164-.28-.018-.432.122-.572.127-.125.283-.328.424-.492.142-.164.189-.281.283-.469.094-.188.047-.352-.023-.492-.07-.141-.633-1.528-.868-2.094-.228-.549-.46-.474-.633-.483-.164-.008-.352-.01-.54-.01-.188 0-.492.07-.75.352-.258.281-.986.963-.986 2.348 0 1.385 1.008 2.72 1.149 2.907.14.188 1.984 3.029 4.81 4.249.67.291 1.195.464 1.602.593.673.214 1.285.184 1.769.112.54-.08 1.67-.682 1.904-1.34.234-.658.234-1.221.164-1.34-.07-.12-.258-.188-.54-.328z"/>
                    </svg>
                    Order on WhatsApp
                  </button>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
