import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "@/apis/api";

export interface HeroSlide {
  id: string | number;
  type: "video" | "image" | "offer";
  bgMedia?: string;
  badge: string;
  headline: string;
  highlightText?: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  couponCode?: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "brand-purity",
    type: "video",
    bgMedia: "/videos/bg_video.mp4",
    badge: "100% PURE & TRADITIONAL HANDCRAFTED GOODS",
    headline: "गाँव की असली मिठास,",
    highlightText: "अब हर घर में।",
    subtitle: "Direct from the trusted farmers of Gopiganj to your luxury lifestyle. Experience handcrafted purity with zero preservatives.",
    ctaText: "Explore Purity",
    ctaLink: "#products",
  },
  {
    id: "slow-cooked-ghee",
    type: "image",
    bgMedia: "/images/hero_purity.png",
    badge: "TRADITIONAL SLOW-COOKED DESI GHEE",
    headline: "धीमी आँच पर पका,",
    highlightText: "सुनहरा दानेदार देशी घी।",
    subtitle: "Crafted by gently simmering 100% pure fresh cream on low fire in small batches. Experience rich natural aroma and granular texture.",
    ctaText: "Shop Pure Ghee",
    ctaLink: "#products",
  },
  {
    id: "farm-direct",
    type: "image",
    bgMedia: "/images/hero_offer.png",
    badge: "100% DIRECT FROM GOPIGANJ FARMS",
    headline: "बिचौलियों से मुक्त,",
    highlightText: "सीधे किसानों से शुद्धता।",
    subtitle: "Ethically sourced from 45+ local farming families in Bhadohi district. Every purchase directly empowers traditional rural farmers.",
    ctaText: "Explore Collection",
    ctaLink: "#products",
  },
];

export function useHeroBanners() {
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_SLIDES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHeroConfig() {
      try {
        const res = await fetch(API_ENDPOINTS.getHeroConfig);
        if (res.ok) {
          const config = await res.json();
          // If admin configured an active promo offer, prepend offer slide dynamically
          if (config.heroContentType === "offer" || (config.offerTitle && config.offerTitle.trim() !== "")) {
            const offerSlide: HeroSlide = {
              id: "admin-offer",
              type: "offer",
              bgMedia: "/images/hero_offer.png",
              badge: "Limited Swadeshi Special Offer",
              headline: config.offerTitle || "Festive Swadeshi Deal",
              subtitle: config.offerSubtitle || "Experience traditional purity from the farms of Gopiganj at a special discount.",
              ctaText: "Claim Discount",
              ctaLink: config.offerLink || "/#products",
              couponCode: config.offerCoupon || "",
            };
            setSlides([offerSlide, ...DEFAULT_SLIDES]);
          } else {
            setSlides(DEFAULT_SLIDES);
          }
        }
      } catch (err) {
        console.warn("Using default hero slides due to network fallback", err);
        setSlides(DEFAULT_SLIDES);
      } finally {
        setLoading(false);
      }
    }

    fetchHeroConfig();
  }, []);

  return { slides, loading };
}
