import { useState, useEffect } from "react";
import { apiClient } from "@/apis/apiClient";
import { showToast } from "@/components/ui/Toast";

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
  isApproved?: boolean;
}

export const useAdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<CustomerFeedback[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbacks = async (pageIndex = page) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient<any>(`/api/v1/admin/feedback?page=${pageIndex}&size=10`);
      if (Array.isArray(data)) {
        setFeedbacks(data);
        setTotalPages(1);
      } else {
        setFeedbacks(data.content || []);
        setTotalPages(data.totalPages || 1);
        setPage(data.number || 0);
      }
    } catch (err: any) {
      console.error("Feedback fetch error:", err);
      setError(err?.message || "Unable to connect to the MadhurGram server.");
    } finally {
      setLoading(false);
    }
  };

  const approveFeedback = async (id: number) => {
    try {
      await apiClient<CustomerFeedback>(`/api/v1/admin/feedback/${id}/approve`, {
        method: "PUT"
      });
      showToast("रिव्यू को सफलतापूर्वक अप्रूव कर दिया गया है! 💛", "success");
      await fetchFeedbacks(page);
      return true;
    } catch (err: any) {
      console.error("Approve feedback error:", err);
      showToast(err?.message || "Failed to approve review.", "error");
      return false;
    }
  };

  const deleteFeedback = async (id: number) => {
    try {
      await apiClient<void>(`/api/v1/admin/feedback/${id}`, {
        method: "DELETE"
      });
      showToast("रिव्यू को रिजेक्ट/डिलीट कर दिया गया है।", "success");
      await fetchFeedbacks(page);
      return true;
    } catch (err: any) {
      console.error("Delete feedback error:", err);
      showToast(err?.message || "Failed to delete review.", "error");
      return false;
    }
  };

  useEffect(() => {
    fetchFeedbacks(page);
  }, [page]);

  return { feedbacks, page, totalPages, setPage, loading, error, approveFeedback, deleteFeedback, refresh: () => fetchFeedbacks(page) };
};
