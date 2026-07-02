"use client";
import React, { useState } from 'react';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react'; // एनीमेशन और बटन के लिए आइकॉन्स
import { API_ENDPOINTS } from '../apis/api';


interface CartItem {
  id: number;
  name: string;
  price: number;
  volume: string;
  imageUrl: string;
  quantity: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtotal: number;
  cartItems: CartItem[];
  onOrderSuccess: () => void;
}

export default function CheckoutModal({ isOpen, onClose, subtotal, cartItems, onOrderSuccess }: CheckoutModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 🎉 ऑर्डर सक्सेस होने पर ID स्टोर करने के लिए स्टेट
  const [placedOrderId, setPlacedOrderId] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    const mappedOrderItems = cartItems.map(item => ({
      productId: item.id,
      productName: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    const orderPayload = {
      customerName: formData.get("customerName") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      address: formData.get("address") as string,
      pincode: formData.get("pincode") as string,
      cityState: formData.get("cityState") as string,
      totalAmount: subtotal,
      orderStatus: "PENDING",
      orderItems: mappedOrderItems
    };

    try {
      const response = await fetch(API_ENDPOINTS.placeOrder, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        throw new Error("Backend server rejected the order.");
      }

      const savedOrder = await response.json();
      // 🌟 एलर्ट हटाकर सीधे स्टेट में ID सेट कर रहे हैं ताकि सक्सेस स्क्रीन दिखे
      setPlacedOrderId(savedOrder.id);
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Failed to connect with Java Server.");
    } {
      setIsSubmitting(false);
    }
  };

  // जब यूजर सक्सेस स्क्रीन पर "Continue Shopping" दबाएगा
  const handleFinalClose = () => {
    setPlacedOrderId(null); // रीसेट स्टेट
    onOrderSuccess(); // कार्ट क्लियर और मोडल क्लोज
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all duration-300">
      {/* Backdrop Click Close (Only allowed if not submitting and not success yet) */}
      <div className="absolute inset-0" onClick={!placedOrderId && !isSubmitting ? onClose : undefined} />
      
      {/* Container Box */}
      <div className="relative w-full max-w-lg bg-[#111111] text-[#FDFBF7] rounded-2xl p-8 border border-gray-800 shadow-2xl z-10 max-h-[90vh] overflow-y-auto transition-all duration-500">
        
        {/* CONDITION 1: अगर ऑर्डर सक्सेसफुल हो गया है तो ये प्रीमियम स्क्रीन दिखेगी */}
        {placedOrderId ? (
          <div className="flex flex-col items-center text-center py-6 animate-fadeIn">
            <div className="h-20 w-20 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-6 border border-[#D4AF37]/30 text-[#D4AF37] animate-bounce">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase">
              Order Confirmed
            </span>
            <h3 className="font-serif text-3xl font-bold tracking-wide mt-2">
              Aapka Koshish, Hamara Vaada!
            </h3>
            
            <div className="mt-4 bg-[#161616] border border-gray-800/60 px-6 py-3 rounded-xl font-mono text-xs text-gray-400">
              Order ID: <span className="text-[#D4AF37] font-bold">MG-000{placedOrderId}</span>
            </div>

            <p className="text-xs text-gray-500 max-w-sm mt-6 leading-relaxed font-light">
              Thank you for supporting traditional village artisans. Your batch of pure, handcrafted essentials is being securely packed at our MadhurGram facility and will be dispatched shortly.
            </p>

            <button 
              onClick={handleFinalClose}
              className="mt-8 w-full py-4 bg-[#D4AF37] text-[#111111] font-bold rounded-lg text-xs uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-[#FDFBF7] transition-all group active:scale-95"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        ) : (
          
          /* CONDITION 2: डिफ़ॉल्ट शिपिंग फॉर्म */
          <>
            <h3 className="font-serif text-2xl font-bold tracking-wide text-[#D4AF37] border-b border-gray-800 pb-4">
              Shipping Information
            </h3>
            
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Full Name</label>
                <input name="customerName" required type="text" className="w-full bg-[#161616] border border-gray-800 rounded-lg p-3 text-sm text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37]" placeholder="Enter your name" />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Phone Number</label>
                <input name="phoneNumber" required type="tel" className="w-full bg-[#161616] border border-gray-800 rounded-lg p-3 text-sm text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37]" placeholder="10-digit mobile number" />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Delivery Address</label>
                <textarea name="address" required rows={3} className="w-full bg-[#161616] border border-gray-800 rounded-lg p-3 text-sm text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37] resize-none" placeholder="House No., Street, Area details" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Pincode</label>
                  <input name="pincode" required type="text" className="w-full bg-[#161616] border border-gray-800 rounded-lg p-3 text-sm text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37]" placeholder="6-digit code" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">City / State</label>
                  <input name="cityState" required type="text" className="w-full bg-[#161616] border border-gray-800 rounded-lg p-3 text-sm text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37]" placeholder="e.g. Pune, Maharashtra" />
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4 mt-6">
                <div className="flex justify-between text-sm mb-2 text-gray-400">
                  <span>Total Payable:</span>
                  <span className="font-mono text-[#FDFBF7] font-bold text-lg">₹{subtotal}.00</span>
                </div>
                
                <div className="max-h-24 overflow-y-auto space-y-1 mb-4 bg-black/20 p-2 rounded-lg border border-gray-900">
                  {cartItems && cartItems.map(item => (
                    <div key={item.id} className="flex justify-between text-[11px] text-gray-500">
                      <span>{item.name} (x{item.quantity})</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-gray-500 mb-4">Payment Method: Cash on Delivery (COD)</p>
                
                <div className="flex space-x-3">
                  <button disabled={isSubmitting} type="button" onClick={onClose} className="flex-1 py-3.5 border border-gray-800 text-gray-400 rounded-lg text-xs uppercase tracking-wider hover:bg-gray-900 transition-colors disabled:opacity-50">
                    Cancel
                  </button>
                  <button disabled={isSubmitting} type="submit" className="flex-1 py-3.5 bg-[#D4AF37] text-[#111111] font-bold rounded-lg text-xs uppercase tracking-wider hover:bg-[#FDFBF7] transition-all active:scale-95 disabled:bg-gray-700">
                    {isSubmitting ? "Placing Order..." : "Place Order"}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}

      </div>
    </div>
  );
}