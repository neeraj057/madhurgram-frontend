"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import HeroSection from "@/components/common/HeroSection";
import ProductGrid from "@/components/features/product/ProductGrid";
import FooterSection from "@/components/common/FooterSection";
import CartDrawer from "@/components/features/cart/CartDrawer";
import CheckoutModal from "@/components/features/checkout/CheckoutModal"; // नया मॉड्यूल इम्पोर्ट किया
import { useCart, CartItem } from "@/hooks/useCart";
import { fetchRecoveredCart } from "@/apis/cartRecovery";
import TestimonialsSection from "@/components/features/feedback/TestimonialsSection";
import TrustStrip from "@/components/common/TrustStrip";
import FAQSection from "@/components/common/FAQSection";
import WhatsAppButton from "@/components/common/WhatsAppButton";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("shop-all");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false); // चेकआउट मोडल कंट्रोल स्टेट
  const [recentlyAddedId, setRecentlyAddedId] = useState<number | null>(null);
  const [cartPulse, setCartPulse] = useState(false);

  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    loadCart,
    totalCartCount,
  } = useCart();

  // 📥 Recovery Deep Link & Promo Auto-Redeem Trigger
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const couponParam = params.get("coupon");
      if (couponParam) {
        console.log("Saving coupon code from QR scan URL:", couponParam);
        localStorage.setItem("active_coupon", couponParam.trim().toUpperCase());
      }

      const phone = params.get("recoverCart");
      if (phone) {
        const performRecovery = async () => {
          try {
            console.log("Restoring cart session for phone:", phone);
            const cartSession = await fetchRecoveredCart(phone);
            if (cartSession && cartSession.cartItemsJson) {
              const parsedItems = JSON.parse(cartSession.cartItemsJson);
              loadCart(parsedItems);
              
              // Pre-fill phone number in localStorage
              localStorage.setItem("mg_customer_phone", cartSession.phoneNumber);
              
              // Open cart drawer immediately
              setIsCartOpen(true);
              
              // Clean URL query parameters
              const url = new URL(window.location.href);
              url.searchParams.delete("recoverCart");
              window.history.replaceState({}, "", url.toString());
            }
          } catch (err) {
            console.error("Cart recovery failed:", err);
          }
        };
        performRecovery();
      }
    }
  }, [loadCart, setIsCartOpen]);

  // सबटोटल की गणना ताकि चेकआउट को अमाउंट भेजा जा सके
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // ऑर्डर सक्सेसफुल होने पर कार्ट क्लियर करने का हैंडलर
  const handleOrderSuccess = () => {
    setIsCheckoutOpen(false);
    // यहाँ हम मैन्युअली रिफ्रेश या स्टेट को क्लियर कर सकते हैं
    // अभी के लिए सिंपल यूआई सिमुलेशन
    window.location.reload(); 
  };

  const handleAddToCart = (product: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    addToCart(product, quantity);
    setIsCartOpen(true); // 🛒 Automatically slide open the cart drawer!
    setRecentlyAddedId(product.id);
    setCartPulse(true);

    window.setTimeout(() => setCartPulse(false), 600);
    window.setTimeout(() => setRecentlyAddedId(null), 1400);
  };

  return (
    <main className="relative min-h-screen bg-[#FDFBF7] overflow-x-hidden">
      {/* Page-Wide Premium Heritage Village Journey Subtle Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: "url('/images/village_seamless_bg.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: '750px',
        }}
      />
      
      <div className="relative z-10">
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

      <TrustStrip />

      <FAQSection />

      <TestimonialsSection />

      <FooterSection onAddToCart={handleAddToCart} />

      {/* Floating WhatsApp Support Button */}
      <WhatsAppButton />
      
      </div>

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