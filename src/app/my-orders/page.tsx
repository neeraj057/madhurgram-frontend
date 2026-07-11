"use client";
import React, { useState, useEffect } from "react";
import { ShoppingBag, ArrowLeft, Search, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";
import { fetchCustomerOrders, CustomerOrder } from "@/apis/customerOrders";
import { OrderCard } from "@/components/features/order/OrderCard"; 

export default function MyOrdersPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<CustomerOrder[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = async (phoneNumber: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCustomerOrders(phoneNumber);
      setOrders(data);
      sessionStorage.setItem("trackedPhone", phoneNumber);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders.");
      setOrders(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    performSearch(phone);
  };

  // Restore search state if previously tracked
  useEffect(() => {
    const savedPhone = sessionStorage.getItem("trackedPhone");
    if (savedPhone) {
      setPhone(savedPhone);
      performSearch(savedPhone);
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#111111] text-[#FDFBF7] p-6 md:p-16 font-sans">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between border-b border-gray-900 pb-6">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="h-6 w-6 text-[#D4AF37]" />
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-wide">Track My Orders</h1>
          </div>
          <Link
            href="/"
            className="text-xs uppercase tracking-widest text-gray-500 hover:text-[#D4AF37] flex items-center space-x-1 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Store</span>
          </Link>
        </div>

        {/* Search Panel Card */}
        <div className="bg-[#161616] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">Customer Verification</h2>
            <p className="text-xs text-gray-500">Enter the mobile number used during checkout to stream your live order status directly from the village grid.</p>
          </div>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mt-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-500 font-bold">+91</span>
              <input
                type="tel"
                maxLength={10}
                placeholder="Enter 10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-[#111111] border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-sm font-mono text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#D4AF37] text-[#111111] text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-[#B38F00] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span>{loading ? "Searching..." : "Track Shipment"}</span>
            </button>
          </form>

          {/* Validation Error Alert */}
          {error && (
            <div className="bg-red-500/5 border border-red-500/10 text-red-400 text-xs px-4 py-3 rounded-xl flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Dynamic Results Pipeline */}
        <div className="space-y-6">
          {loading && (
            <div className="space-y-4 animate-pulse">
              {[1, 2].map((n) => (
                <div key={n} className="h-40 bg-[#161616] border border-gray-800 rounded-2xl" />
              ))}
            </div>
          )}

          {!loading && orders !== null && orders.length === 0 && (
            <div className="text-center py-12 bg-[#161616]/40 border border-dashed border-gray-800 rounded-2xl">
              <p className="text-sm text-gray-500 font-light">No order history registered with this phone number in our system.</p>
            </div>
          )}

          {!loading && orders && orders.length > 0 && (
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold px-1">
                Active & Historical Manifests ({orders.length})
              </p>
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}