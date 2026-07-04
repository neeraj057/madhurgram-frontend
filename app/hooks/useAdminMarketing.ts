import { useState } from "react";
import { API_ENDPOINTS } from "../../apis/api";
import { handleAuthError } from "../utils/adminAuth";

export interface BroadcastCampaignRequest {
  title: string;
  message: string;
  targetSegment: string;
  productKeyword: string;
  productId?: number | null;
}

export interface BroadcastCampaign {
  id: number;
  title: string;
  message: string;
  targetSegment: string;
  productKeyword: string;
  productId?: number | null;
  recipients: number;
  conversions: number;
  createdAt: string;
}

export const useAdminMarketing = () => {
  const [campaigns, setCampaigns] = useState<BroadcastCampaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(API_ENDPOINTS.adminMarketingCampaigns, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (handleAuthError(response)) return;
      if (!response.ok) throw new Error("Failed to load campaigns.");

      const data = await response.json();
      setCampaigns(data);
    } catch (err: any) {
      console.error("Marketing load error:", err);
      setError(err.message || "Unable to fetch marketing campaigns.");
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (payload: BroadcastCampaignRequest) => {
    setSubmitting(true);
    setError(null);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(API_ENDPOINTS.adminMarketingBroadcast, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (handleAuthError(response)) return null;
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create broadcast campaign.");
      }

      const created = await response.json();
      return created as BroadcastCampaign;
    } catch (err: any) {
      console.error("Campaign submit error:", err);
      setError(err.message || "Unable to send campaign.");
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  return { campaigns, loading, submitting, error, fetchCampaigns, createCampaign };
};
