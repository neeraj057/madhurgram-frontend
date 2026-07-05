import React from "react";
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
} from "lucide-react";
import { Order } from "@/hooks/useAdminOrders"; // हुक से टाइप इम्पोर्ट किया
import { downloadInvoicePDF, getFormattedOrderNumber } from "@/utils/invoiceGenerator"; // पाथ चेक कर लेना भाई

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
  if (loading) {
    return <p className="text-gray-500 animate-pulse font-mono text-sm">Loading Live Pipeline...</p>;
  }

  if (orders.length === 0) {
    return <p className="text-gray-500 font-light text-sm">No orders placed yet from the village grid.</p>;
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="bg-[#161616] border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between gap-6 transition-all hover:border-gray-700">
          
          {/* Left Section: Customer & Shipping details */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center space-x-4">
              <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-mono font-bold px-3 py-1 rounded-full border border-[#D4AF37]/20">
                ID: {getFormattedOrderNumber(order as any)}
              </span>

              {/* Dynamic Action Grid */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {order.orderStatus !== "DELIVERED" && order.orderStatus !== "CANCELLED" ? (
                  <button
                    disabled={updatingId === order.id}
                    onClick={() => {
                      const nextStatusMap: { [key: string]: string } = {
                        PENDING: "CONFIRMED",
                        CONFIRMED: "SHIPPED",
                        SHIPPED: "OUT_FOR_DELIVERY",
                        OUT_FOR_DELIVERY: "DELIVERED",
                      };
                      onStatusChange(order.id, nextStatusMap[order.orderStatus]);
                    }}
                    className="px-4 py-2 bg-[#D4AF37] text-[#111111] font-mono text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-[#B38F00] transition-all flex items-center space-x-2 disabled:opacity-50 active:scale-95 shadow-md shadow-[#D4AF37]/10"
                  >
                    {updatingId === order.id ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#111111]" />
                    ) : (
                      <>
                        {order.orderStatus === "PENDING" && <CheckCircle className="h-3.5 w-3.5 text-[#111111]" />}
                        {order.orderStatus === "CONFIRMED" && <Truck className="h-3.5 w-3.5 text-[#111111]" />}
                        {order.orderStatus === "SHIPPED" && <Truck className="h-3.5 w-3.5 text-[#111111]" />}
                        {order.orderStatus === "OUT_FOR_DELIVERY" && <PackageCheck className="h-3.5 w-3.5 text-[#111111]" />}
                      </>
                    )}
                    <span>
                      {order.orderStatus === "PENDING" && "Confirm Order"}
                      {order.orderStatus === "CONFIRMED" && "Dispatch Package"}
                      {order.orderStatus === "SHIPPED" && "Out for Delivery"}
                      {order.orderStatus === "OUT_FOR_DELIVERY" && "Mark Delivered"}
                    </span>
                  </button>
                ) : (
                  <span
                    className={`text-[10px] uppercase font-mono font-bold px-3 py-1.5 rounded-full border flex items-center space-x-1 tracking-wider ${
                      order.orderStatus === "DELIVERED"
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}
                  >
                    {order.orderStatus === "DELIVERED" ? (
                      <>
                        <PackageCheck className="h-3 w-3 mr-1" />
                        <span>Order Completed</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" />
                        <span>Order Cancelled</span>
                      </>
                    )}
                  </span>
                )}

                {/* Cancel Button */}
                {(order.orderStatus === "PENDING" || order.orderStatus === "CONFIRMED") && (
                  <button
                    disabled={updatingId === order.id}
                    onClick={() => {
                      if (confirm("Are you sure you want to CANCEL this order?")) {
                        onStatusChange(order.id, "CANCELLED");
                      }
                    }}
                    className="px-3 py-2 bg-transparent border border-red-900/40 text-red-500 font-mono text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-red-950/20 hover:border-red-600 transition-all disabled:opacity-50 active:scale-95"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-1 mt-2 text-sm text-gray-300 font-light">
              <p className="flex items-center space-x-2">
                <User className="h-3.5 w-3.5 text-[#D4AF37]" />
                <span className="font-medium text-[#FDFBF7]">
                  {order.customerName} ({order.phoneNumber})
                </span>
              </p>
              <p className="flex items-center space-x-2">
                <MapPin className="h-3.5 w-3.5 text-gray-500" />
                <span>
                  {order.address}, {order.cityState} - {order.pincode}
                </span>
              </p>
              <p className="flex items-center space-x-2">
                <Calendar className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-xs text-gray-500 font-mono">
                  {new Date(order.orderDate).toLocaleString()}
                </span>
              </p>
            </div>

            {/* Invoice Button */}
            <div className="pt-2">
              <button
                disabled={order.orderStatus === "PENDING" || order.orderStatus === "CANCELLED"}
                onClick={() => downloadInvoicePDF(order)}
                className={`mt-2 px-4 py-2 border rounded-lg text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-2 active:scale-95 ${
                  order.orderStatus === "PENDING" || order.orderStatus === "CANCELLED"
                    ? "border-gray-800 text-gray-600 bg-gray-900/30 cursor-not-allowed opacity-40"
                    : "border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#111111]"
                }`}
                title={order.orderStatus === "PENDING" ? "Confirm the order first to download invoice" : "Download Bill"}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>
                  {order.orderStatus === "PENDING" && "Invoice Locked (Pending)"}
                  {order.orderStatus === "CANCELLED" && "Invoice Locked (Cancelled)"}
                  {order.orderStatus !== "PENDING" && order.orderStatus !== "CANCELLED" && "Download Invoice PDF"}
                </span>
              </button>
            </div>
          </div>

          {/* Right Section: Ordered items list & summary */}
          <div className="md:w-85 bg-black/30 border border-gray-900 rounded-xl p-4 flex flex-col justify-between">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold border-b border-gray-800 pb-1">
                Items Ordered
              </p>
              {order.orderItems?.map((item) => (
                <div key={item.id} className="flex justify-between text-xs text-gray-400 font-light gap-8">
                  <span>
                    {item.productName} <span className="text-[#D4AF37] font-mono">x{item.quantity}</span>
                  </span>
                  <span className="font-mono">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-800 pt-3 mt-4 flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Total Bill</span>
              <span className="text-base font-bold font-mono text-[#D4AF37]">₹{order.totalAmount}.00</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};