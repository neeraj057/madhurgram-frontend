import { useState, useEffect } from "react";
import { apiClient } from "@/apis/apiClient";
import { LIVE_POLLING_INTERVAL } from "@/utils/constants";
import { showToast } from "@/components/ui/Toast";

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
  latitude?: number;
  longitude?: number;
  orderItems: OrderItem[];
}

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchOrders = async () => {
    try {
      const data = await apiClient<Order[]>("/api/orders");
      setOrders(data);
    } catch (error) {
      console.error("Error fetching admin orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Live Polling: हर 30 सेकंड में डेटा रिफ्रेश करें
  useEffect(() => {
    // Run asynchronously to avoid calling setState synchronously within the effect body
    Promise.resolve().then(() => {
      fetchOrders();
    });

    const interval = setInterval(() => {
      console.log("Refreshing live orders...");
      fetchOrders();
    }, LIVE_POLLING_INTERVAL);

    return () => clearInterval(interval); // कंपोनेंट हटते ही इंटरवल बंद
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await apiClient<Order>(`/api/orders/${orderId}/status?status=${encodeURIComponent(newStatus)}`, {
        method: "PATCH"
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Network or Client Error:", error);
      showToast(error instanceof Error ? error.message : "Something went wrong with the connection.", "error");
      fetchOrders();
    } finally {
      setUpdatingId(null);
    }
  };

  return { orders, loading, updatingId, handleStatusChange, fetchOrders };
};