"use client";
import React from "react";
import { ShoppingBag, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useAdminOrders } from "@/hooks/useAdminOrders"; // हुक इम्पोर्ट किया
import { AdminOrderList } from "@/components/features/admin/AdminOrderList"; // UI इम्पोर्ट किया

export default function AdminDashboard() {
  // हुक से स्टेट्स और फंक्शन्स निकाले
  const { orders, loading, updatingId, handleStatusChange, fetchOrders } = useAdminOrders();

  return (
    <main className="min-h-screen bg-[#111111] text-[#FDFBF7] p-8 md:p-16">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-6 mb-12">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="h-6 w-6 text-[#D4AF37]" />
            <h1 className="font-serif text-3xl font-bold tracking-wide">
              MadhurGram Admin Panel
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* 🔄 Sync Button */}
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-[#161616] border border-gray-800 rounded-lg text-xs font-bold text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-[#D4AF37]" : ""}`} />
              <span className="hidden sm:inline">Sync Orders</span>
            </button>

            <Link
              href="/"
              className="text-xs uppercase tracking-widest text-gray-400 hover:text-[#D4AF37] flex items-center space-x-1 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back To Store</span>
            </Link>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
            Live Order Dashboard
          </h2>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] text-green-500 font-mono font-bold uppercase tracking-tighter">Live Pipeline</span>
          </div>
        </div>

        {/* 🚀 UI रेंडर करने के लिए डेटा पास कर दिया */}
        <AdminOrderList
          orders={orders}
          loading={loading}
          updatingId={updatingId}
          onStatusChange={handleStatusChange}
        />
        
      </div>
    </main>
  );
}