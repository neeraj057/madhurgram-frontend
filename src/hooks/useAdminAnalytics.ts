import { useState, useEffect } from "react";
import { apiClient } from "@/apis/apiClient";
import { ANALYTICS_POLLING_INTERVAL } from "@/utils/constants";

export interface DailyRevenue {
  date: string;
  revenue: number;
}

export interface LowStockProduct {
  id: number;
  name: string;
  stock: number;
  price: number;
}

export interface AdminAnalytics {
  todayRevenue: number;
  todayOrderCount: number;
  pendingOrderCount: number;
  lowStockProductCount: number;
  conversionRate: number;
  activeUserCount: number;
  salesGrowthPercent: number;
  revenueGraph: DailyRevenue[];
  lowStockProducts: LowStockProduct[];
}

export const useAdminAnalytics = () => {
  const [metrics, setMetrics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(7);

  const fetchAnalytics = async (queryDays: number = days) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient<AdminAnalytics>(`/api/admin/analytics/daily?days=${queryDays}`);
      setMetrics(data);
    } catch (err) {
      console.error("Dashboard Error:", err);
      setError(err instanceof Error ? err.message : "Unable to connect to the MadhurGram server.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch immediately when days changes
  useEffect(() => {
    fetchAnalytics(days);
  }, [days]);

  // Polling interval
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Refreshing analytics data for days:", days);
      fetchAnalytics(days);
    }, ANALYTICS_POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [days]);

  return { metrics, loading, error, days, setDays, fetchAnalytics: () => fetchAnalytics(days) };
};