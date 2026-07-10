"use client";

import React, { useState } from "react";
import { CustomerHistory } from "@/hooks/useCustomerCRM";
import { User, Phone, ShoppingBag, CreditCard, Calendar, CheckCircle, Clock, XCircle, Search } from "lucide-react";

interface CustomerCRMListProps {
  history: CustomerHistory | null;
  loading: boolean;
  onSearch: (phone: string) => void;
}

export const CustomerCRMList: React.FC<CustomerCRMListProps> = ({ history, loading, onSearch }) => {
  const [phone, setPhone] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="h-3 w-3" /> Delivered
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 border border-amber-500/20">
            <Clock className="h-3 w-3" /> Pending
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-400 border border-rose-500/20">
            <XCircle className="h-3 w-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 border border-gray-500/20">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Card */}
      <div className="bg-[#121212] border border-gray-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
        
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#FDFBF7] mb-4 flex items-center gap-2">
          <Phone className="h-4 w-4 text-[#D4AF37]" /> Look up Order History
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Enter customer phone..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch(phone)}
              className="w-full bg-[#0a0a0a] border border-gray-800 focus:border-[#D4AF37] p-3.5 pl-11 rounded-xl text-sm text-white outline-none transition-colors font-mono"
            />
          </div>
          <button 
            onClick={() => onSearch(phone)}
            disabled={loading}
            className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] font-bold text-xs uppercase tracking-widest text-[#111111] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Searching..." : "Lookup"}
          </button>
        </div>
      </div>

      {/* History Result Card */}
      {history && (
        <div className="bg-[#121212] border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden animate-fade-in">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
          
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-gray-800/80 pb-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30 flex items-center justify-center font-serif text-xl font-bold text-[#D4AF37] uppercase">
                {history.name ? history.name.charAt(0) : <User className="h-6 w-6" />}
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold tracking-wide text-white">{history.name}</h3>
                <p className="text-xs text-[#D4AF37] font-mono mt-0.5 tracking-wider">{history.phoneNumber}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-[#0a0a0a] border border-gray-800/80 rounded-2xl px-5 py-3 text-center min-w-[100px]">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 flex items-center gap-1 justify-center mb-1">
                  <ShoppingBag className="h-3 w-3" /> Orders
                </p>
                <p className="text-xl font-bold text-white font-mono">{history.totalOrders}</p>
              </div>
              <div className="bg-[#0a0a0a] border border-gray-800/80 rounded-2xl px-5 py-3 text-center min-w-[120px]">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 flex items-center gap-1 justify-center mb-1">
                  <CreditCard className="h-3 w-3" /> Total Spent
                </p>
                <p className="text-xl font-bold text-[#D4AF37] font-mono">₹{history.totalSpent}</p>
              </div>
            </div>
          </div>

          {history.orderHistory && history.orderHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="text-[10px] uppercase tracking-wider text-gray-500 border-b border-gray-800 pb-3">
                  <tr>
                    <th className="pb-3 pl-2">Order ID</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-2">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {history.orderHistory.map((o) => (
                    <tr key={o.orderId} className="group hover:bg-[#0a0a0a]/50 transition-colors">
                      <td className="py-4 pl-2 font-mono text-xs text-white group-hover:text-[#D4AF37] transition-colors">#{o.orderId}</td>
                      <td className="py-4 text-xs font-light">
                        <span className="flex items-center gap-1.5 text-gray-300">
                          <Calendar className="h-3 w-3 text-gray-500" />
                          {new Date(o.orderDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="py-4">{getStatusBadge(o.status)}</td>
                      <td className="py-4 text-right pr-2 text-white font-mono font-bold">₹{o.totalAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-sm text-gray-500 font-light">
              No orders found for this customer record.
            </div>
          )}
        </div>
      )}
    </div>
  );
};