import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "@/apis/api";
import { getAuthFetchOptions, handleAuthError, parseApiError } from "@/utils/adminAuth";

export interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  customerName: string;
  phoneNumber: string;
  address: string;
  pincode: string;
  cityState: string;
  totalAmount: number;
  orderStatus: string;
  orderDate: string;
  orderItems: OrderItem[];
}

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

    const fetchOrders = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.getAllOrders, getAuthFetchOptions());

      if (await handleAuthError(response)) return;

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching admin orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Live Polling: हर 30 सेकंड में डेटा रिफ्रेश करें
  useEffect(() => {
    fetchOrders(); // पहली बार तुरंत लोड करें

    const interval = setInterval(() => {
      console.log("Refreshing live orders...");
      fetchOrders();
    }, 30000); // 30 seconds

    return () => clearInterval(interval); // कंपोनेंट हटते ही इंटरवल बंद
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const response = await fetch(
        API_ENDPOINTS.updateOrderStatus(orderId, newStatus),
        getAuthFetchOptions("PATCH", undefined, "application/json")
      );

      if (await handleAuthError(response)) return false;

      if (!response.ok) {
        const errorMessage = await parseApiError(response);
        alert(`Business Rule Violation: ${errorMessage || "Invalid status transition."}`);
        fetchOrders();
        setUpdatingId(null);
        return false;
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (error: any) {
      console.error("Network or Client Error:", error);
      alert("Something went wrong with the connection.");
      fetchOrders();
    } finally {
      setUpdatingId(null);
    }
  };

    return { orders, loading, updatingId, handleStatusChange, fetchOrders };
};