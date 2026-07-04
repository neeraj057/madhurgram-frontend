import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../apis/api"; // पाथ अपने हिसाब से चेक कर लेना भाई
import { clearAdminSession } from "../utils/adminAuth";

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
      const token = localStorage.getItem("adminToken");
      const response = await fetch(API_ENDPOINTS.getAllOrders, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status === 401 || response.status === 403) {
        clearAdminSession();
        return;
      }

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
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        API_ENDPOINTS.updateOrderStatus(orderId, newStatus),
        { 
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 401 || response.status === 403) {
        clearAdminSession();
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Business Rule Violation: ${errorText || "Invalid status transition."}`);
        fetchOrders();
        setUpdatingId(null);
        return;
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