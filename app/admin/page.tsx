"use client";
import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  ArrowLeft,
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
import Link from "next/link";
import { API_ENDPOINTS } from "../../apis/api";
import { downloadInvoicePDF } from "../utils/invoiceGenerator"; // 👈 क्लीन इम्पोर्ट

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  customerName: string;
  phoneNumber: string;
  address: string;
  pincode: string;
  cityState: string;
  totalAmount: number;
  orderStatus: string;
  orderDate: string;
  orderItems: OrderItem[];
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchOrders = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.getAllOrders);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching admin orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔄 Graceful Status Update Handler (No More Screen Crashes!)
  // 🔄 UI क्रैश फ्री - Graceful Status Update Handler
  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const response = await fetch(
        API_ENDPOINTS.updateOrderStatus(orderId, newStatus),
        {
          method: "PATCH",
        }
      );

      // 🛡️ अगर बैकएंड से कोई भी दिक्कत आती है (जैसे 400 Bad Request)
      if (!response.ok) {
        const errorText = await response.text();
        // 🚨 स्क्रीन क्रैश करने के बजाय सीधे यहाँ अलर्ट दिखा कर यूआई को री-फेच कर लेंगे भाई
        alert(
          `Business Rule Violation: ${
            errorText || "Invalid status transition."
          }`
        );
        fetchOrders();
        setUpdatingId(null);
        return; // 🛑 यहीं से बाहर निकल जाओ, आगे कोड एग्जीक्यूट नहीं होगा
      }

      // ✅ सिर्फ सक्सेस होने पर ही UI स्टेट अपडेट होगी
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (error: any) {
      console.error("Network or Client Error:", error);
      alert("Something went wrong with the connection.");
      fetchOrders();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#111111] text-[#FDFBF7] p-8 md:p-16">
      <div className="max-w-6xl mx-auto">
        {/* Top Navigation */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-6 mb-12">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="h-6 w-6 text-[#D4AF37]" />
            <h1 className="font-serif text-3xl font-bold tracking-wide">
              MadhurGram Admin Panel
            </h1>
          </div>
          <Link
            href="/"
            className="text-xs uppercase tracking-widest text-gray-400 hover:text-[#D4AF37] flex items-center space-x-1 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back To Store</span>
          </Link>
        </div>

        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-6">
          Live Order Dashboard
        </h2>

        {loading ? (
          <p className="text-gray-500 animate-pulse font-mono text-sm">
            Loading Live Pipeline...
          </p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500 font-light text-sm">
            No orders placed yet from the village grid.
          </p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#161616] border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between gap-6 transition-all hover:border-gray-700"
              >
                {/* Left Section: Customer & Shipping details */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-4">
                    <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-mono font-bold px-3 py-1 rounded-full border border-[#D4AF37]/20">
                      ID: MG-000{order.id}
                    </span>

                    {/* 🚀 पुराने Dropdown को हटाकर लगाया: Dynamic Action Grid जो सारे Edge Cases संभालेगा भाई */}
                    {/* 🚀 Dynamic Action Grid — Premium & Minimalist UI */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      {/* मुख्य लाइफसाइकिल बटन */}
                      {order.orderStatus !== "DELIVERED" &&
                      order.orderStatus !== "CANCELLED" ? (
                        <button
                          disabled={updatingId === order.id}
                          onClick={() => {
                            const nextStatusMap: { [key: string]: string } = {
                              PENDING: "CONFIRMED",
                              CONFIRMED: "SHIPPED",
                              SHIPPED: "DELIVERED",
                            };
                            handleStatusChange(
                              order.id,
                              nextStatusMap[order.orderStatus]
                            );
                          }}
                          className="px-4 py-2 bg-[#D4AF37] text-[#111111] font-mono text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-[#B38F00] transition-all flex items-center space-x-2 disabled:opacity-50 active:scale-95 shadow-md shadow-[#D4AF37]/10"
                        >
                          {updatingId === order.id ? (
                            <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#111111]" />
                          ) : (
                            <>
                              {order.orderStatus === "PENDING" && (
                                <CheckCircle className="h-3.5 w-3.5 text-[#111111]" />
                              )}
                              {order.orderStatus === "CONFIRMED" && (
                                <Truck className="h-3.5 w-3.5 text-[#111111]" />
                              )}
                              {order.orderStatus === "SHIPPED" && (
                                <PackageCheck className="h-3.5 w-3.5 text-[#111111]" />
                              )}
                            </>
                          )}
                          <span>
                            {order.orderStatus === "PENDING" && "Confirm Order"}
                            {order.orderStatus === "CONFIRMED" &&
                              "Dispatch Package"}
                            {order.orderStatus === "SHIPPED" &&
                              "Mark Delivered"}
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

                      {/* सेपरेट कैंसिलेशन बटन: सिर्फ PENDING और CONFIRMED स्टेज पर दिखेगा */}
                      {(order.orderStatus === "PENDING" ||
                        order.orderStatus === "CONFIRMED") && (
                        <button
                          disabled={updatingId === order.id}
                          onClick={() => {
                            if (
                              confirm(
                                "Are you sure you want to CANCEL this order?"
                              )
                            ) {
                              handleStatusChange(order.id, "CANCELLED");
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
                      <User className="h-3.5 w-3.5 text-[#D4AF37]" />{" "}
                      <span className="font-medium text-[#FDFBF7]">
                        {order.customerName} ({order.phoneNumber})
                      </span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <MapPin className="h-3.5 w-3.5 text-gray-500" />{" "}
                      <span>
                        {order.address}, {order.cityState} - {order.pincode}
                      </span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <Calendar className="h-3.5 w-3.5 text-gray-500" />{" "}
                      <span className="text-xs text-gray-500 font-mono">
                        {new Date(order.orderDate).toLocaleString()}
                      </span>
                    </p>
                  </div>

                  {/* 🖨️ DOWNLOAD INVOICE BUTTON WITH STATUS RESTRICTION */}
                  <div className="pt-2">
                    <button
                      disabled={
                        order.orderStatus === "PENDING" ||
                        order.orderStatus === "CANCELLED"
                      } // 🛡️ अगर Pending या Cancelled है तो बटन काम नहीं करेगा भाई
                      onClick={() => downloadInvoicePDF(order)}
                      className={`mt-2 px-4 py-2 border rounded-lg text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-2 active:scale-95 ${
                        order.orderStatus === "PENDING" ||
                        order.orderStatus === "CANCELLED"
                          ? "border-gray-800 text-gray-600 bg-gray-900/30 cursor-not-allowed opacity-40"
                          : "border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#111111]"
                      }`}
                      title={
                        order.orderStatus === "PENDING"
                          ? "Confirm the order first to download invoice"
                          : "Download Bill"
                      }
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>
                        {order.orderStatus === "PENDING" &&
                          "Invoice Locked (Pending)"}
                        {order.orderStatus === "CANCELLED" &&
                          "Invoice Locked (Cancelled)"}
                        {order.orderStatus !== "PENDING" &&
                          order.orderStatus !== "CANCELLED" &&
                          "Download Invoice PDF"}
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
                      <div
                        key={item.id}
                        className="flex justify-between text-xs text-gray-400 font-light gap-8"
                      >
                        <span>
                          {item.productName}{" "}
                          <span className="text-[#D4AF37] font-mono">
                            x{item.quantity}
                          </span>
                        </span>
                        <span className="font-mono">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-800 pt-3 mt-4 flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                      Total Bill
                    </span>
                    <span className="text-base font-bold font-mono text-[#D4AF37]">
                      ₹{order.totalAmount}.00
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
