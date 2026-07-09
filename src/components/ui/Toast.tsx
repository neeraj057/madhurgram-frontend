"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

// Global dispatcher function
export const showToast = (message: string, type: ToastType = "info") => {
  if (typeof window !== "undefined") {
    const event = new CustomEvent("app-toast", { detail: { message, type } });
    window.dispatchEvent(event);
  }
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string; type: ToastType }>;
      const { message, type } = customEvent.detail;
      const id = Math.random().toString(36).substring(2, 9);

      setToasts((prev) => [...prev, { id, message, type }]);

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };

    window.addEventListener("app-toast", handleToast);
    return () => window.removeEventListener("app-toast", handleToast);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-[calc(100vw-2rem)] pointer-events-none max-sm:left-1/2 max-sm:right-auto max-sm:-translate-x-1/2 max-sm:items-center">
      {toasts.map((toast) => {
        let Icon = Info;
        let iconColor = "text-[#D4AF37]"; // Gold brand
        let borderColor = "border-[#D4AF37]/35";
        let glowColor = "shadow-[#D4AF37]/10";

        if (toast.type === "success") {
          Icon = CheckCircle;
          iconColor = "text-emerald-400";
          borderColor = "border-emerald-500/30";
          glowColor = "shadow-emerald-500/5";
        } else if (toast.type === "error") {
          Icon = AlertTriangle;
          iconColor = "text-rose-500";
          borderColor = "border-rose-500/30";
          glowColor = "shadow-rose-500/5";
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border bg-[#111111]/95 backdrop-blur-md text-white shadow-2xl transition-all duration-300 animate-toast-desktop max-sm:animate-toast-mobile ${borderColor} ${glowColor}`}
          >
            <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 text-sm font-semibold tracking-wide text-gray-100">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white transition-colors flex-shrink-0 mt-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
