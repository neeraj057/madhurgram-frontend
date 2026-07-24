import React, { useState, useEffect } from "react";
import { Sparkles, Timer, ArrowRight } from "lucide-react";
import { useStorefrontSettings } from "@/hooks/useStorefrontSettings";
import { useRouter } from "next/navigation";

export default function FlashSaleStrip() {
  const router = useRouter();
  const { settings, loading } = useStorefrontSettings();
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    if (loading || !settings) return;
    if (settings.flashSaleEnabled !== "true") return;

    let targetTime = settings.flashSaleEndTime;

    // Fallback rolling timer if admin left date empty
    if (!targetTime || targetTime.trim() === "") {
      let localTarget = localStorage.getItem("mg_flash_sale_end");
      if (!localTarget || new Date(localTarget).getTime() < Date.now()) {
        localTarget = new Date(Date.now() + 2 * 60 * 60 * 1000 + 14 * 60 * 1000 + 59 * 1000).toISOString();
        localStorage.setItem("mg_flash_sale_end", localTarget);
      }
      targetTime = localTarget;
    }

    const calculateTimeLeft = () => {
      const difference = new Date(targetTime).getTime() - Date.now();
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        // Only auto-roll if it's the fallback timer
        if (!settings.flashSaleEndTime || settings.flashSaleEndTime.trim() === "") {
          const newTarget = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString();
          localStorage.setItem("mg_flash_sale_end", newTarget);
        } else {
          // If a real DB end time has passed, just hide the timer or leave at 0
          setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        }
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [loading, settings]);

  if (loading || !settings || settings.flashSaleEnabled !== "true" || !timeLeft) {
    return null;
  }

  const handleClaimClick = () => {
    if (settings.flashSaleLink) {
      router.push(settings.flashSaleLink);
    }
  };

  return (
    <div className="relative z-50 w-full overflow-hidden bg-[#D4AF37] px-4 py-2 sm:px-6 shadow-md">
      {/* Subtle shine animation */}
      <div className="absolute top-0 -translate-x-full left-0 h-full w-[30%] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 animate-[shimmer_4s_infinite]" />

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-y-1 sm:flex-row sm:gap-x-4 text-center">
        
        {/* Offer Announcement */}
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-black animate-pulse" />
          <p className="text-[10px] sm:text-xs font-bold tracking-widest text-black uppercase" dangerouslySetInnerHTML={{ __html: settings.flashSaleText }} />
        </div>

        {/* Separator for desktop */}
        <div className="hidden sm:block h-3 w-px bg-black/20"></div>

        {/* Timer & Action */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5">
            <Timer className="h-3.5 w-3.5 text-black" />
            <span className="font-mono text-xs font-bold text-black tracking-widest min-w-[65px] text-center">
              {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
            </span>
          </div>

          <button 
            onClick={handleClaimClick}
            className="group/btn flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] bg-black px-3 py-1 sm:px-4 sm:py-1.5 rounded-full hover:bg-gray-900 transition-all shadow-sm"
          >
            Claim Now
            <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
}
