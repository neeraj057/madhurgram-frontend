"use client";
import React, { useState } from "react";
import { CustomerHistory } from "@/hooks/useCustomerCRM";

interface CustomerCRMListProps {
  history: CustomerHistory | null;
  loading: boolean;
  onSearch: (phone: string) => void;
}

export const CustomerCRMList: React.FC<CustomerCRMListProps> = ({ history, loading, onSearch }) => {
  const [phone, setPhone] = useState("");

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <div className="bg-[#161616] p-6 rounded-xl border border-gray-800 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search by Phone Number..."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="flex-1 bg-black border border-gray-800 p-3 rounded-lg text-white outline-none focus:border-[#D4AF37]"
        />
        <button 
          onClick={() => onSearch(phone)}
          disabled={loading}
          className="bg-[#D4AF37] px-8 py-3 rounded-lg font-bold text-[#111111] hover:bg-[#FDFBF7] transition-all disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Result Section */}
      {history && (
        <div className="bg-[#161616] border border-gray-800 rounded-xl p-8 animate-in fade-in">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white">{history.name}</h3>
              <p className="text-[#D4AF37] font-mono">{history.phoneNumber}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mt-2">{history.totalOrders} orders • ₹{history.totalSpent} spent</p>
            </div>
            <div className="rounded-3xl bg-[#0f0f0f] px-4 py-3 text-right text-sm text-gray-300">
              <p className="uppercase tracking-[0.2em] text-gray-500">Total Orders</p>
              <p className="text-3xl font-semibold text-white">{history.totalOrders}</p>
            </div>
          </div>

          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-[10px] uppercase text-gray-500 border-b border-gray-800">
              <tr>
                <th className="pb-4">Order ID</th>
                <th className="pb-4">Date</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {history.orderHistory.map((o) => (
                <tr key={o.orderId} className="hover:bg-gray-900/50">
                  <td className="py-4 font-mono">#{o.orderId}</td>
                  <td className="py-4">{new Date(o.orderDate).toLocaleDateString()}</td>
                  <td className="py-4">{o.status}</td>
                  <td className="py-4 text-right text-white font-mono">₹{o.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};