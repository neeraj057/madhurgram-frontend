import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../apis/api";

export interface AdminAnalytics {
  todayRevenue: number;
  todayOrderCount: number;
  pendingOrderCount: number;
  lowStockProductCount: number;
}

export const useAdminAnalytics = () => {
  const [metrics, setMetrics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.getDailyAnalytics);
      if (!response.ok) throw new Error("Failed to load analytics data.");
      
      const data = await response.json();
      setMetrics(data);
    } catch (err: any) {
      console.error("Dashboard Error:", err);
      setError("Unable to connect to the MadhurGram server.");
    } finally {
      setLoading(false);
    }
  };

  // पेज लोड होते ही डेटा सिंक करो
  useEffect(() => {
    fetchAnalytics();
  }, []);

  return { metrics, loading, error, fetchAnalytics };
};