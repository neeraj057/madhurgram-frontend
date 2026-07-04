// hooks/useCustomerCRM.ts
import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../apis/api";
import { clearAdminSession } from "../utils/adminAuth";

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

export const useCustomerCRM = () => {
  const [history, setHistory] = useState<any>(null);
  const [customers, setCustomers] = useState<CustomerStats[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async (phone: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(API_ENDPOINTS.customerHistory(phone), {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.status === 401 || res.status === 403) {
        clearAdminSession();
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(API_ENDPOINTS.adminCustomers, {
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        clearAdminSession();
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (err) {
      console.error("Failed to fetch customers", err);
    } finally {
      setLoading(false);
    }
  };

  const searchCustomers = async (search: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const url = search.trim()
        ? `${API_ENDPOINTS.adminCustomers}?search=${encodeURIComponent(search)}`
        : API_ENDPOINTS.adminCustomers;
      const res = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        clearAdminSession();
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (err) {
      console.error("Failed to search customers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return { history, customers, loading, fetchHistory, fetchCustomers, searchCustomers };
};