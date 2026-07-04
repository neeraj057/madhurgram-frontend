// hooks/useCustomerCRM.ts
import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "@/apis/api";
import { getAdminToken, handleAuthError, parseApiError } from "@/utils/adminAuth";

export interface CustomerStats {
  name: string;
  phoneNumber: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
  vip: boolean;
  segment: string;
  favoriteProduct: string;
  favoriteProductQuantity: number;
}

export interface CustomerHistoryItem {
  orderId: number;
  orderDate: string;
  status: string;
  totalAmount: number;
}

export interface CustomerHistory {
  name: string;
  phoneNumber: string;
  totalOrders: number;
  totalSpent: number;
  orderHistory: CustomerHistoryItem[];
}

export const useCustomerCRM = () => {
  const [history, setHistory] = useState<CustomerHistory | null>(null);
  const [customers, setCustomers] = useState<CustomerStats[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async (phone: string) => {
    setLoading(true);
    try {
      const token = getAdminToken();
      const res = await fetch(API_ENDPOINTS.customerHistory(phone), {
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (await handleAuthError(res)) return;
      if (!res.ok) {
        const errorMessage = await parseApiError(res);
        throw new Error(errorMessage || "Failed to load customer history.");
      }

      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const token = getAdminToken();
      const res = await fetch(API_ENDPOINTS.adminCustomers, {
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (await handleAuthError(res)) return;
      if (!res.ok) {
        const errorMessage = await parseApiError(res);
        throw new Error(errorMessage || "Failed to load customers.");
      }

      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error("Failed to fetch customers", err);
    } finally {
      setLoading(false);
    }
  };

  const searchCustomers = async (search: string) => {
    setLoading(true);
    try {
      const token = getAdminToken();
      const url = search.trim()
        ? `${API_ENDPOINTS.adminCustomers}?search=${encodeURIComponent(search)}`
        : API_ENDPOINTS.adminCustomers;
      const res = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (await handleAuthError(res)) return;
      if (!res.ok) {
        const errorMessage = await parseApiError(res);
        throw new Error(errorMessage || "Failed to search customers.");
      }

      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error("Failed to search customers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Run asynchronously to avoid calling setState synchronously within the effect body
    Promise.resolve().then(() => {
      fetchCustomers();
    });
  }, []);

  return { history, customers, loading, fetchHistory, fetchCustomers, searchCustomers };
};