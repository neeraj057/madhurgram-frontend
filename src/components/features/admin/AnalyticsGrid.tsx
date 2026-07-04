import React from "react";
import { IndianRupee, Package, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { AdminAnalytics } from "@/hooks/useAdminAnalytics";

interface AnalyticsGridProps {
  metrics: AdminAnalytics | null;
  loading: boolean;
  error: string | null;
}

export const AnalyticsGrid: React.FC<AnalyticsGridProps> = ({ metrics, loading, error }) => {
  
  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-900/50 text-red-400 p-4 rounded-xl flex items-center space-x-3 text-sm">
        <AlertTriangle className="h-5 w-5" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* 1. Revenue Card */}
      <div className="bg-[#161616] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-[#D4AF37]/40 transition-all">
        <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
          <IndianRupee className="h-24 w-24 text-[#D4AF37]" />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#D4AF37]/10 rounded-lg border border-[#D4AF37]/20">
              <IndianRupee className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold">Today's Revenue</h3>
          </div>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-mono font-bold text-[#FDFBF7]">
              {loading ? "..." : `₹${metrics?.todayRevenue || 0}`}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Total Orders Card */}
      <div className="bg-[#161616] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/40 transition-all">
        <div className="absolute top-0 right-0 p-4 opacity-5 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
          <Package className="h-24 w-24 text-blue-500" />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Package className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold">Orders Today</h3>
          </div>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-mono font-bold text-[#FDFBF7]">
              {loading ? "..." : metrics?.todayOrderCount || 0}
            </span>
            <span className="text-xs text-blue-400 font-medium mb-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" /> Live
            </span>
          </div>
        </div>
      </div>

      {/* 3. Pending Actions Card */}
      <div className="bg-[#161616] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-amber-500/40 transition-all">
        <div className="absolute top-0 right-0 p-4 opacity-5 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
          <Clock className="h-24 w-24 text-amber-500" />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <Clock className="h-5 w-5 text-amber-400" />
            </div>
            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold">Pending Actions</h3>
          </div>
          <div>
            <span className="text-3xl font-mono font-bold text-[#FDFBF7]">
              {loading ? "..." : metrics?.pendingOrderCount || 0}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Inventory Alert Card */}
      <div className="bg-[#161616] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-red-500/40 transition-all">
        <div className="absolute top-0 right-0 p-4 opacity-5 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
          <AlertTriangle className="h-24 w-24 text-red-500" />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold">Low Stock Alert</h3>
          </div>
          <div>
            <span className={`text-3xl font-mono font-bold ${metrics?.lowStockProductCount && metrics.lowStockProductCount > 0 ? "text-red-400" : "text-[#FDFBF7]"}`}>
              {loading ? "..." : metrics?.lowStockProductCount || 0}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};