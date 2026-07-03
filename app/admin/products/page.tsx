"use client";
import React from "react";
import { useAdminProducts } from "../../hooks/useAdminProducts";
import { AdminProductManager } from "../../../components/AdminProductManager";

export default function AdminProductsPage() {
  const { products, loading, isSubmitting, saveProduct } = useAdminProducts();

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

      {/* 🚀 UI Component को स्टेट्स पास कर दिए */}
      <AdminProductManager 
        products={products} 
        loading={loading} 
        isSubmitting={isSubmitting}
        onSave={saveProduct} 
      />
    </div>
  );
}