import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "@/apis/api";

export interface HeroConfig {
  heroContentType: string;
  offerTitle: string;
  offerSubtitle: string;
  offerLink: string;
  offerCoupon: string;
}

export function useHeroConfig() {
  const [config, setConfig] = useState<HeroConfig>({
    heroContentType: "video",
    offerTitle: "",
    offerSubtitle: "",
    offerLink: "/#products",
    offerCoupon: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.getHeroConfig);
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (e) {
      console.error("Error fetching public hero config:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return { config, loading, refetch: fetchConfig };
}
