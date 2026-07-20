import { API_BASE_URL_FALLBACK } from "@/utils/constants";


const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL_FALLBACK;

export const API_ENDPOINTS = {
  // 🛒 Product Endpoints
  getProducts: (category: string) =>
    `${BASE_URL}/api/v1/products?category=${category}`,

  // 💳 Order Endpoints
  placeOrder: `${BASE_URL}/api/v1/orders/place`,
  getAllOrders: `${BASE_URL}/api/v1/orders`,
  updateOrderStatus: (orderId: number, status: string) =>
    `${BASE_URL}/api/v1/orders/${orderId}/status?status=${status}`,
  // 👤 Customer Endpoints
  getCustomerProfile: (phone: string) =>
    `${BASE_URL}/api/customers/${phone.trim()}`,
  addCustomerAddress: (phone: string) =>
    `${BASE_URL}/api/customers/${phone.trim()}/addresses`,
  deleteCustomerAddress: (phone: string, addressId: number) =>
    `${BASE_URL}/api/customers/${phone.trim()}/addresses/${addressId}`,
  // 📊 Analytics Endpoints
  getDailyAnalytics: (days: number = 7) => `${BASE_URL}/api/v1/admin/analytics/daily?days=${days}`,
  adminProducts: `${BASE_URL}/api/v1/admin/products`,
  adminTaxSlabs: `${BASE_URL}/api/v1/admin/tax-slabs`,
  adminCustomers: `${BASE_URL}/api/v1/admin/customers`,
  adminMarketingBroadcast: `${BASE_URL}/api/v1/admin/marketing/broadcast`,
  adminMarketingCampaigns: `${BASE_URL}/api/v1/admin/marketing/campaigns`,
  adminLogin: `${BASE_URL}/api/auth/admin/login`,
  publicProducts: `${BASE_URL}/api/v1/public/products`,
  publicHeartbeat: `${BASE_URL}/api/v1/public/analytics/heartbeat`,
  customerHistory: (phone: string) =>
    `${BASE_URL}/api/v1/admin/customers/${phone.trim()}/history`,

  // 🛒 Abandoned Cart Retention Endpoints
  updateCart: `${BASE_URL}/api/cart/update`,
  recoverCart: (phone: string) => `${BASE_URL}/api/cart/recover?phone=${phone.trim()}`,
  adminAbandonedCarts: `${BASE_URL}/api/v1/admin/abandoned-carts`,
  adminGetAutoRecovery: `${BASE_URL}/api/v1/admin/settings/auto-recovery`,
  adminSetAutoRecovery: (enabled: boolean) => `${BASE_URL}/api/v1/admin/settings/auto-recovery?enabled=${enabled}`,
  trackOrder: (orderId: number) => `${BASE_URL}/api/v1/orders/${orderId}`,

  // 🎟️ Coupon Endpoints
  validateCoupon: (code: string, phone: string, amount: number) =>
    `${BASE_URL}/api/coupons/validate?code=${encodeURIComponent(code)}&phone=${encodeURIComponent(phone)}&amount=${amount}`,
  adminCoupons: `${BASE_URL}/api/v1/admin/coupons`,
  adminCouponById: (id: number) => `${BASE_URL}/api/v1/admin/coupons/${id}`,

  // 📦 Procurement & Returns Endpoints
  adminProcurementPOs: `${BASE_URL}/api/v1/admin/procurement/pos`,
  adminProcurementApprovePO: (id: number) => `${BASE_URL}/api/v1/admin/procurement/pos/${id}/approve`,
  adminReturnsAll: `${BASE_URL}/api/returns/admin/all`,
  adminReturnsApprove: (id: number) => `${BASE_URL}/api/returns/admin/${id}/approve`,
  adminReturnsReject: (id: number) => `${BASE_URL}/api/returns/admin/${id}/reject`,
  publicReturnRequest: `${BASE_URL}/api/returns`,
  publicReturnRequestByOrder: (orderId: number) => `${BASE_URL}/api/returns/order/${orderId}`,
  publicReturnShippingLabel: (id: number) => `${BASE_URL}/api/returns/label/${id}`,

  // 📝 Google Reviews Endpoints
  adminMarketingReviews: `${BASE_URL}/api/v1/admin/marketing/reviews`,
  adminMarketingReviewsConfig: `${BASE_URL}/api/v1/admin/marketing/reviews/config`,
  adminMarketingReviewsSendNow: (id: number) => `${BASE_URL}/api/v1/admin/marketing/reviews/${id}/send-now`,
  adminMarketingReviewsSendTest: `${BASE_URL}/api/v1/admin/marketing/reviews/send-test`,

  // 📝 Feedback Endpoints
  adminFeedback: `${BASE_URL}/api/v1/admin/feedback`,
  publicFeedbackTestimonials: `${BASE_URL}/api/v1/public/feedback/testimonials`,
  publicFeedbackSuggestions: (orderId?: string | number) =>
    `${BASE_URL}/api/v1/public/feedback/suggestions${orderId ? `?orderId=${orderId}` : ""}`,
  publicFeedbackUpload: `${BASE_URL}/api/v1/public/feedback/upload`,
  publicFeedbackSubmit: `${BASE_URL}/api/v1/public/feedback`,

  // ⚙️ Hero Section Config Endpoints
  getHeroConfig: `${BASE_URL}/api/v1/public/settings/hero`,
  adminHeroConfig: `${BASE_URL}/api/v1/admin/settings/hero`,
  updateHeroConfig: `${BASE_URL}/api/v1/admin/settings/hero`,

  // 💬 WhatsApp Quick Buy Config Endpoints
  getWhatsAppConfig: `${BASE_URL}/api/v1/public/settings/whatsapp`,
  adminWhatsAppConfig: `${BASE_URL}/api/v1/admin/settings/whatsapp`,
  updateWhatsAppConfig: `${BASE_URL}/api/v1/admin/settings/whatsapp`,

  // 📍 Pincode SLA Config & Check Endpoints
  checkPincode: (pincode: string) => `${BASE_URL}/api/v1/public/pincode/check?pincode=${pincode}`,
  adminPincodeConfig: `${BASE_URL}/api/v1/admin/settings/pincode`,
  updatePincodeConfig: `${BASE_URL}/api/v1/admin/settings/pincode`,
};
