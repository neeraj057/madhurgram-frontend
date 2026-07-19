"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '@/apis/apiClient';

interface BundleItem {
  productId: number;
  name: string;
  price: number;
  volume: string;
  imageUrl: string;
  stock: number;
}

interface Bundle {
  id: number;
  tabName: string;
  name: string;
  description: string;
  discountPercent: number;
  active: boolean;
  displayOrder: number;
  originalPrice: number;
  bundlePrice: number;
  savings: number;
  items: BundleItem[];
}

interface FooterSectionProps {
  onAddToCart?: (product: { id: number; name: string; price: number; volume: string; imageUrl: string; stock: number }, quantity?: number) => void;
}

export default function FooterSection({ onAddToCart }: FooterSectionProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [footerMode, setFooterMode] = useState<string>("BRAND_STORY");
  const [loading, setLoading] = useState(true);
  const [addedCombo, setAddedCombo] = useState(false);

  useEffect(() => {
    async function fetchFooterData() {
      try {
        const res = await apiClient<any>("/api/v1/public/footer");
        if (res) {
          setFooterMode(res.footerMode || "BRAND_STORY");
          setBundles(res.bundles || []);
        }
      } catch (err) {
        console.warn("Failed to fetch footer data.", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFooterData();
  }, []);

  const handleAddBundleToCart = (items: BundleItem[], discountPercent: number) => {
    if (onAddToCart) {
      items.forEach(item => {
        // Apply the bundle discount to each individual item
        const discountedPrice = Math.round(item.price * (1 - discountPercent / 100));
        onAddToCart({
          id: item.productId,
          name: `${item.name} (Bundle Offer)`,
          price: discountedPrice,
          volume: item.volume,
          imageUrl: item.imageUrl || "/images/newlogo.svg",
          stock: item.stock || 50
        }, 1);
      });
      setAddedCombo(true);
      setTimeout(() => setAddedCombo(false), 2000);
    }
  };

  const showCombos = footerMode === "COMBOS" && bundles.length > 0;

  return (
    <footer className="w-full relative z-10">

      {/* ===== UPPER CREAM BLOCK: Combo Builder / Brand Story ===== */}
      <div className="mx-auto max-w-7xl px-6 md:px-16 pt-20 pb-16">

        {loading ? (
          <div className="py-20 text-center space-y-4 animate-pulse">
            <div className="h-4 w-32 bg-gray-200 rounded mx-auto" />
            <div className="h-8 w-64 bg-gray-200 rounded mx-auto" />
            <div className="h-4 w-48 bg-gray-200 rounded mx-auto" />
          </div>
        ) : showCombos ? (
          /* ===== COMBO BUNDLES MODE ===== */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-16 border-b border-gray-200">

            {/* Left: Promo Copy */}
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase">
                MadhurGram Combo Savings
              </span>
              <h3 className="mt-3 font-serif text-2xl font-bold tracking-wide md:text-4xl text-[#111111]">
                Village Products,<br />Bundle Discounts
              </h3>
              <p className="mt-5 text-sm tracking-wide leading-relaxed text-gray-600 font-light">
                At MadhurGram, every product is crafted with purity and tradition. When you combine our products into smart bundles, you save significantly on every order — while getting the finest artisanal products directly from our village farms.
              </p>
              <div className="mt-6 flex flex-wrap gap-3.5 text-xs">
                <span className="flex items-center gap-1.5 bg-[#FAF3E0] px-3.5 py-1.5 rounded-full text-[#D4AF37] font-semibold border border-[#D4AF37]/20 select-none">
                  100% Organic &amp; Fresh
                </span>
                <span className="flex items-center gap-1.5 bg-[#FAF3E0] px-3.5 py-1.5 rounded-full text-[#D4AF37] font-semibold border border-[#D4AF37]/20 select-none">
                  Premium Gift Packing
                </span>
                <span className="flex items-center gap-1.5 bg-[#FAF3E0] px-3.5 py-1.5 rounded-full text-[#D4AF37] font-semibold border border-[#D4AF37]/20 select-none">
                  Free Delivery on Combos
                </span>
              </div>
            </div>

            {/* Right: Interactive Combo Selector Card */}
            <div className="flex flex-col justify-start">
              <div className="border border-[#D4AF37]/25 bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">

                {/* Tab Selector */}
                <div className="flex border-b border-gray-100 pb-3 mb-5 gap-2 overflow-x-auto custom-scrollbar select-none">
                  {bundles.map((bundle, idx) => (
                    <button
                      key={bundle.id}
                      onClick={() => { setActiveTab(idx); setAddedCombo(false); }}
                      className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200 uppercase tracking-wider whitespace-nowrap ${
                        activeTab === idx
                          ? "bg-gradient-to-r from-[#A87F18] to-[#C59B27] text-white shadow-md border-transparent"
                          : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                      }`}
                    >
                      {bundle.tabName}
                    </button>
                  ))}
                </div>

                {/* Combo Details */}
                {bundles[activeTab] && (
                  <div className="space-y-4">

                    {/* Badge & Price Row */}
                    <div className="flex items-center justify-between select-none mb-1">
                      <span className="text-xs font-black uppercase tracking-widest text-[#C59B27] px-3 py-1.5 rounded-md border border-[#E8D399] shadow-sm animate-shimmer-bg relative overflow-hidden">
                        SAVE {bundles[activeTab].discountPercent}%
                      </span>
                      <div className="text-right flex items-baseline gap-2">
                        <span className="text-sm text-gray-400 line-through font-medium font-serif">
                          Rs.{bundles[activeTab].originalPrice}
                        </span>
                        <span className="text-3xl font-serif font-black drop-shadow-sm animate-text-shine">
                          Rs.{bundles[activeTab].bundlePrice}
                        </span>
                      </div>
                    </div>

                    {/* Combo Name */}
                    <h4 className="font-serif text-base font-bold text-[#111111] leading-snug">
                      {bundles[activeTab].name}
                    </h4>

                    {/* Description */}
                    <p className="text-xs text-gray-500 leading-relaxed font-light">
                      {bundles[activeTab].description}
                    </p>

                    {/* Sub-items list — real products from the database */}
                    <div className="border-t border-b border-gray-100 py-3.5 my-4 space-y-2 select-none">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400 block mb-2">Products Included:</span>
                      {bundles[activeTab].items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 text-gray-700 font-medium">
                            <span className="text-[#D4AF37] text-[11px]">+</span>
                            <span>{item.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-gray-400 text-[10px] font-mono mr-2">{item.volume}</span>
                            <span className="text-[#111111] font-bold text-[10px] font-mono">Rs.{item.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddBundleToCart(bundles[activeTab].items, bundles[activeTab].discountPercent)}
                      className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-sm ${
                        addedCombo
                          ? "bg-emerald-600 text-white shadow-[0_4px_15px_rgba(34,197,94,0.3)]"
                          : "bg-[#111111] hover:bg-[#D4AF37] text-[#FAF3E0] hover:text-white hover:shadow-[0_4px_15px_rgba(212,175,55,0.25)]"
                      }`}
                    >
                      {addedCombo ? (
                        <>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>Add Bundle to Cart</span>
                        </>
                      )}
                    </button>

                    {/* Savings callout */}
                    <p className="text-center text-[10px] text-gray-400 font-light">
                      You save <strong className="text-[#D4AF37]">Rs.{bundles[activeTab].savings}</strong> vs. buying separately.
                    </p>

                  </div>
                )}
              </div>
            </div>
          </div>

        ) : (
          /* ===== BRAND STORY FALLBACK MODE ===== */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-16 border-b border-gray-200">
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase">
                Our Roots &amp; Heritage
              </span>
              <h3 className="mt-3 font-serif text-2xl font-bold tracking-wide md:text-4xl text-[#111111]">
                From the Heart of<br />Gopiganj Village
              </h3>
              <p className="mt-5 text-sm tracking-wide leading-relaxed text-gray-600 font-light">
                MadhurGram was born in Gopiganj, Bhadohi — where the art of handcrafting pure A2 Ghee, village Jaggery, and cold-pressed oils has been passed down for generations. Our farmers raise indigenous cows on natural grass, free from hormones. Every jar of ghee is Bilona-churned by hand.
              </p>
            </div>
            <div className="flex flex-col justify-center lg:items-end">
              <div className="border border-[#D4AF37]/30 bg-white p-6 rounded-xl max-w-md shadow-sm">
                <h4 className="font-serif text-lg font-bold text-[#D4AF37] mb-2">100% Direct From Village Farms</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-light">
                  We work directly with 45+ certified traditional farmers in Bhadohi district, eliminating all middlemen. Fresher products, farmers earn more, and you save significantly.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== BLACK SITEMAP & TRUST SECTION ===== */}
      <div className="w-full bg-[#050505] text-[#FDFBF7] pt-20 pb-10 px-6 md:px-16 border-t border-[#D4AF37]/60 relative z-0 mt-12">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
          <div className="bg-[#050505] border border-[#D4AF37]/45 px-3.5 py-1.5 rounded-full text-[#D4AF37] text-[8.5px] tracking-[0.25em] font-extrabold uppercase select-none flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.45)]">
            MADHURGRAM
          </div>
        </div>

        <div className="mx-auto max-w-7xl">

          {/* Sitemap Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-gray-800/50">

            <div className="space-y-4">
              <div className="relative h-14 w-52 flex items-center justify-start">
                <img
                  src="/images/newlogo.svg?v=2"
                  alt="MadhurGram Logo"
                  className="h-full w-full object-contain object-left"
                />
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                Artisanal ghee, jaggery &amp; cold-pressed oils. Handcrafted with love from the farms of Gopiganj, Uttar Pradesh.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Discover</h4>
              <ul className="space-y-2.5 text-xs text-gray-400">
                <li><Link href="/blog" className="hover:text-[#D4AF37] transition-colors">Village Stories</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Our Products</h4>
              <ul className="space-y-2.5 text-xs text-gray-400">
                <li><a href="#products" className="hover:text-[#D4AF37] transition-colors">A2 Cow Ghee</a></li>
                <li><a href="#products" className="hover:text-[#D4AF37] transition-colors">Premium Buffalo Ghee</a></li>
                <li><a href="#products" className="hover:text-[#D4AF37] transition-colors">Organic Desi Jaggery</a></li>
                <li><a href="#products" className="hover:text-[#D4AF37] transition-colors">Artisanal Pickles</a></li>
                <li><a href="#products" className="hover:text-[#D4AF37] transition-colors">Cold-Pressed Mustard Oil</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Customer Care</h4>
              <ul className="space-y-2.5 text-xs text-gray-400">
                <li>
                  <Link href="/my-orders" className="hover:text-[#D4AF37] transition-colors">Track My Orders</Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-[#D4AF37] transition-colors">Easy Returns</Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-[#D4AF37] transition-colors">Terms &amp; Conditions</Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="hover:text-[#D4AF37] transition-colors">Cancellation &amp; Refund Policy</Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Village Office</h4>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                Gopiganj, Bhadohi District,<br />
                Uttar Pradesh - 221303, India
              </p>
              <p className="text-xs text-gray-400">
                <span className="font-semibold text-gray-300">Helpline:</span> +91 99887 76655<br />
                <span className="font-semibold text-gray-300">Email:</span> support@madhurgram.com
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-10 border-b border-gray-800/50">
            <div className="flex items-center gap-3.5 border border-gray-800/80 bg-[#0d0d0d] px-4 py-2.5 rounded-xl hover:border-[#D4AF37]/20 transition-all duration-300 select-none">
              <div className="text-[11px] font-extrabold tracking-widest text-[#D4AF37] border-2 border-[#D4AF37] px-1.5 py-0.5 rounded font-mono leading-none">
                fssai
              </div>
              <span className="text-[10px] text-gray-400 font-light tracking-wide leading-tight">
                Licensed Food Business Operator / Reg. No.<br />
                <span className="font-semibold text-gray-300 font-mono">22724999000123</span>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 text-gray-500 text-[10px]">
              <span className="font-semibold uppercase tracking-wider text-[#D4AF37] text-[9px] mr-1">100% Safe Payments:</span>
              <span className="bg-[#0f0f0f] px-2 py-1 rounded border border-gray-800/80 text-gray-400 font-bold font-mono text-[9px] hover:border-gray-700 hover:text-gray-300 transition-colors">UPI</span>
              <span className="bg-[#0f0f0f] px-2 py-1 rounded border border-gray-800/80 text-gray-400 font-bold font-mono text-[9px] hover:border-gray-700 hover:text-gray-300 transition-colors">COD</span>
              <span className="bg-[#0f0f0f] px-2 py-1 rounded border border-gray-800/80 text-gray-400 font-bold font-mono text-[9px] hover:border-gray-700 hover:text-gray-300 transition-colors">CARD</span>
              <span className="bg-[#0f0f0f] px-2 py-1 rounded border border-gray-800/80 text-gray-400 font-bold font-mono text-[9px] hover:border-gray-700 hover:text-gray-300 transition-colors">NETBANKING</span>
            </div>
          </div>

          <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-500 tracking-wider">
            <div>
              <span>&copy; {new Date().getFullYear()} MadhurGram Food Products. All Rights Reserved.</span>
            </div>
            <div className="text-[10px] text-gray-600 font-light">
              Made with love in Uttar Pradesh, India
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}