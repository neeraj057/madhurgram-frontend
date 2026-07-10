import React, { useState } from "react";
import {
  Calendar,
  User,
  MapPin,
  RefreshCw,
  FileText,
  CheckCircle,
  Truck,
  PackageCheck,
  XCircle,
  Search,
  ExternalLink,
  ClipboardList,
  AlertCircle
} from "lucide-react";
import { Order } from "@/hooks/useAdminOrders";
import { downloadInvoicePDF, getFormattedOrderNumber } from "@/utils/invoiceGenerator";

interface AdminOrderListProps {
  orders: Order[];
  loading: boolean;
  updatingId: number | null;
  onStatusChange: (orderId: number, newStatus: string) => void;
}

export const AdminOrderList: React.FC<AdminOrderListProps> = ({
  orders,
  loading,
  updatingId,
  onStatusChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "pending" | "today" | "yesterday" | "completed" | "all">("active");

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <RefreshCw className="h-8 w-8 text-[#D4AF37] animate-spin" />
        <p className="text-gray-500 animate-pulse font-mono text-sm uppercase tracking-widest">Loading Live Pipeline...</p>
      </div>
    );
  }

  // --- STATS CALCULATIONS ---
  const todayStr = new Date().toDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  const totalCount = orders.length;
  const todayCount = orders.filter(o => new Date(o.orderDate).toDateString() === todayStr).length;
  const yesterdayCount = orders.filter(o => new Date(o.orderDate).toDateString() === yesterdayStr).length;
  const pendingCount = orders.filter(o => o.orderStatus === "PENDING").length;
  const processingCount = orders.filter(o => ["CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY"].includes(o.orderStatus)).length;
  const completedCount = orders.filter(o => o.orderStatus === "DELIVERED").length;

  // --- SEARCH & TABS FILTERING ---
  const filteredOrders = orders.filter(order => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      order.id.toString().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.phoneNumber.includes(query) ||
      order.address.toLowerCase().includes(query) ||
      order.pincode.includes(query) ||
      order.cityState.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    const orderDateStr = new Date(order.orderDate).toDateString();

    switch (activeTab) {
      case "active":
        return ["PENDING", "CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY"].includes(order.orderStatus);
      case "pending":
        return order.orderStatus === "PENDING";
      case "today":
        return orderDateStr === todayStr;
      case "yesterday":
        return orderDateStr === yesterdayStr;
      case "completed":
        return ["DELIVERED", "CANCELLED"].includes(order.orderStatus);
      case "all":
      default:
        return true;
    }
  });

  const getOrderStatusTimelineIndex = (status: string) => {
    const sequence = ["PENDING", "CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];
    return sequence.indexOf(status);
  };

  const nextStatusMap: { [key: string]: string } = {
    PENDING: "CONFIRMED",
    CONFIRMED: "SHIPPED",
    SHIPPED: "OUT_FOR_DELIVERY",
    OUT_FOR_DELIVERY: "DELIVERED",
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "text-amber-400 border-amber-500/20 bg-amber-500/10";
      case "CONFIRMED": return "text-blue-400 border-blue-500/20 bg-blue-500/10";
      case "SHIPPED": return "text-indigo-400 border-indigo-500/20 bg-indigo-500/10";
      case "OUT_FOR_DELIVERY": return "text-purple-400 border-purple-500/20 bg-purple-500/10";
      case "DELIVERED": return "text-green-400 border-green-500/20 bg-green-500/10";
      default: return "text-red-400 border-red-500/20 bg-red-500/10";
    }
  };

  return (
    <div className="space-y-8">
      {/* 📊 Executive Pipeline Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Active Orders", count: pendingCount + processingCount, color: "text-[#D4AF37] border-gray-800" },
          { label: "Pending Actions", count: pendingCount, color: "text-amber-400 border-amber-500/10" },
          { label: "Today's Orders", count: todayCount, color: "text-emerald-400 border-emerald-500/10" },
          { label: "Yesterday's", count: yesterdayCount, color: "text-gray-400 border-gray-800" },
          { label: "Completed Today", count: completedCount, color: "text-green-400 border-green-500/10" },
          { label: "Total Orders", count: totalCount, color: "text-white border-gray-800" }
        ].map((stat, idx) => (
          <div key={idx} className={`bg-[#161616] border ${stat.color} rounded-2xl p-4 flex flex-col justify-between hover:scale-[1.02] transition-all`}>
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{stat.label}</span>
            <span className="text-2xl font-mono font-bold mt-2">{stat.count}</span>
          </div>
        ))}
      </div>

      {/* 🔍 Search & Filters Bar */}
      <div className="bg-[#161616] border border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by ID, customer name, phone, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#FDFBF7] placeholder-gray-600 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 outline-none transition-all"
          />
        </div>

        {/* 📑 Tab Selectors */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: "active", label: "Active Pipeline" },
            { id: "pending", label: "Pending Only" },
            { id: "today", label: "Today" },
            { id: "yesterday", label: "Yesterday" },
            { id: "completed", label: "Delivered & Cancelled" },
            { id: "all", label: "All Logs" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/10"
                  : "bg-black hover:bg-gray-900 border border-gray-800/80 text-gray-400 hover:text-[#FDFBF7]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 📦 Live Orders List Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-[#161616] border border-gray-800 rounded-3xl p-16 text-center space-y-4">
          <ClipboardList className="h-12 w-12 text-gray-600 mx-auto" />
          <h3 className="text-base font-serif font-bold text-gray-400">No matching orders found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">Try clearing search parameters or checking other pipeline categories.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const statusIdx = getOrderStatusTimelineIndex(order.orderStatus);
            const isFinished = order.orderStatus === "DELIVERED" || order.orderStatus === "CANCELLED";

            return (
              <div
                key={order.id}
                className="bg-[#161616] border border-gray-800 rounded-3xl p-6 shadow-2xl flex flex-col lg:flex-row justify-between gap-6 transition-all hover:border-gray-700/80 relative overflow-hidden"
              >
                {/* Visual Status Colored Top Accent */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                  order.orderStatus === "DELIVERED" ? "bg-green-500" :
                  order.orderStatus === "CANCELLED" ? "bg-red-500" : "bg-[#D4AF37]"
                }`} />

                {/* Left Section: Billing Details & Action Trigger */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-mono font-bold px-3 py-1 rounded-full border border-[#D4AF37]/20">
                      ORDER ID: {getFormattedOrderNumber(order as any)}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-md border ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>

                    {/* Coordinates Maps Pin Shortcut */}
                    {order.latitude && order.longitude && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${order.latitude},${order.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1 transition-all"
                      >
                        <MapPin className="h-3 w-3" />
                        <span>Map Coordinates</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>

                  {/* 🟢 Interactive Progress Stepper (Timeline) */}
                  {!isFinished && (
                    <div className="hidden sm:flex items-center space-x-1 py-2 max-w-xl">
                      {["Pending", "Confirmed", "Shipped", "Out for Delivery", "Delivered"].map((step, idx) => (
                        <React.Fragment key={step}>
                          <div className="flex items-center space-x-1.5">
                            <div className={`h-2.5 w-2.5 rounded-full ${
                              statusIdx >= idx ? "bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" : "bg-gray-800"
                            }`} />
                            <span className={`text-[8px] font-bold uppercase tracking-wider font-mono ${
                              statusIdx >= idx ? "text-gray-300" : "text-gray-600"
                            }`}>
                              {step}
                            </span>
                          </div>
                          {idx < 4 && (
                            <div className={`flex-1 h-[2px] min-w-4 ${
                              statusIdx > idx ? "bg-[#D4AF37]" : "bg-gray-800"
                            }`} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}

                  {/* Customer Information Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mt-4 text-xs text-gray-300 font-light">
                    <p className="flex items-center space-x-2">
                      <User className="h-3.5 w-3.5 text-[#D4AF37] shrink-0" />
                      <span className="font-semibold text-[#FDFBF7]">{order.customerName}</span>
                      <span className="text-gray-500">({order.phoneNumber})</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <Calendar className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                      <span className="font-mono text-gray-400 text-[10px]">
                        {new Date(order.orderDate).toLocaleString("en-IN")}
                      </span>
                    </p>
                    <p className="col-span-full flex items-start space-x-2">
                      <MapPin className="h-3.5 w-3.5 text-gray-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">
                        {order.address}, {order.cityState} - <span className="font-bold text-gray-400">{order.pincode}</span>
                      </span>
                    </p>
                  </div>

                  {/* Action Handler Trigger Pane */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {!isFinished ? (
                      <>
                        <button
                          disabled={updatingId === order.id}
                          onClick={() => onStatusChange(order.id, nextStatusMap[order.orderStatus])}
                          className="px-4 py-2.5 bg-[#D4AF37] text-black font-mono text-[9px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#B38F00] transition-all flex items-center space-x-2 disabled:opacity-50 active:scale-95 shadow-md shadow-[#D4AF37]/5"
                        >
                          {updatingId === order.id ? (
                            <RefreshCw className="h-3.5 w-3.5 animate-spin text-black" />
                          ) : (
                            <>
                              {order.orderStatus === "PENDING" && <CheckCircle className="h-3.5 w-3.5 text-black" />}
                              {["CONFIRMED", "SHIPPED"].includes(order.orderStatus) && <Truck className="h-3.5 w-3.5 text-black" />}
                              {order.orderStatus === "OUT_FOR_DELIVERY" && <PackageCheck className="h-3.5 w-3.5 text-black" />}
                            </>
                          )}
                          <span>
                            {order.orderStatus === "PENDING" && "Confirm Order"}
                            {order.orderStatus === "CONFIRMED" && "Dispatch Package"}
                            {order.orderStatus === "SHIPPED" && "Out for Delivery"}
                            {order.orderStatus === "OUT_FOR_DELIVERY" && "Mark Delivered"}
                          </span>
                        </button>

                        {(order.orderStatus === "PENDING" || order.orderStatus === "CONFIRMED") && (
                          <button
                            disabled={updatingId === order.id}
                            onClick={() => {
                              if (confirm("Are you sure you want to CANCEL this order?")) {
                                onStatusChange(order.id, "CANCELLED");
                              }
                            }}
                            className="px-3.5 py-2.5 bg-transparent border border-red-900/40 text-red-500 font-mono text-[9px] font-bold uppercase tracking-widest rounded-xl hover:bg-red-950/20 hover:border-red-600 transition-all disabled:opacity-50 active:scale-95"
                          >
                            Cancel Order
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-mono font-bold text-gray-500">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>Logistics Pipeline Locked</span>
                      </span>
                    )}

                    {/* Invoice Download Button */}
                    <button
                      disabled={order.orderStatus === "PENDING" || order.orderStatus === "CANCELLED"}
                      onClick={() => downloadInvoicePDF(order)}
                      className={`px-4 py-2.5 border rounded-xl text-[9px] uppercase tracking-wider font-bold transition-all flex items-center space-x-2 active:scale-95 ${
                        order.orderStatus === "PENDING" || order.orderStatus === "CANCELLED"
                          ? "border-gray-800 text-gray-600 bg-gray-900/30 cursor-not-allowed opacity-40"
                          : "border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#111111]"
                      }`}
                      title={order.orderStatus === "PENDING" ? "Confirm the order first to download invoice" : "Download Bill"}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>Invoice PDF</span>
                    </button>
                  </div>
                </div>

                {/* Right Section: Ordered Items Breakdown Cards */}
                <div className="lg:w-80 bg-black/40 border border-gray-900 rounded-2xl p-5 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold border-b border-gray-800/80 pb-2">
                      Items Ordered ({order.orderItems?.length || 0})
                    </p>
                    <div className="space-y-2 max-h-36 overflow-y-auto custom-scrollbar">
                      {order.orderItems?.map((item) => (
                        <div key={item.id} className="flex justify-between text-xs text-gray-400 font-light">
                          <span className="truncate pr-2">
                            {item.productName} <span className="text-[#D4AF37] font-mono font-bold">x{item.quantity}</span>
                          </span>
                          <span className="font-mono text-gray-300">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-800/80 pt-3 flex justify-between items-center">
                    <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Total Bill</span>
                    <span className="text-lg font-bold font-mono text-[#D4AF37]">₹{order.totalAmount}.00</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};