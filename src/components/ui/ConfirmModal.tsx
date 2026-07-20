"use client";
import React, { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Reusable styled confirmation modal.
 * Replaces the browser's native window.confirm() with a premium in-app dialog.
 */
export function ConfirmModal({
  isOpen,
  title = "Confirm Action",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: "text-red-500",
      iconBg: "bg-red-950/40 border border-red-900/40",
      confirmBtn:
        "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/30",
    },
    warning: {
      icon: "text-amber-400",
      iconBg: "bg-amber-950/40 border border-amber-900/40",
      confirmBtn:
        "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/30",
    },
    info: {
      icon: "text-blue-400",
      iconBg: "bg-blue-950/40 border border-blue-900/40",
      confirmBtn:
        "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30",
    },
  };

  const styles = variantStyles[variant];

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal card */}
      <div
        className="relative z-10 w-full max-w-sm rounded-2xl border border-gray-800 bg-[#141414] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${styles.iconBg}`}>
          <AlertTriangle className={`h-6 w-6 ${styles.icon}`} />
        </div>

        {/* Title */}
        <h3 className="mb-2 text-center font-serif text-lg font-bold text-[#FDFBF7]">
          {title}
        </h3>

        {/* Message */}
        <p className="mb-6 text-center text-sm text-gray-400 leading-relaxed">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-gray-700 bg-transparent px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-400 transition-all hover:border-gray-500 hover:text-white active:scale-95"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all active:scale-95 ${styles.confirmBtn}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
