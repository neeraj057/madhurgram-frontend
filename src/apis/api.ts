import { API_BASE_URL_FALLBACK } from "@/utils/constants";

// मथुरग्राम एपीआई कॉन्फ़िगरेशन मैनेजर
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL_FALLBACK;

export const API_ENDPOINTS = {
  // 🛒 Product Endpoints
  getProducts: (category: string) =>
    `${BASE_URL}/api/products?category=${category}`,

  // 💳 Order Endpoints
  placeOrder: `${BASE_URL}/api/orders/place`,
  getAllOrders: `${BASE_URL}/api/orders`,
  updateOrderStatus: (orderId: number, status: string) =>
    `${BASE_URL}/api/orders/${orderId}/status?status=${status}`,
  // 👤 Customer Endpoints
  getCustomerProfile: (phone: string) =>
    `${BASE_URL}/api/customers/${phone.trim()}`,
  addCustomerAddress: (phone: string) =>
    `${BASE_URL}/api/customers/${phone.trim()}/addresses`,
  // 📊 Analytics Endpoints
  getDailyAnalytics: `${BASE_URL}/api/admin/analytics/daily`,
  adminProducts: `${BASE_URL}/api/admin/products`,
  adminCustomers: `${BASE_URL}/api/admin/customers`,
  adminMarketingBroadcast: `${BASE_URL}/api/admin/marketing/broadcast`,
  adminMarketingCampaigns: `${BASE_URL}/api/admin/marketing/campaigns`,
  adminLogin: `${BASE_URL}/api/auth/admin/login`,
  publicProducts: `${BASE_URL}/api/public/products`,
  customerHistory: (phone: string) =>
    `${BASE_URL}/api/admin/customers/${phone.trim()}/history`,
  
  // 🛒 Abandoned Cart Retention Endpoints
  updateCart: `${BASE_URL}/api/cart/update`,
  recoverCart: (phone: string) => `${BASE_URL}/api/cart/recover?phone=${phone.trim()}`,
  adminAbandonedCarts: `${BASE_URL}/api/admin/abandoned-carts`,
  adminGetAutoRecovery: `${BASE_URL}/api/admin/settings/auto-recovery`,
  adminSetAutoRecovery: (enabled: boolean) => `${BASE_URL}/api/admin/settings/auto-recovery?enabled=${enabled}`,
  trackOrder: (orderId: number) => `${BASE_URL}/api/orders/${orderId}`,
};
