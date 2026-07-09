import React from "react";
import { IndianRupee, Package, Clock, AlertTriangle, TrendingUp, TrendingDown, Users } from "lucide-react";
import { AdminAnalytics } from "@/hooks/useAdminAnalytics";

interface AnalyticsGridProps {
  metrics: AdminAnalytics | null;
  loading: boolean;
  error: string | null;
  days: number;
  setDays: (days: number) => void;
}

export const AnalyticsGrid: React.FC<AnalyticsGridProps> = ({ metrics, loading, error, days, setDays }) => {
  
  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-900/50 text-red-400 p-4 rounded-xl flex items-center space-x-3 text-sm">
        <AlertTriangle className="h-5 w-5" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      
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
          <div className="flex flex-col space-y-1">
            <span className="text-3xl font-mono font-bold text-[#FDFBF7]">
              {loading ? "..." : `₹${metrics?.todayRevenue || 0}`}
            </span>
            {!loading && metrics?.salesGrowthPercent !== undefined && (
              <span className={`text-[10px] font-semibold flex items-center ${metrics.salesGrowthPercent >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {metrics.salesGrowthPercent >= 0 ? (
                  <>
                    <TrendingUp className="h-3.5 w-3.5 mr-1" />
                    <span>+{metrics.salesGrowthPercent.toFixed(1)}% vs prev period</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3.5 w-3.5 mr-1" />
                    <span>{metrics.salesGrowthPercent.toFixed(1)}% vs prev period</span>
                  </>
                )}
              </span>
            )}
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

      {/* 3. Conversion Rate Card */}
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

      {/* 4. Live Active Users Card (NEW) */}
      <div className="bg-[#161616] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all">
        <div className="absolute top-0 right-0 p-4 opacity-5 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
          <Users className="h-24 w-24 text-[#D4AF37]" />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#D4AF37]/10 rounded-lg border border-[#D4AF37]/20">
              <Users className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold">Live Users</h3>
          </div>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-mono font-bold text-[#FDFBF7]">
              {loading ? "..." : metrics?.activeUserCount || 1}
            </span>
            <span className="text-[10px] text-emerald-400 font-bold mb-1 flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Active</span>
            </span>
          </div>
        </div>
      </div>

      {/* 5. Pending Actions Card */}
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

      {/* 6. Inventory Alert Card */}
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

      {/* 📊 Revenue Graph Section */}
      <div className="col-span-full bg-[#161616] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6 mt-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-serif font-bold text-[#D4AF37] tracking-wide">{days}-Day Revenue Trends</h3>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Daily earnings breakdown in INR</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 uppercase font-bold">Range:</span>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="bg-[#111111] border border-gray-800 text-xs font-bold text-gray-300 rounded-lg px-3 py-1.5 focus:border-[#D4AF37] outline-none transition-colors cursor-pointer"
            >
              <option value={7}>7 Days</option>
              <option value={15}>15 Days</option>
              <option value={30}>30 Days</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="h-64 flex items-center justify-center text-gray-500 text-xs font-mono uppercase tracking-widest animate-pulse">
            Processing Trend Data...
          </div>
        ) : !metrics?.revenueGraph || metrics.revenueGraph.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-500 text-xs">
            No sales recorded in the last {days} days.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Custom SVG Bar Chart */}
            <div className="relative w-full h-72">
              <svg className="w-full h-full" viewBox="0 0 600 240" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="goldBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.1" />
                  </linearGradient>
                </defs>

                {/* Bars */}
                {(() => {
                  const data = metrics.revenueGraph;
                  const maxVal = Math.max(...data.map(d => d.revenue), 1000);
                  const totalWidth = 530;
                  const step = totalWidth / Math.max(data.length, 1);
                  const barWidth = Math.max(Math.floor(step * 0.55), 4);
                  const chartHeight = 160; 
                  const startY = 200;

                  return data.map((d, index) => {
                    const percentage = d.revenue / maxVal;
                    const barHeight = Math.max(percentage * chartHeight, 4);
                    const x = 45 + index * step;
                    const y = startY - barHeight;

                    return (
                      <g key={d.date} className="group cursor-pointer">
                        <rect
                          x={x - (step - barWidth) / 2}
                          y={30}
                          width={step}
                          height={chartHeight + 15}
                          fill="transparent"
                          className="group-hover:fill-white/5 rounded transition-all duration-200"
                        />
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={barHeight}
                          rx={days > 15 ? "1" : "3"}
                          fill="url(#goldBarGrad)"
                          className="group-hover:fill-[#FDFBF7] transition-all duration-300"
                        />
                        <text
                          x={x + barWidth / 2}
                          y={y - 8}
                          textAnchor="middle"
                          fill="#D4AF37"
                          className="text-[8px] font-bold font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-200"
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
            <div 
              className="grid pt-4 border-t border-gray-800/60 gap-2 text-center"
              style={{
                gridTemplateColumns: `repeat(${metrics.revenueGraph.length}, minmax(0, 1fr))`
              }}
            >
              {metrics.revenueGraph.map((d, index) => {
                const shouldShow = days <= 7 || 
                                   (days === 15 && index % 2 === 0) || 
                                   (days === 30 && index % 5 === 0);
                
                const labelDate = new Date(d.date);
                const formattedLabel = labelDate.toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                });
                
                return (
                  <div key={d.date} className={`space-y-1 ${shouldShow ? "opacity-100" : "opacity-0 select-none pointer-events-none"}`}>
                    <p className="text-[10px] font-bold font-mono text-gray-400">{formattedLabel}</p>
                    {days <= 15 && (
                      <p className="text-[9px] font-mono text-[#D4AF37] font-semibold">₹{d.revenue.toLocaleString()}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 🛑 Critical Inventory List */}
      {!loading && metrics?.lowStockProducts && metrics.lowStockProducts.length > 0 && (
        <div className="col-span-full bg-[#161616] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-4 mt-6">
          <div className="flex items-center space-x-3 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="text-base font-serif font-bold tracking-wide">Critical Inventory Alert (Low Stock)</h3>
          </div>
          <p className="text-xs text-gray-500">The following catalog items are running low and need restocking (<span className="text-red-400 font-mono font-bold">5 left or less</span>):</p>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs font-mono text-gray-400 divide-y divide-gray-800">
              <thead>
                <tr className="text-gray-500 uppercase tracking-wider text-[9px] font-bold border-b border-gray-800">
                  <th className="py-3 px-4">Product ID</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Unit Price</th>
                  <th className="py-3 px-4">Stock Remaining</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/30">
                {metrics.lowStockProducts.map(prod => (
                  <tr key={prod.id} className="hover:bg-red-500/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-400">#{prod.id}</td>
                    <td className="py-3.5 px-4 text-white font-medium text-sm">{prod.name}</td>
                    <td className="py-3.5 px-4 text-gray-300">₹{prod.price}</td>
                    <td className="py-3.5 px-4 font-bold text-red-400">{prod.stock} left</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="bg-red-500/10 text-red-400 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-red-500/20">
                        Critical
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};