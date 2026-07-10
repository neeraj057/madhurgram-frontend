"use client";
import React from 'react';
import { X, Trash2, Plus, Minus } from 'lucide-react';

// 📦 स्टॉक फील्ड को यहाँ भी इंटरफ़ेस में जोड़ दिया है
interface CartItem {
  id: number;
  name: string;
  price: number;
  volume: string;
  imageUrl: string;
  quantity: number;
  stock: number; // 👈 वेयरहाउस स्टॉक
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: number) => void;
  // 🔄 टाइप अपडेट: अब यह तीसरा पैरामीटर 'stock' भी लेगा
  onUpdateQuantity: (id: number, quantity: number, stock: number) => void;
  onCheckout: () => void; // 💳 चेकआउट ओपन करने के लिए नया प्रोप
}

// 📦 Ornate traditional Indian sandook icon
const SwadeshiPitaraIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className} 
    stroke="currentColor" 
    strokeWidth="1.5"
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {/* Chest Lid */}
    <path d="M3 10V6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5V10" />
    {/* Chest Body */}
    <path d="M2 10h20v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" />
    {/* Structural bands */}
    <path d="M7 4v18" strokeWidth="1" opacity="0.5" />
    <path d="M17 4v18" strokeWidth="1" opacity="0.5" />
    {/* Lock */}
    <rect x="10.5" y="11" width="3" height="4" rx="0.5" fill="currentColor" />
  </svg>
);

// 🛡️ Decorative Brass Corner Bracket Component for Sandook framing
const BrassCorner = ({ className }: { className: string }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={`absolute w-8 h-8 text-[#D4AF37]/25 pointer-events-none select-none z-20 ${className}`}
  >
    {/* Ornate L-shape brass bracket */}
    <path d="M 0 0 L 100 0 L 100 15 L 15 15 L 15 100 L 0 100 Z" fill="currentColor" />
    {/* Corner rivet accents */}
    <circle cx="8" cy="8" r="3" fill="#D4AF37" />
    <circle cx="45" cy="8" r="2" fill="#D4AF37" />
    <circle cx="8" cy="45" r="2" fill="#D4AF37" />
    {/* Engraved style curves */}
    <path d="M 15 15 C 30 30, 30 30, 45 15" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.4" />
    <path d="M 15 15 C 30 30, 30 30, 15 45" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.4" />
  </svg>
);

export default function CartDrawer({ isOpen, onClose, cartItems, onRemoveItem, onUpdateQuantity, onCheckout }: CartDrawerProps) {
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}>
      
      {/* 1. Dark Backdrop Overlay */}
      <div 
        className={`absolute inset-0 bg-black/75 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* 2. Side Panel - Styled like a Traditional Wooden Chest (Sandook) */}
      <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-gradient-to-b from-[#1F1109] via-[#160D07] to-[#0E0603] text-[#FDFBF7] p-8 shadow-2xl transition-transform duration-500 ease-out flex flex-col justify-between border-l border-[#D4AF37]/25 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Sandook Decorative Inset Border */}
        <div className="absolute inset-4 border border-dashed border-[#D4AF37]/15 rounded-2xl pointer-events-none z-10" />

        {/* 4 Brass Corners for the Sandook Frame */}
        <BrassCorner className="top-4 left-4 rotate-0" />
        <BrassCorner className="top-4 right-4 rotate-90" />
        <BrassCorner className="bottom-4 left-4 -rotate-90" />
        <BrassCorner className="bottom-4 right-4 rotate-180" />

        {/* Drawer Content Area */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-[#D4AF37]/25 relative">
              <div className="flex items-center space-x-3.5">
                <div className="p-2 bg-[#25150E] border border-[#D4AF37]/35 rounded-xl">
                  <SwadeshiPitaraIcon className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold tracking-wide text-[#FDFBF7]">मधुरग्राम पिटारा</h3>
                  <p className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-semibold mt-0.5">Your Swadeshi Pitara</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 hover:text-[#D4AF37] transition-colors rounded-full border border-gray-800 hover:border-[#D4AF37]/40 bg-[#160D07]/60 text-gray-400"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* DYNAMIC CART ITEMS LIST */}
            {cartItems.length > 0 ? (
              <div className="mt-6 space-y-4 overflow-y-auto max-h-[60vh] pr-2 scrollbar-thin">
                {cartItems.map((item) => {
                  const isMaxStockReached = item.quantity >= item.stock;

                  return (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between bg-[#25150E]/40 hover:bg-[#25150E]/60 p-4 rounded-xl border border-[#D4AF37]/10 hover:border-[#D4AF37]/25 transition-all duration-300 relative z-20 backdrop-blur-xs"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-14 w-14 flex items-center justify-center bg-[#150B05] rounded-xl p-1.5 border border-[#D4AF37]/10">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="h-full w-full object-contain"
                            onError={(e) => { e.currentTarget.src = "https://placehold.co/100x100/e6e6e6/111111?text=MG"; }}
                          />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold font-serif max-w-[180px] truncate text-[#FDFBF7]">{item.name}</h4>
                          <p className="text-[10px] text-gray-500 mb-2">{item.volume}</p>
                          
                          <div className="flex items-center space-x-2 border border-[#D4AF37]/20 rounded-lg bg-[#0F0804]/90 p-0.5 w-max">
                            {/* ➖ Minus Button */}
                            <button 
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1, item.stock)}
                              className="p-1 text-gray-400 hover:text-[#D4AF37] transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            
                            <span className="font-mono text-xs px-2 min-w-[20px] text-center text-gray-200">
                              {item.quantity}
                            </span>
                            
                            {/* ➕ Plus Button */}
                            <button 
                              disabled={isMaxStockReached}
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1, item.stock)}
                              className={`p-1 transition-colors ${
                                isMaxStockReached 
                                  ? "text-gray-800 cursor-not-allowed" 
                                  : "text-gray-400 hover:text-[#D4AF37]"
                              }`}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right flex flex-col items-end justify-between h-full space-y-4">
                        <p className="text-xs font-bold text-[#D4AF37]">₹{item.price * item.quantity}</p>
                        <button 
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1 text-gray-600 hover:text-red-400 transition-colors mt-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="h-20 w-20 rounded-full bg-[#25150E]/60 flex items-center justify-center mb-6 border border-[#D4AF37]/20 relative">
                  <div className="absolute inset-0 bg-[#D4AF37]/5 rounded-full blur-md" />
                  <SwadeshiPitaraIcon className="h-8 w-8 text-[#D4AF37]/50" />
                </div>
                <p className="text-sm tracking-widest text-[#D4AF37] uppercase font-bold font-serif">पिटारा अभी खाली है!</p>
                <p className="text-xs text-gray-400 mt-2.5 max-w-xs font-light px-4 leading-relaxed">
                  गोपीगंज के खेतों की 100% शुद्धता और स्वाद से भरा अपना स्वदेशी पिटारा सजाएं।
                </p>
              </div>
            )}
          </div>

          {/* Footer Checkout Box (Representing the Locking Base of the Sandook) */}
          <div className="border-t border-[#D4AF37]/25 pt-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Subtotal</span>
              <span className="text-xl font-bold font-mono text-[#D4AF37]">₹{subtotal}.00</span>
            </div>
            
            <button 
              disabled={cartItems.length === 0}
              onClick={onCheckout}
              className={`w-full py-4.5 rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 relative overflow-hidden ${
                cartItems.length === 0
                  ? "bg-[#25150E] border border-[#D4AF37]/10 text-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-[#111111] hover:brightness-110 active:scale-95 shadow-lg shadow-[#D4AF37]/10 border border-[#D4AF37]/35 cursor-pointer"
              }`}
            >
              {cartItems.length === 0 ? 'पिटारा खाली है' : 'Secure Swadeshi Checkout'}
            </button>
            
            <p className="text-center text-[10px] text-gray-500 mt-4.5 tracking-wide">
              ✦ गोपीगंज (भदोही) के खेतों से 100% डायरेक्ट होम डिलीवरी ✦
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}