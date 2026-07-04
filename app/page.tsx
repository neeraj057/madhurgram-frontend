"use client";
import React, { useState } from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import ProductGrid from "../components/ProductGrid";
import FooterSection from "../components/FooterSection";
import CartDrawer from "../components/CartDrawer";
import CheckoutModal from "../components/CheckoutModal"; // नया मॉड्यूल इम्पोर्ट किया
import { useCart, CartItem } from "./hooks/useCart";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("shop-all");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false); // चेकआउट मोडल कंट्रोल स्टेट
  const [cartFeedback, setCartFeedback] = useState<string | null>(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState<number | null>(null);
  const [cartPulse, setCartPulse] = useState(false);

  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    totalCartCount,
  } = useCart();

  // सबटोटल की गणना ताकि चेकआउट को अमाउंट भेजा जा सके
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // ऑर्डर सक्सेसफुल होने पर कार्ट क्लियर करने का हैंडलर
  const handleOrderSuccess = () => {
    setIsCheckoutOpen(false);
    // यहाँ हम मैन्युअली रिफ्रेश या स्टेट को क्लियर कर सकते हैं
    // अभी के लिए सिंपल यूआई सिमुलेशन
    window.location.reload(); 
  };

  const handleAddToCart = (product: Omit<CartItem, 'quantity'>) => {
    addToCart(product);
    setCartFeedback(`${product.name} added to cart`);
    setRecentlyAddedId(product.id);
    setCartPulse(true);

    window.setTimeout(() => setCartFeedback(null), 2200);
    window.setTimeout(() => setCartPulse(false), 600);
    window.setTimeout(() => setRecentlyAddedId(null), 1400);
  };

  return (
    <main className="relative min-h-screen bg-[#FDFBF7]">
      <Header 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
        onCartClick={() => setIsCartOpen(true)} 
        cartCount={totalCartCount} 
        cartPulse={cartPulse}
      />
      
      <HeroSection />
      
      <div className="w-full">
        <ProductGrid activeCategory={activeCategory} onAddToCart={handleAddToCart} addedProductId={recentlyAddedId} />
      </div>

      <FooterSection />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity} 
        onCheckout={() => {
          setIsCartOpen(false); // कार्ट बंद करो
          setIsCheckoutOpen(true); // चेकआउट खोलो
        }}
      />

      {cartFeedback && (
        <div className="fixed right-6 bottom-6 z-50 rounded-3xl border border-[#D4AF37]/30 bg-[#111111]/95 px-5 py-4 shadow-2xl backdrop-blur-sm text-white">
          <p className="text-sm font-semibold tracking-wide">{cartFeedback}</p>
          <button
            onClick={() => setIsCartOpen(true)}
            className="mt-3 inline-flex items-center rounded-full bg-[#D4AF37] px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-[#111111] font-bold"
          >
            View Cart
          </button>
        </div>
      )}

      {/* 💳 चेकआउट मोडल एकदम सेपरेटेड और क्लीन */}
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        subtotal={subtotal}
        cartItems={cartItems} // कार्ट आइटम्स पास कर रहे हैं
        onOrderSuccess={handleOrderSuccess}
      />
    </main>
  );
}