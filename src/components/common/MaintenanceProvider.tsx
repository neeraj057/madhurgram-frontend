"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import MaintenancePage from "@/app/maintenance/page";
import { Loader2 } from "lucide-react";

interface MaintenanceProviderProps {
  children: React.ReactNode;
}

export default function MaintenanceProvider({ children }: MaintenanceProviderProps) {
  const pathname = usePathname();
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean>(false);
  const [isBackendDown, setIsBackendDown] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    const envFlag = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";
    setIsMaintenanceMode(envFlag);

    const checkApiHealth = async () => {
      const isAdminRoute = pathname?.startsWith("/admin");
      if (isAdminRoute) {
        setChecking(false);
        return;
      }

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
        const res = await fetch(`${baseUrl}/api/public/feedback/testimonials`, {
          method: "GET",
          signal: AbortSignal.timeout(2000), // 2-second timeout
        });

        if (res.status === 503) {
          setIsBackendDown(true);
        } else {
          setIsBackendDown(false);
        }
      } catch (err) {
        setIsBackendDown(true);
      } finally {
        setChecking(false);
      }
    };

    if (envFlag) {
      setChecking(false);
    } else {
      checkApiHealth();
    }
  }, [pathname]);

  const isAdminRoute = pathname?.startsWith("/admin");
  const showMaintenance = (isMaintenanceMode || isBackendDown) && !isAdminRoute;

  // Show a neutral loader while verifying backend status to prevent rendering broken pages
  if (checking && !isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  if (showMaintenance) {
    return <MaintenancePage />;
  }

  return <>{children}</>;
}
