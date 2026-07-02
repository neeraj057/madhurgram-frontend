"use client";
import React, { useState } from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import ProductGrid from "../components/ProductGrid";
import FooterSection from "../components/FooterSection";
import CartDrawer from "../components/CartDrawer";
import CheckoutModal from "../components/CheckoutModal"; // नया मॉड्यूल इम्पोर्ट किया
import { useCart } from "./hooks/useCart";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("shop-all");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false); // चेकआउट मोडल कंट्रोल स्टेट

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

  return (
    <main className="relative min-h-screen bg-[#FDFBF7]">
      <Header 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
        onCartClick={() => setIsCartOpen(true)} 
        cartCount={totalCartCount} 
      />
      
      <HeroSection />
      
      <div className="w-full">
        <ProductGrid activeCategory={activeCategory} onAddToCart={addToCart} />
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