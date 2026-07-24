import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "@/apis/api";

export interface StorefrontSettings {
  // Hero settings
  heroContentType: string;
  offerTitle: string;
  offerSubtitle: string;
  offerLink: string;
  offerCoupon: string;
  customImageUrl: string;
  
  // Flash sale settings
  flashSaleEnabled: string;
  flashSaleText: string;
  flashSaleEndTime: string;
  flashSaleLink: string;
}

export function useStorefrontSettings() {
  const [settings, setSettings] = useState<StorefrontSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch(API_ENDPOINTS.getHeroConfig);
        if (res.ok) {
          const config = await res.json();
          setSettings({
            heroContentType: config.heroContentType || "video",
            offerTitle: config.offerTitle || "",
            offerSubtitle: config.offerSubtitle || "",
            offerLink: config.offerLink || "/#products",
            offerCoupon: config.offerCoupon || "",
            customImageUrl: config.customImageUrl || "",
            flashSaleEnabled: config.flashSaleEnabled || "false",
            flashSaleText: config.flashSaleText || "Monsoon Wellness Sale: Get Flat 15% OFF on Premium Bilona Ghee",
            flashSaleEndTime: config.flashSaleEndTime || "",
            flashSaleLink: config.flashSaleLink || "/#products",
          });
        }
      } catch (err) {
        console.warn("Using default storefront config due to network fallback", err);
      } finally {
        setLoading(false);
      }
    }

    fetchConfig();
  }, []);

  return { settings, loading };
}
