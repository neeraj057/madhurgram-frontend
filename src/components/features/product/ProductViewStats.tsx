import React, { useState, useEffect } from 'react';

interface ProductViewStatsProps {
  productId?: string | number;
}

export const ProductViewStats: React.FC<ProductViewStatsProps> = ({ productId }) => {
  const [viewers, setViewers] = useState<number>(0);
  const [sold, setSold] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    // We use a simple hash of the productId to get a consistent seed, 
    // or just random if not provided, to ensure it doesn't flicker wildly on re-renders.
    const baseRandom = productId 
      ? (String(productId).charCodeAt(0) + String(productId).charCodeAt(String(productId).length - 1)) % 10 / 10
      : Math.random();

    // Viewers between 11 and 45
    const randomViewers = Math.floor(baseRandom * (45 - 11 + 1)) + 11;
    // Sold between 15 and 35
    const randomSold = Math.floor((1 - baseRandom) * (35 - 15 + 1)) + 15;
    // Hours between 12 and 24
    const randomHours = Math.floor(Math.random() * (24 - 12 + 1)) + 12;

    setViewers(randomViewers);
    setSold(randomSold);
    setHours(randomHours);
    setIsMounted(true);

    // Make the viewers fluctuate slightly every 4 seconds to make it look "live"
    const interval = setInterval(() => {
      setViewers(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const next = prev + change;
        if (next < 11) return 11;
        if (next > 55) return 55;
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [productId]);

  // To avoid layout shift before hydration, we render an empty container with the same dimensions
  if (!isMounted) {
    return (
      <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-3.5 mb-5 mt-2 opacity-0">
        <div className="h-4 mb-2.5"></div>
        <div className="h-4"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5 bg-[#FDFBF7]/80 border border-amber-100/50 rounded-xl p-3.5 mb-5 mt-2 shadow-sm">
      <div className="flex items-center gap-2">
        {/* Eye Icon */}
        <div className="bg-white p-1 rounded-md shadow-sm border border-gray-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <span className="text-[11px] font-semibold text-gray-700 tracking-wide">{viewers} people are viewing this right now</span>
      </div>
      <div className="flex items-center gap-2">
        {/* Fire/Trending Icon */}
        <div className="bg-white p-1 rounded-md shadow-sm border border-gray-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <span className="text-[11px] font-semibold text-gray-700 tracking-wide">Sold {sold} Product In last {hours} Hours</span>
      </div>
    </div>
  );
};
