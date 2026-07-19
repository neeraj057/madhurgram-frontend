"use client";

import React, { useState } from "react";
import { Users, ArrowLeft, RefreshCw, Search, Award, Sparkles, ShoppingBag, CreditCard, UserCheck, Star } from "lucide-react";
import Link from "next/link";
import { useCustomerCRM, CustomerStats } from "@/hooks/useCustomerCRM";
import { CustomerCRMList } from "@/components/features/admin/CustomerCRMList";

export default function AdminCustomersPage() {
  const [customerSearch, setCustomerSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "VIP" | "LOYAL" | "OCCASIONAL">("ALL");
  const { history, loading, customers, page, totalPages, totalElements, setPage, fetchHistory, fetchCustomers, searchCustomers } = useCustomerCRM();

  // Helper count methods for stats counters
  const totalCustomersCount = totalElements;
  const vipCount = customers.filter(c => c.vip).length;
  const loyalCount = customers.filter(c => c.segment?.toUpperCase() === "LOYAL").length;

  // Filter customers list by active tab
  const filteredCustomers = customers.filter((customer) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "VIP") return customer.vip;
    return customer.segment?.toUpperCase() === activeTab;
  });

  const getSegmentStyles = (segment: string) => {
    switch (segment.toUpperCase()) {
      case "LOYAL":
        return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20";
      case "OCCASIONAL":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "NEW":
        return "bg-teal-500/10 text-teal-400 border border-teal-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-[#FDFBF7] p-6 md:p-12 font-sans relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-15%] w-[400px] h-[400px] bg-[#D4AF37]/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* Header / Navigation Row */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-gray-800/80 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-9 w-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                <Users className="h-5 w-5" />
              </div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-wide">Customer Directory</h1>
            </div>
            <p className="text-xs md:text-sm text-gray-400 font-light">🌾 Gopiganj Purity Ecosystem • Track village heritage ghee consumers and order logs.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/admin" 
              className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#D4AF37] border border-gray-800 hover:border-[#D4AF37]/30 bg-[#121212] px-4 py-2.5 rounded-xl transition-all"
            >
              <ArrowLeft className="inline h-3.5 w-3.5 mr-1" /> Dashboard
            </Link>
            <button
              onClick={() => fetchCustomers(page)}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-800 bg-[#121212] hover:border-[#D4AF37]/50 hover:text-[#D4AF37] px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-300 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Top Analytics Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Card 1 */}
          <div className="rounded-3xl border border-gray-800 bg-[#121212]/80 p-6 relative overflow-hidden shadow-xl">
            <div className="absolute top-4 right-4 text-[#D4AF37]/20">
              <Users className="h-8 w-8" />
            </div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2">Total Customers</p>
            <p className="text-3xl font-bold text-white font-mono">{totalCustomersCount}</p>
            <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1 font-light">
              <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" /> Active buyer logs in database
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl border border-gray-800 bg-[#121212]/80 p-6 relative overflow-hidden shadow-xl">
            <div className="absolute top-4 right-4 text-[#D4AF37]/20">
              <Star className="h-8 w-8" />
            </div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2">VIP Customers</p>
            <p className="text-3xl font-bold text-white font-mono">{vipCount}</p>
            <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1 font-light">
              <Award className="h-3.5 w-3.5 text-[#D4AF37]" /> Customers with high order density
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-3xl border border-gray-800 bg-[#121212]/80 p-6 relative overflow-hidden shadow-xl">
            <div className="absolute top-4 right-4 text-[#D4AF37]/20">
              <UserCheck className="h-8 w-8" />
            </div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2">Loyal Segment</p>
            <p className="text-3xl font-bold text-white font-mono">{loyalCount}</p>
            <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1 font-light">
              <ShoppingBag className="h-3.5 w-3.5 text-[#D4AF37]" /> Retained traditional oil/ghee fans
            </p>
          </div>
        </div>

        {/* Main Work Area Grid */}
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
          
          {/* Left Column: Customer Directory */}
          <section className="space-y-6">
            <div className="bg-[#121212]/75 border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl">
              
              {/* Directory Filter & Search Header */}
              <div className="flex flex-col gap-5 border-b border-gray-800/60 pb-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-serif font-bold text-white">Client Roster</h2>
                    <p className="text-xs text-gray-400 font-light mt-0.5">Filter by transaction types and segments.</p>
                  </div>
                  
                  {/* Search Bar */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 sm:flex-initial">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && searchCustomers(customerSearch)}
                        placeholder="Search name or phone..."
                        className="w-full sm:w-[200px] rounded-xl border border-gray-800 bg-[#0a0a0a] px-9 py-2.5 text-xs text-white outline-none focus:border-[#D4AF37] transition-colors"
                      />
                    </div>
                    <button
                      onClick={() => searchCustomers(customerSearch)}
                      disabled={loading}
                      className="rounded-xl border border-gray-800 bg-[#0a0a0a] hover:border-[#D4AF37]/50 hover:text-[#D4AF37] px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-300 transition-all disabled:opacity-50"
                    >
                      Go
                    </button>
                    <button
                      onClick={() => {
                        setCustomerSearch("");
                        searchCustomers("");
                      }}
                      disabled={loading}
                      className="rounded-xl border border-gray-800 bg-[#0a0a0a] hover:border-[#D4AF37]/50 hover:text-gray-300 px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-500 transition-all disabled:opacity-50"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Segment Selection Tabs */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {(["ALL", "VIP", "LOYAL", "OCCASIONAL"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                        activeTab === tab
                          ? "bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#111111] border-transparent"
                          : "bg-[#0a0a0a] border-gray-800/80 text-gray-400 hover:text-white hover:border-gray-700"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customers List Box */}
              <div className="space-y-4">
                {filteredCustomers.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-800 bg-[#0a0a0a]/50 p-10 text-center text-xs text-gray-500 font-light">
                    No customers match the criteria. Try changing filters or refresh stats.
                  </div>
                ) : (
                  filteredCustomers.map((customer: CustomerStats, index: number) => (
                    <div 
                      key={`${customer.name}-${customer.phoneNumber}-${index}`} 
                      className="group flex flex-col gap-4 rounded-2xl border border-gray-800/60 hover:border-[#D4AF37]/40 bg-[#0e0e0e] p-5 transition-all duration-300 shadow-sm hover:shadow-[#D4AF37]/3 sm:flex-row sm:items-center sm:justify-between relative overflow-hidden"
                    >
                      <div className="flex items-start gap-4">
                        {/* Custom Initial Avatar */}
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#D4AF37]/15 to-[#D4AF37]/2 border border-[#D4AF37]/20 flex items-center justify-center font-serif text-lg font-bold text-[#D4AF37] uppercase select-none">
                          {customer.name ? customer.name.charAt(0) : "U"}
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-bold tracking-wide text-white uppercase font-sans">{customer.name || "Unknown Custodian"}</p>
                            {customer.vip && (
                              <span className="rounded-full bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#D4AF37] border border-[#D4AF37]/20 flex items-center gap-0.5">
                                <Award className="h-2.5 w-2.5" /> VIP
                              </span>
                            )}
                            {customer.segment && (
                              <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getSegmentStyles(customer.segment)}`}>
                                {customer.segment}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-xs text-gray-400 font-mono tracking-wider">{customer.phoneNumber}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 text-[10px] text-gray-500 font-light pt-1">
                            <span>Last Order: <strong className="text-gray-400 font-normal">{customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : "—"}</strong></span>
                            <span className="hidden sm:inline text-gray-700">•</span>
                            <span>Favorite: <strong className="text-gray-400 font-normal">{customer.favoriteProduct || "—"} ({customer.favoriteProductQuantity})</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Right side stats */}
                      <div className="flex gap-4 sm:gap-6 border-t border-gray-800/40 pt-4 sm:border-t-0 sm:pt-0 justify-end">
                        <div className="text-right">
                          <p className="text-[9px] uppercase tracking-wider text-gray-500 mb-0.5 flex items-center gap-0.5 justify-end">
                            <ShoppingBag className="h-3 w-3" /> Orders
                          </p>
                          <p className="text-base font-bold text-white font-mono">{customer.totalOrders}</p>
                        </div>
                        <div className="text-right border-l border-gray-800 pl-4 sm:pl-6">
                          <p className="text-[9px] uppercase tracking-wider text-gray-500 mb-0.5 flex items-center gap-0.5 justify-end">
                            <CreditCard className="h-3 w-3" /> Spent
                          </p>
                          <p className="text-base font-bold text-[#D4AF37] font-mono">₹{customer.totalSpent}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination Controls */}
              {!loading && totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-800/60 pt-6 mt-8">
                  <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="px-4 py-2 border border-gray-800 bg-[#0a0a0a] rounded-xl text-xs font-bold text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-mono text-gray-400">
                    Page <span className="text-[#D4AF37] font-bold">{page + 1}</span> of <span className="text-white font-bold">{totalPages}</span>
                  </span>
                  <button
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page === totalPages - 1}
                    className="px-4 py-2 border border-gray-800 bg-[#0a0a0a] rounded-xl text-xs font-bold text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Customer CRM Detail & History Lookup */}
          <section className="space-y-8">
            <CustomerCRMList history={history} loading={loading} onSearch={fetchHistory} />
          </section>

        </div>
      </div>
    </main>
  );
}
