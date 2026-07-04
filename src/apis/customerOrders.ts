import { API_ENDPOINTS } from "@/apis/api"; 

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
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

export interface ApiErrorResponse {
  status: number;
  error: string;
  message: string;
  timestamp: string;
}


export const fetchCustomerOrders = async (phone: string): Promise<CustomerOrder[]> => {
  const cleanPhone = phone.trim();
  if (!cleanPhone || cleanPhone.length < 10) {
    throw new Error("Please enter a valid 10-digit phone number.");
  }

  const response = await fetch(`${API_ENDPOINTS.getAllOrders}/customer/${cleanPhone}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 204) {
    return [];
  }

  if (!response.ok) {
    try {
      const errorData: ApiErrorResponse = await response.json();
      throw new Error(errorData.message || "Failed to retrieve order history.");
    } catch {
      throw new Error("Server communication error. Please try again later.");
    }
  }

  return response.json();
};