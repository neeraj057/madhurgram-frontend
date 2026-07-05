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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      
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
            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold">Today&apos;s Revenue</h3>
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

      {/* 3. Conversion Rate Card (NEW) */}
      <div className="bg-[#161616] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
        <div className="absolute top-0 right-0 p-4 opacity-5 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
          <TrendingUp className="h-24 w-24 text-emerald-500" />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold">Conversion Rate</h3>
          </div>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-mono font-bold text-[#FDFBF7]">
              {loading ? "..." : `${(metrics?.conversionRate || 0).toFixed(1)}%`}
            </span>
            <span className="text-[10px] text-emerald-400 mb-1">Carts Recovery</span>
          </div>
        </div>
      </div>

      {/* 4. Pending Actions Card */}
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

      {/* 5. Inventory Alert Card */}
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

      {/* 📊 7-Day Revenue Graph Section */}
      <div className="col-span-full bg-[#161616] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6 mt-4">
        <div>
          <h3 className="text-lg font-serif font-bold text-[#D4AF37] tracking-wide">7-Day Revenue Trends</h3>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Daily earnings breakdown in INR</p>
        </div>
        
        {loading ? (
          <div className="h-64 flex items-center justify-center text-gray-500 text-xs font-mono uppercase tracking-widest animate-pulse">
            Processing Trend Data...
          </div>
        ) : !metrics?.revenueGraph || metrics.revenueGraph.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-500 text-xs">
            No sales recorded in the last 7 days.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Custom SVG Bar Chart */}
            <div className="relative w-full h-72">
              <svg className="w-full h-full" viewBox="0 0 600 240" preserveAspectRatio="none">
                <defs>
                  {/* Gold Gradient for the Bars */}
                  <linearGradient id="goldBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.1" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="40" y1="40" x2="580" y2="40" stroke="#222222" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="40" y1="100" x2="580" y2="100" stroke="#222222" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="40" y1="160" x2="580" y2="160" stroke="#222222" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="40" y1="200" x2="580" y2="200" stroke="#222222" strokeWidth="1" />

                {/* Bars */}
                {(() => {
                  const data = metrics.revenueGraph;
                  const maxVal = Math.max(...data.map(d => d.revenue), 1000); // minimum scale limit
                  const barWidth = 40;
                  const chartHeight = 160; // height inside viewbox
                  const startY = 200; // base y coordinate of chart

                  return data.map((d, index) => {
                    const percentage = d.revenue / maxVal;
                    const barHeight = Math.max(percentage * chartHeight, 4); // minimum 4px height
                    const x = 50 + index * 75;
                    const y = startY - barHeight;

                    return (
                      <g key={d.date} className="group cursor-pointer">
                        {/* Bounding hover overlay */}
                        <rect
                          x={x - 10}
                          y={30}
                          width={barWidth + 20}
                          height={chartHeight + 15}
                          fill="transparent"
                          className="group-hover:fill-white/5 rounded transition-all duration-200"
                        />
                        {/* Actual Rounded Bar */}
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={barHeight}
                          rx="4"
                          fill="url(#goldBarGrad)"
                          className="group-hover:fill-[#FDFBF7] transition-all duration-300"
                        />
                        {/* Dynamic Tooltip Value */}
                        <text
                          x={x + barWidth / 2}
                          y={y - 8}
                          textAnchor="middle"
                          fill="#D4AF37"
                          className="text-[9px] font-bold font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          ₹{d.revenue.toLocaleString()}
                        </text>
                      </g>
                    );
                  });
                })()}
              </svg>
            </div>

            {/* X-Axis Date Labels */}
            <div className="grid grid-cols-7 text-center pt-4 border-t border-gray-800/60 gap-2">
              {metrics.revenueGraph.map((d) => {
                const labelDate = new Date(d.date);
                const formattedLabel = labelDate.toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                });
                return (
                  <div key={d.date} className="space-y-1">
                    <p className="text-[10px] font-bold font-mono text-gray-400">{formattedLabel}</p>
                    <p className="text-[9px] font-mono text-[#D4AF37] font-semibold">₹{d.revenue.toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};