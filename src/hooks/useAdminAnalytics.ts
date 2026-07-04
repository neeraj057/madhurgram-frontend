import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "@/apis/api";
import { getAuthFetchOptions, handleAuthError, parseApiError } from "@/utils/adminAuth";

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
      const response = await fetch(API_ENDPOINTS.getDailyAnalytics, getAuthFetchOptions());

      if (await handleAuthError(response)) return;
      if (!response.ok) {
        const errorMessage = await parseApiError(response);
        throw new Error(errorMessage || "Failed to load analytics data.");
      }

      const data = await response.json();
      setMetrics(data);
    } catch (err: any) {
      console.error("Dashboard Error:", err);
      setError("Unable to connect to the MadhurGram server.");
    } finally {
      setLoading(false);
    }
  };

    // पेज लोड होते ही डेटा सिंक करो और फिर हर 60 सेकंड में ऑटो-रिफ्रेश करो
  useEffect(() => {
    fetchAnalytics(); // पहली बार तुरंत

    const interval = setInterval(() => {
      console.log("Refreshing analytics data...");
      fetchAnalytics();
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  return { metrics, loading, error, fetchAnalytics };
};