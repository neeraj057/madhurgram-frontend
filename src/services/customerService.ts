import { apiClient } from "@/apis/apiClient";

export type AddressType = "HOME" | "OFFICE" | "OTHER";

export interface Address {
  id?: number;
  addressType: AddressType;
  fullAddress: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
  latitude?: number;
  longitude?: number;
}

export interface CustomerProfile {
  id: number;
  phoneNumber: string;
  fullName: string | null;
  email: string | null;
  addresses: Address[];
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED"
}

export interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface CustomerOrder {
  id: number;
  customerName: string;
  phoneNumber: string;
  address: string;
  pincode: string;
  cityState: string;
  totalAmount: number;
  orderStatus: OrderStatus; 
  orderDate: string;
  orderItems: OrderItem[];
}

export interface SyncCartPayload {
  phoneNumber: string;
  customerName?: string;
  cartItemsJson: string;
  totalAmount: number;
}

export const CustomerService = {
  /**
   * Generates and sends a 4-digit OTP code to the customer's phone number.
   */
  sendOtp: async (phone: string): Promise<void> => {
    return apiClient<void>(`/api/v1/customers/${phone.trim()}/otp/send`, {
      method: "POST",
    });
  },

  /**
   * Verifies the OTP code and resolves the customer's profile.
   */
  verifyOtp: async (phone: string, code: string): Promise<CustomerProfile> => {
    return apiClient<CustomerProfile>(`/api/v1/customers/${phone.trim()}/otp/verify?code=${encodeURIComponent(code.trim())}`, {
      method: "POST",
    });
  },

  /**
   * Fetches customer profile information and saved addresses by phone number.
   */
  fetchProfile: async (phone: string): Promise<CustomerProfile> => {
    return apiClient<CustomerProfile>(`/api/v1/customers/${phone.trim()}`);
  },

  /**
   * Adds a new delivery address to the customer's profile.
   */
  addAddress: async (phone: string, address: Address): Promise<CustomerProfile> => {
    return apiClient<CustomerProfile>(`/api/v1/customers/${phone.trim()}/addresses`, {
      method: "POST",
      body: JSON.stringify(address),
    });
  },

  /**
   * Deletes a delivery address from the customer's profile by ID.
   */
  deleteAddress: async (phone: string, addressId: number): Promise<CustomerProfile> => {
    return apiClient<CustomerProfile>(`/api/v1/customers/${phone.trim()}/addresses/${addressId}`, {
      method: "DELETE",
    });
  },

  /**
   * Synchronizes current cart items to database for abandoned cart recovery.
   */
  syncCart: async (payload: SyncCartPayload): Promise<any> => {
    return apiClient<any>("/api/v1/cart/update", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Recovers a previously saved checkout cart session by phone number.
   */
  fetchRecoveredCart: async (phone: string): Promise<any> => {
    return apiClient<any>(`/api/v1/cart/recover?phone=${phone.trim()}`);
  },

  /**
   * Submits checkout details to place a COD or prepaid order.
   */
  placeOrder: async (orderData: any): Promise<any> => {
    return apiClient<any>("/api/v1/orders/place", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  },

  /**
   * Fetches the order history for a particular customer by phone number.
   */
  fetchCustomerOrders: async (phone: string): Promise<CustomerOrder[]> => {
    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      throw new Error("Please enter a valid 10-digit phone number.");
    }
    return apiClient<CustomerOrder[]>(`/api/v1/orders/customer/${cleanPhone}`);
  },

  /**
   * Retrieves single order details for tracking status.
   */
  trackOrder: async (orderId: number): Promise<any> => {
    return apiClient<any>(`/api/v1/orders/${orderId}`);
  },

  /**
   * Validates eligibility of coupon rules for the checkout purchase.
   */
  validateCoupon: async (code: string, phone: string, amount: number): Promise<any> => {
    return apiClient<any>(
      `/api/v1/coupons/validate?code=${encodeURIComponent(code)}&phone=${encodeURIComponent(phone)}&amount=${amount}`
    );
  },

  /**
   * Fetches the coupon info (like min order value) dynamically without validating usage.
   */
  fetchCouponInfo: async (code: string): Promise<any> => {
    return apiClient<any>(`/api/v1/coupons/info?code=${encodeURIComponent(code)}`);
  }
};
