"use client";
import { useState } from "react";
import { showToast } from "@/components/ui/Toast";

// 📦 कार्ट आइटम का ग्लोबल डेटा स्ट्रक्चर (अब stock फील्ड के साथ ताकि लिमिट चेक हो सके)
export interface CartItem {
  id: number;
  name: string;
  price: number;
  volume: string;
  imageUrl: string;
  quantity: number;
  stock: number; // 👈 वेयरहाउस का लाइव स्टॉक ट्रैक करने के लिए
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 🛒 कार्ट में नया प्रोडक्ट जोड़ने या क्वांटिटी बढ़ाने का फंक्शन
  const addToCart = (product: Omit<CartItem, 'quantity'>, quantityToAdd: number = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id && item.volume === product.volume);

      // 🚨 Inventory Guard 1: agar product poori tarah se out of stock hai
      if (product.stock <= 0) {
        showToast("माफ़ करना भाई, यह प्रोडक्ट अभी आउट ऑफ स्टॉक है!", "error");
        return prevItems;
      }

      // 🚨 Inventory Guard 2: agar item pehle se cart me hai, to check karo ki nayi quantity stock se jyada na ho jaye
      if (existingItem) {
        const targetQty = existingItem.quantity + quantityToAdd;
        if (targetQty > product.stock) {
          showToast(`बस भाई! वेयरहाउस में ${product.name} की केवल ${product.stock} यूनिट्स ही बची हैं।`, "error");
          return prevItems; 
        }
        return prevItems.map((item) =>
          (item.id === product.id && item.volume === product.volume) ? { ...item, quantity: targetQty } : item
        );
      }

      if (quantityToAdd > product.stock) {
        showToast(`बस भाई! वेयरहाउस में ${product.name} की केवल ${product.stock} यूनिट्स ही बची हैं।`, "error");
        return prevItems;
      }

      // नया आइटम कार्ट में डालो
      return [...prevItems, { ...product, quantity: quantityToAdd }];
    });
  };

  // 🔄 कार्ट के अंदर ही क्वांटिटी अपडेट करने का फंक्शन (+ / - बटन के लिए)
  const updateQuantity = (id: number, volume: string, newQuantity: number, currentStock: number) => {
    // अगर क्वांटिटी 0 या उससे कम की, तो आइटम कार्ट से रिमूव हो जाएगा
    if (newQuantity <= 0) {
      removeFromCart(id, volume);
      return;
    }

    // 🚨 Inventory Guard 3: cart page par plus (+) button boundary check karo
    if (newQuantity > currentStock) {
      showToast(`माफ़ करना, स्टॉक में केवल ${currentStock} यूनिट्स ही उपलब्ध हैं।`, "error");
      return; 
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        (item.id === id && item.volume === volume) ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // 🗑️ कार्ट से ITEM डिलीट करने का फंक्शन
  const removeFromCart = (id: number, volume: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => !(item.id === id && item.volume === volume)));
  };

  // 📥 कार्ट में मल्टीपल आइटम्स एक साथ लोड करने का फंक्शन (रिकवरी के लिए)
  const loadCart = (items: CartItem[]) => {
    setCartItems(items);
  };

  // 🧹 कार्ट पूरी तरह साफ़ (clear) करने का फंक्शन
  const clearCart = () => {
    setCartItems([]);
  };

  // 🧮 कुल आइटम्स की संख्या गिनना (हेडर में कार्ट आइकॉन के ऊपर बैज दिखाने के लिए)
  const totalCartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    loadCart,
    clearCart,
    totalCartCount,
  };
}