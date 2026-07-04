"use client";
import { useState } from "react";

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
  // नोट: 'any' टाइप हटाकर हमने इसे टाइप-सेफ बना दिया है (Omit का मतलब है quantity को छोड़कर बाकी सब)
  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      // 🚨 Inventory Guard 1: अगर प्रोडक्ट पूरी तरह से आउट ऑफ स्टॉक है
      if (product.stock <= 0) {
        alert("माफ़ करना भाई, यह प्रोडक्ट अभी आउट ऑफ स्टॉक है!");
        return prevItems;
      }

      // 🚨 Inventory Guard 2: अगर आइटम पहले से कार्ट में है, तो चेक करो कि नई क्वांटिटी स्टॉक से ज्यादा न हो जाए
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          alert(`बस भाई! वेयरहाउस में ${product.name} की केवल ${product.stock} यूनिट्स ही बची हैं।`);
          return prevItems; // कार्ट अपडेट नहीं होगा, पुराना स्टेट ही रिटर्न कर देंगे
        }
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      // नया आइटम कार्ट में डालो (बाय डिफ़ॉल्ट क्वांटिटी 1 रहेगी)
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // 🔄 कार्ट के अंदर ही क्वांटिटी अपडेट करने का फंक्शन (+ / - बटन के लिए)
  // नोट: इसमें 'currentStock' पैरामीटर ऐड किया है ताकि कार्ट पेज पर भी लिमिट चेक हो सके
  const updateQuantity = (id: number, newQuantity: number, currentStock: number) => {
    // अगर क्वांटिटी 0 या उससे कम की, तो आइटम कार्ट से रिमूव हो जाएगा
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    // 🚨 Inventory Guard 3: कार्ट पेज पर प्लस (+) बटन दबाने पर बाउंड्री चेक करो
    if (newQuantity > currentStock) {
      alert(`माफ़ करना, स्टॉक में केवल ${currentStock} यूनिट्स ही उपलब्ध हैं।`);
      return; // स्टेट अपडेट रोक दो
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // 🗑️ कार्ट से ITEM डिलीट करने का फंक्शन
  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
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
    totalCartCount,
  };
}