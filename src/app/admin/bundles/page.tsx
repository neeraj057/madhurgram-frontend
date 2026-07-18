"use client";
import React from "react";
import { AdminBundleManager } from "@/components/features/admin/AdminBundleManager";

export default function AdminBundlesPage() {
  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#D4AF37] tracking-wide">
          Bundle Manager
        </h1>
        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
          Configure Combo Offers & Storefront Footer
        </p>
      </div>

      <AdminBundleManager />
    </div>
  );
}
