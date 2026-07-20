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
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayOrders: 0,
    yesterdayOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0
  });

  const fetchOrders = async (pageIndex = page) => {
    try {
      const [data, statsData] = await Promise.all([
        apiClient<any>(`/api/v1/orders?page=${pageIndex}&size=10`),
        apiClient<any>(`/api/v1/orders/stats`)
      ]);
      
      if (statsData) {
        setStats(statsData);
      }

      if (Array.isArray(data)) {
        setOrders(data);
        setTotalPages(1);
      } else {
        setOrders(data.content || []);
        setTotalPages(data.totalPages || 1);
        const serverPage = data.page !== undefined ? data.page : (data.number !== undefined ? data.number : pageIndex);
        setPage(serverPage);
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
      await apiClient<Order>(`/api/v1/orders/${orderId}/status?status=${encodeURIComponent(newStatus)}`, {
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

  return { orders, stats, page, totalPages, setPage, loading, updatingId, handleStatusChange, fetchOrders };
};