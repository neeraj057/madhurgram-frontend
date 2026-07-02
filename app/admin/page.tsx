"use client";
import React from "react";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAdminOrders } from "../hooks/useAdminOrders"; // हुक इम्पोर्ट किया
import { AdminOrderList } from "../../components/AdminOrderList"; // UI इम्पोर्ट किया

export default function AdminDashboard() {
  // हुक से स्टेट्स और फंक्शन्स निकाले
  const { orders, loading, updatingId, handleStatusChange } = useAdminOrders();

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
          <Link
            href="/"
            className="text-xs uppercase tracking-widest text-gray-400 hover:text-[#D4AF37] flex items-center space-x-1 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back To Store</span>
          </Link>
        </div>

        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-6">
          Live Order Dashboard
        </h2>

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