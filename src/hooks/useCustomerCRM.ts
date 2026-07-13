// hooks/useCustomerCRM.ts
import { useState, useEffect } from "react";
import { apiClient } from "@/apis/apiClient";

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
      const data = await apiClient<CustomerHistory>(`/api/admin/customers/${phone.trim()}/history`);
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
      const data = await apiClient<CustomerStats[]>("/api/admin/customers");
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
      const url = search.trim()
        ? `/api/admin/customers?search=${encodeURIComponent(search)}`
        : "/api/admin/customers";
      const data = await apiClient<CustomerStats[]>(url);
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