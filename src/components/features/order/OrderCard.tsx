import React from "react";
import { Calendar, MapPin, Package, Tag } from "lucide-react";
import { CustomerOrder } from "@/apis/customerOrders";

interface OrderCardProps {
  order: CustomerOrder;
}

const STATUS_STYLES: Record<CustomerOrder["orderStatus"], string> = {
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  CONFIRMED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  SHIPPED: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  DELIVERED: "bg-green-500/10 text-green-400 border-green-500/20",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
};

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <div className="bg-[#161616] border border-gray-800 rounded-2xl p-6 shadow-xl transition-all hover:border-gray-700 space-y-4">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-800 pb-4">
        <div className="space-y-1">
          <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">Order Reference</span>
          <h3 className="text-sm font-mono font-bold text-[#D4AF37]">ID: MG-000{order.id}</h3>
        </div>
        <span className={`text-[11px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${STATUS_STYLES[order.orderStatus]}`}>
          ● {order.orderStatus}
        </span>
      </div>

      {/* Metadata & Shipping Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-400 font-light">
        <div className="space-y-2">
          <p className="flex items-center space-x-2">
            <Calendar className="h-3.5 w-3.5 text-gray-500" />
            <span>Ordered On: {new Date(order.orderDate).toLocaleDateString()}</span>
          </p>
          <p className="flex items-center space-x-2">
            <MapPin className="h-3.5 w-3.5 text-gray-500" />
            <span className="truncate">{order.address}, {order.cityState} - {order.pincode}</span>
          </p>
        </div>
        
        {/* Ordered Items Mini List */}
        <div className="bg-black/20 rounded-xl p-3 border border-gray-900/50 space-y-2">
          <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider flex items-center gap-1">
            <Package className="h-3 w-3" /> Package Contents
          </p>
          {order.orderItems?.map((item) => (
            <div key={item.id} className="flex justify-between text-[11px] text-gray-400">
              <span>{item.productName} <span className="text-[#D4AF37] font-mono">x{item.quantity}</span></span>
              <span className="font-mono">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card Footer: Total Amount */}
      <div className="border-t border-gray-900 pt-4 flex justify-between items-center bg-gradient-to-r from-transparent to-black/10 px-2 rounded-lg">
        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center gap-1">
          <Tag className="h-3 w-3 text-[#D4AF37]" /> Net Payable (COD)
        </span>
        <span className="text-base font-bold font-mono text-[#D4AF37]">
          ₹{order.totalAmount}.00
        </span>
      </div>
    </div>
  );
};