"use client";
import React from "react";
import { AdminProductManager } from "@/components/features/admin/AdminProductManager";

export default function AdminProductsPage() {
  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#D4AF37] tracking-wide">
          Inventory Control
        </h1>
        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
          Manage Store Catalog & Stock Levels
        </p>
      </div>

      {/* 🚀 UI Component */}
      <AdminProductManager />
    </div>
  );
}