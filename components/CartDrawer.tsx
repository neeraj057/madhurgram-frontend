"use client";
import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  volume: string;
  imageUrl: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onCheckout: () => void; // 💳 चेकआउट ओपन करने के लिए नया प्रोप
}

export default function CartDrawer({ isOpen, onClose, cartItems, onRemoveItem, onUpdateQuantity, onCheckout }: CartDrawerProps) {
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}>
      
      {/* 1. Dark Backdrop Overlay */}
      <div 
        className={`absolute inset-0 bg-black/60 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* 2. Side Panel */}
      <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-[#111111] text-[#FDFBF7] p-8 shadow-2xl transition-transform duration-500 ease-out flex flex-col justify-between border-l border-gray-800/40 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Header Row */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-gray-800/60">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="h-5 w-5 text-[#D4AF37]" />
              <h3 className="font-serif text-xl font-bold tracking-wide">Your Cart</h3>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:text-[#D4AF37] transition-colors rounded-full border border-gray-800 hover:border-[#D4AF37]/40"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* DYNAMIC CART ITEMS LIST */}
          {cartItems.length > 0 ? (
            <div className="mt-6 space-y-4 overflow-y-auto max-h-[60vh] pr-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-[#161616] p-4 rounded-xl border border-gray-800/40">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="h-12 w-12 object-contain bg-gray-900 rounded-lg p-1"
                      onError={(e) => { e.currentTarget.src = "https://placehold.co/100x100/e6e6e6/111111?text=MG"; }}
                    />
                    <div>
                      <h4 className="text-xs font-bold font-serif max-w-[180px] truncate">{item.name}</h4>
                      <p className="text-[10px] text-gray-500 mb-2">{item.volume}</p>
                      
                      <div className="flex items-center space-x-2 border border-gray-800 rounded-lg bg-black/30 p-0.5 w-max">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-gray-400 hover:text-[#D4AF37] transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-mono text-xs px-2 min-w-[20px] text-center text-gray-200">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-gray-400 hover:text-[#D4AF37] transition-colors"
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
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="h-16 w-16 rounded-full bg-gray-900 flex items-center justify-center mb-4 border border-gray-800">
                <ShoppingBag className="h-6 w-6 text-gray-600" />
              </div>
              <p className="text-sm tracking-widest text-gray-400 uppercase font-medium">Your cart is empty</p>
              <p className="text-xs text-gray-600 mt-2 max-w-xs font-light">Add pure handcrafted essentials from MadhurGram to start your wellness journey.</p>
            </div>
          )}
        </div>

        {/* Footer Checkout Box */}
        <div className="border-t border-gray-800/60 pt-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs uppercase tracking-widest text-gray-400">Subtotal</span>
            <span className="text-xl font-bold font-mono text-[#FDFBF7]">₹{subtotal}.00</span>
          </div>
          
          <button 
            disabled={cartItems.length === 0}
            onClick={onCheckout} // 💳 इस क्लिक पर पैरेंट का चेकआउट मोडल ट्रिगर होगा
            className={`w-full py-4 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
              cartItems.length === 0
                ? "bg-gray-800 border border-gray-700 text-gray-600 cursor-not-allowed"
                : "bg-[#D4AF37] text-[#111111] hover:bg-[#FDFBF7] active:scale-95"
            }`}
          >
            {cartItems.length === 0 ? 'Checkout (Empty)' : 'Proceed to Checkout'}
          </button>
          
          <p className="text-center text-[10px] text-gray-600 mt-3 tracking-wide">
            Shipping and taxes calculated at checkout.
          </p>
        </div>

      </div>
    </div>
  );
}