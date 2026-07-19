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
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchOrders = async (pageIndex = page) => {
    try {
      const data = await apiClient<any>(`/api/orders?page=${pageIndex}&size=10`);
      if (Array.isArray(data)) {
        setOrders(data);
        setTotalPages(1);
      } else {
        setOrders(data.content || []);
        setTotalPages(data.totalPages || 1);
        setPage(data.number || 0);
      }
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
      fetchOrders(page);
    });

    const interval = setInterval(() => {
      console.log("Refreshing live orders...");
      fetchOrders(page);
    }, LIVE_POLLING_INTERVAL);

    return () => clearInterval(interval); // कंपोनेंट हटते ही इंटरवल बंद
  }, [page]);

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
      fetchOrders(page);
    } finally {
      setUpdatingId(null);
    }
  };

  return { orders, page, totalPages, setPage, loading, updatingId, handleStatusChange, fetchOrders };
};