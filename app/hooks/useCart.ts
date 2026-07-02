"use client";
import { useState } from "react";

// कार्ट आइटम का ग्लोबल डेटा स्ट्रक्चर
export interface CartItem {
  id: number;
  name: string;
  price: number;
  volume: string;
  imageUrl: string;
  quantity: number;
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // कार्ट में नया प्रोडक्ट जोड़ने या क्वांटिटी बढ़ाने का फंक्शन
  const addToCart = (product: any) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // कार्ट के अंदर ही क्वांटिटी अपडेट करने का फंक्शन
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // कार्ट से ITEM डिलीट करने का फंक्शन
  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // कुल आइटम्स की संख्या गिनना
  const totalCartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    totalCartCount,
  };
}