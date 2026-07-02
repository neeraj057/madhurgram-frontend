// मथुरग्राम एपीआई कॉन्फ़िगरेशन मैनेजर
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const API_ENDPOINTS = {
  // 🛒 Product Endpoints
  getProducts: (category: string) => `${BASE_URL}/api/products?category=${category}`,
  
  // 💳 Order Endpoints
  placeOrder: `${BASE_URL}/api/orders/place`,
  getAllOrders: `${BASE_URL}/api/orders`,
  updateOrderStatus: (orderId: number, status: string) => `${BASE_URL}/api/orders/${orderId}/status?status=${status}`,
};