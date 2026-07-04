"use client";

import React, { useState } from "react";
import { Users, ArrowLeft, RefreshCw, Search } from "lucide-react";
import Link from "next/link";
import { useCustomerCRM } from "../../hooks/useCustomerCRM";
import { CustomerCRMList } from "../../../components/CustomerCRMList";

export default function AdminCustomersPage() {
  const [customerSearch, setCustomerSearch] = useState("");
  const { history, loading, customers, fetchHistory, fetchCustomers, searchCustomers } = useCustomerCRM();

  return (
    <main className="min-h-screen bg-[#111111] text-[#FDFBF7] p-8 md:p-16">
      <div className="max-w-7xl mx-auto grid gap-10 lg:grid-cols-[1.3fr_0.9fr]">
        <section className="space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-800 pb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-6 w-6 text-[#D4AF37]" />
                <h1 className="text-3xl font-serif font-bold tracking-wide">Customers</h1>
              </div>
              <p className="text-sm text-gray-400">View customer order activity and lookup customer history by phone number.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin" className="text-xs uppercase tracking-widest text-gray-400 hover:text-[#D4AF37]">
                <ArrowLeft className="inline h-4 w-4 mr-1" /> Back To Dashboard
              </Link>
              <button
                onClick={fetchCustomers}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-800 bg-[#161616] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-300 hover:border-[#D4AF37]/60 hover:text-[#D4AF37] disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-gray-800 bg-[#161616] p-6 shadow-sm">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Total Customers</p>
              <p className="text-4xl font-bold text-white">{customers.length}</p>
            </div>
            <div className="rounded-3xl border border-gray-800 bg-[#161616] p-6 shadow-sm">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Top Customers</p>
              <p className="text-sm text-gray-300">VIP customers are highlighted in the list.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-[#161616] p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Customer Directory</h2>
                <p className="text-sm text-gray-400">Search customers by name or phone, then review purchase behavior and offer targets.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchCustomers(customerSearch)}
                    placeholder="Search name or phone"
                    className="min-w-[220px] rounded-lg border border-gray-800 bg-[#111111] px-10 py-3 text-sm text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <button
                  onClick={() => searchCustomers(customerSearch)}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-800 bg-[#111111] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-300 hover:text-[#D4AF37] disabled:opacity-50"
                >
                  Search
                </button>
                <button
                  onClick={() => {
                    setCustomerSearch("");
                    searchCustomers("");
                  }}
                  disabled={loading}
                  className="rounded-lg border border-gray-800 bg-[#111111] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-300 hover:text-[#D4AF37] disabled:opacity-50"
                >
                  Reset
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {customers.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-700 bg-[#111111] p-6 text-sm text-gray-400">
                  No customers loaded yet. Use the search box or refresh to fetch customer stats.
                </div>
              ) : (
                customers.map((customer: any) => (
                  <div key={customer.phoneNumber} className="group flex flex-col gap-3 rounded-2xl border border-gray-800 bg-[#0f0f0f] p-4 transition hover:border-[#D4AF37]/50 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <p className="text-sm text-gray-400 uppercase tracking-[0.2em]">{customer.name}</p>
                        {customer.vip && (
                          <span className="rounded-full bg-[#D4AF37]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                            VIP
                          </span>
                        )}
                        <span className="rounded-full bg-[#475569] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#CBD5E1]">
                          {customer.segment}
                        </span>
                      </div>
                      <p className="text-base font-medium text-white">{customer.phoneNumber}</p>
                      <p className="text-xs text-gray-500 mt-1">Last order: {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : "—"}</p>
                      <p className="text-xs text-gray-500 mt-1">Top item: {customer.favoriteProduct} ({customer.favoriteProductQuantity})</p>
                    </div>
                    <div className="grid gap-2 text-right sm:text-right">
                      <div>
                        <p className="text-xs uppercase text-gray-500">Orders</p>
                        <p className="text-lg font-semibold text-white">{customer.totalOrders}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-gray-500">Spent</p>
                        <p className="text-lg font-semibold text-white">₹{customer.totalSpent}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <CustomerCRMList history={history} loading={loading} onSearch={fetchHistory} />
        </section>
      </div>
    </main>
  );
}
