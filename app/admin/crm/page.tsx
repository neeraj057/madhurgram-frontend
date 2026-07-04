"use client";
import React from "react";
import { Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCustomerCRM } from "../../hooks/useCustomerCRM"; // तुम्हारा हुक
import { CustomerCRMList } from "../../../components/CustomerCRMList";

export default function CRMDashboard() {
  const { history, loading, fetchHistory } = useCustomerCRM();

  return (
    <main className="min-h-screen bg-[#111111] text-[#FDFBF7] p-8 md:p-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-6 mb-12">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-[#D4AF37]" />
            <h1 className="font-serif text-3xl font-bold tracking-wide">Customer Insights</h1>
          </div>
          <Link href="/admin" className="text-xs uppercase tracking-widest text-gray-400 hover:text-[#D4AF37] flex items-center space-x-1">
            <ArrowLeft className="h-4 w-4" /> <span>Back To Dashboard</span>
          </Link>
        </div>

        {/* CRM Search & Content */}
        <CustomerCRMList 
          history={history} 
          loading={loading} 
          onSearch={fetchHistory} 
        />
      </div>
    </main>
  );
}