"use client";

import React from "react";
import { Users, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useCustomerCRM } from "../../hooks/useCustomerCRM";
import { CustomerCRMList } from "../../../components/CustomerCRMList";

export default function AdminCustomersPage() {
  const { history, loading, customers, fetchHistory, fetchCustomers } = useCustomerCRM();

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
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Data Source</p>
              <p className="text-sm text-gray-300">Orders-backed customer stats from admin API.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-[#161616] p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-white mb-4">Customer Directory</h2>
            <div className="space-y-3">
              {customers.length === 0 ? (
                <p className="text-sm text-gray-500">No customers found yet. Search by phone to load history.</p>
              ) : (
                customers.map((customer: any) => (
                  <div key={customer.phoneNumber} className="group flex items-center justify-between gap-4 rounded-2xl border border-gray-800 bg-[#0f0f0f] p-4 transition hover:border-[#D4AF37]/50">
                    <div>
                      <p className="text-sm text-gray-400 uppercase tracking-[0.2em]">{customer.name}</p>
                      <p className="text-base font-medium text-white">{customer.phoneNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase text-gray-500">Orders</p>
                      <p className="text-lg font-semibold text-white">{customer.totalOrders}</p>
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
