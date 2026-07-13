import { useState, useEffect } from "react";
import { apiClient } from "@/apis/apiClient";

export interface CustomerFeedback {
  id: number;
  orderId?: number;
  customerName: string;
  sentiment: string;
  rating: number;
  feedbackText?: string;
  selectedChips?: string;
  productImageUrl?: string;
  createdAt: string;
}

export const useAdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<CustomerFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient<CustomerFeedback[]>("/api/admin/feedback");
      setFeedbacks(data);
    } catch (err: any) {
      console.error("Feedback fetch error:", err);
      setError(err?.message || "Unable to connect to the MadhurGram server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return { feedbacks, loading, error, refresh: fetchFeedbacks };
};
