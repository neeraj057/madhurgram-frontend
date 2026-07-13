import { useState } from "react";
import { apiClient } from "@/apis/apiClient";

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
      const data = await apiClient<BroadcastCampaign[]>("/api/admin/marketing/campaigns");
      setCampaigns(data);
    } catch (err) {
      console.error("Marketing load error:", err);
      setError(err instanceof Error ? err.message : "Unable to fetch marketing campaigns.");
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (payload: BroadcastCampaignRequest) => {
    setSubmitting(true);
    setError(null);
    try {
      const created = await apiClient<BroadcastCampaign>("/api/admin/marketing/broadcast", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return created;
    } catch (err) {
      console.error("Campaign submit error:", err);
      setError(err instanceof Error ? err.message : "Unable to send campaign.");
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  return { campaigns, loading, submitting, error, fetchCampaigns, createCampaign };
};
