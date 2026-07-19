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
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
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

  const fetchCustomers = async (pageIndex = page) => {
    setLoading(true);
    try {
      const data = await apiClient<any>(`/api/admin/customers?page=${pageIndex}&size=10`);
      if (Array.isArray(data)) {
        setCustomers(data);
        setTotalPages(1);
        setTotalElements(data.length);
      } else {
        setCustomers(data.content || []);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
        setPage(data.number || 0);
      }
    } catch (err) {
      console.error("Failed to fetch customers", err);
    } finally {
      setLoading(false);
    }
  };

  const searchCustomers = async (search: string, pageIndex = 0) => {
    setLoading(true);
    try {
      const url = search.trim()
        ? `/api/admin/customers?search=${encodeURIComponent(search)}&page=${pageIndex}&size=10`
        : `/api/admin/customers?page=${pageIndex}&size=10`;
      const data = await apiClient<any>(url);
      if (Array.isArray(data)) {
        setCustomers(data);
        setTotalPages(1);
        setTotalElements(data.length);
        setPage(0);
      } else {
        setCustomers(data.content || []);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
        setPage(data.number || 0);
      }
    } catch (err) {
      console.error("Failed to search customers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Run asynchronously to avoid calling setState synchronously within the effect body
    Promise.resolve().then(() => {
      fetchCustomers(page);
    });
  }, [page]);

  return { history, customers, page, totalPages, totalElements, setPage, loading, fetchHistory, fetchCustomers, searchCustomers };
};