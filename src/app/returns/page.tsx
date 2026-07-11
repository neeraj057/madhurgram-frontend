"use client";
import React, { useState } from "react";
import { Undo2, Search, ArrowRight, ShieldCheck, Printer, CheckCircle } from "lucide-react";
import { API_ENDPOINTS } from "@/apis/api";
import { showToast } from "@/components/ui/Toast";

interface OrderDetail {
  id: number;
  customerName: string;
  phoneNumber: string;
  address: string;
  cityState: string;
  totalAmount: number;
  orderStatus: string;
  orderDate: string;
  orderItems: Array<{
    id: number;
    productName: string;
    quantity: number;
    price: number;
  }>;
}

interface ReturnRequest {
  id: number;
  orderId: number;
  customerPhone: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  refundTransactionId: string | null;
}

export default function CustomerReturnsPortal() {
  const [orderIdInput, setOrderIdInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [returnReq, setReturnReq] = useState<ReturnRequest | null>(null);

  // Form submission states
  const [reasonCategory, setReasonCategory] = useState("Packaging damaged (पैकेजिंग ख़राब है)");
  const [customReason, setCustomReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderIdInput || !phoneInput) {
      showToast("Please enter both Order ID and Phone Number.", "error");
      return;
    }

    const trimmedInput = orderIdInput.trim();
    let parsedOrderId: number | null = null;
    
    // Parse order ID from formatted inputs (e.g. MG-260709-0022 -> 22)
    if (trimmedInput.includes("-")) {
      const parts = trimmedInput.split("-");
      const lastPart = parts[parts.length - 1];
      parsedOrderId = parseInt(lastPart, 10);
    } else {
      const digitsOnly = trimmedInput.replace(/\D/g, "");
      if (digitsOnly) {
        if (digitsOnly.length > 6) {
          parsedOrderId = parseInt(digitsOnly.slice(-4), 10);
        } else {
          parsedOrderId = parseInt(digitsOnly, 10);
        }
      }
    }

    if (!parsedOrderId || isNaN(parsedOrderId)) {
      showToast("Please enter a valid Order ID (e.g. MG-260709-0022).", "error");
      return;
    }

    setLoading(true);
    setOrder(null);
    setReturnReq(null);

    try {
      // 1. Fetch Order Details using parsed integer ID
      const res = await fetch(`${API_ENDPOINTS.getAllOrders}/${parsedOrderId}`);
      if (!res.ok) {
        showToast("Order not found. Please verify Order ID.", "error");
        setLoading(false);
        return;
      }
      const orderData: OrderDetail = await res.json();

      // Verify phone match (compare last 4 digits because the phone number is masked as ******1234 for public lookups)
      const normalizedOrderPhone = orderData.phoneNumber.trim().replace(/\D/g, "");
      const normalizedInputPhone = phoneInput.trim().replace(/\D/g, "");
      
      const match = normalizedOrderPhone.length >= 4 && normalizedInputPhone.length >= 4
        ? normalizedOrderPhone.slice(-4) === normalizedInputPhone.slice(-4)
        : false;

      if (!match) {
        showToast("Phone number does not match order records.", "error");
        setLoading(false);
        return;
      }

      setOrder(orderData);

      // 2. Fetch Return Request status if any
      const returnRes = await fetch(API_ENDPOINTS.publicReturnRequestByOrder(orderData.id));
      if (returnRes.ok) {
        const returnData = await returnRes.json();
        setReturnReq(returnData);
      }
    } catch (err) {
      console.error(err);
      showToast("Error checking order status.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    if (order.orderStatus !== "DELIVERED") {
      showToast("Only delivered orders are eligible for return.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const finalReason = `[${reasonCategory}] ${customReason}`.trim();
      const url = `${API_ENDPOINTS.publicReturnRequest}?orderId=${order.id}&phone=${encodeURIComponent(phoneInput)}&reason=${encodeURIComponent(finalReason)}`;
      
      const res = await fetch(url, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setReturnReq(data);
        showToast("Return Request submitted successfully!", "success");
      } else {
        const errText = await res.text();
        showToast(errText || "Failed to submit return request.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error submitting return request.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-2">
            <Undo2 className="h-6 w-6 text-[#D4AF37]" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-[#FDFBF7] tracking-wide">
            MadhurGram Return Portal
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
            Gaon Ki Asli Mithaas — Easy Returns & Refunds
          </p>
        </div>

        {/* Lookup Box */}
        <div className="bg-[#111111]/80 border border-gray-800 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl">
          <h2 className="text-lg font-serif font-bold mb-6 text-[#D4AF37] border-b border-gray-800 pb-3">
            Track / Request a Return
          </h2>

          <form onSubmit={handleLookup} className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2">
                Order ID / ऑर्डर नंबर
              </label>
              <input
                type="text"
                placeholder="e.g. MG-260709-0022"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-all font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2">
                Phone Number / फोन नंबर
              </label>
              <input
                type="text"
                placeholder="e.g. 9876543210"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-all font-mono"
              />
            </div>
            <div className="md:col-span-2 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#E2A638] hover:from-[#E2A638] hover:to-[#FFF0BA] text-[#111] font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-98 flex items-center justify-center gap-2"
              >
                {loading ? "Searching..." : "Lookup Order"}
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="text-center text-[#D4AF37] font-mono animate-pulse">
            Fetching order parameters from the ledger...
          </div>
        )}

        {/* Order Details & Return Form */}
        {order && !returnReq && (
          <div className="bg-[#111111]/80 border border-gray-800 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl space-y-6">
            <div className="flex justify-between items-start border-b border-gray-800 pb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#FDFBF7]">Order #{order.id}</h3>
                <p className="text-xs text-gray-500">Placed on {new Date(order.orderDate).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                order.orderStatus === "DELIVERED"
                  ? "bg-green-950/40 text-green-400 border border-green-900/40"
                  : "bg-amber-950/40 text-amber-400 border border-amber-900/40"
              }`}>
                {order.orderStatus}
              </span>
            </div>

            {order.orderStatus !== "DELIVERED" ? (
              <div className="p-4 bg-amber-950/30 border border-amber-900/40 rounded-xl text-amber-400 text-xs leading-relaxed">
                🚨 <strong>Only Delivered Orders can be returned.</strong> If your order was recently dispatched, please wait until it is delivered. If you wish to cancel a pending order, please contact customer support.
              </div>
            ) : (
              <form onSubmit={handleSubmitReturn} className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Items in this Order</h4>
                  <div className="space-y-2">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between bg-black/40 p-3 rounded-xl border border-gray-800/60 text-xs font-mono">
                        <span className="text-gray-300 font-sans font-medium">{item.productName} (x{item.quantity})</span>
                        <span className="text-[#D4AF37]">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-800/80 pt-5 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Why are you returning this?</h4>
                  
                  <div className="space-y-3">
                    <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">
                      Reason Category / कारण
                    </label>
                    <select
                      value={reasonCategory}
                      onChange={(e) => setReasonCategory(e.target.value)}
                      className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-all"
                    >
                      <option>Packaging damaged (पैकेजिंग ख़राब है)</option>
                      <option>Defective / expired item (ख़राब / मियाद समाप्त उत्पाद)</option>
                      <option>Wrong volume/item delivered (गलत सामान मिला)</option>
                      <option>Quality issue / tastes different (गुणवत्ता का मुद्दा)</option>
                      <option>Other / अन्य</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">
                      Additional details (वैकल्पिक विवरण)
                    </label>
                    <textarea
                      rows={3}
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="Please share more details to help us improve."
                      className="w-full bg-black border border-gray-800 rounded-xl p-4 text-white focus:border-[#D4AF37] focus:outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-98 flex items-center justify-center gap-2"
                >
                  {submitting ? "Submitting Request..." : "Request Return & Generate Label"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        )}

        {/* Existing Return Details (PENDING or APPROVED) */}
        {returnReq && (
          <div className="bg-[#111111]/80 border border-gray-800 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl space-y-6">
            <div className="flex justify-between items-start border-b border-gray-800 pb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#FDFBF7]">Return Request Filed</h3>
                <p className="text-xs text-gray-500">For Order #{returnReq.orderId}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                returnReq.status === "APPROVED"
                  ? "bg-green-950/40 text-green-400 border border-green-900/40"
                  : returnReq.status === "REJECTED"
                    ? "bg-red-950/40 text-red-400 border border-red-900/40"
                    : "bg-amber-950/40 text-amber-400 border border-amber-900/40"
              }`}>
                {returnReq.status}
              </span>
            </div>

            <div className="bg-black/40 border border-gray-800/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-[#FDFBF7]">Return Details & Status</p>
                  <p className="text-gray-400 leading-relaxed">
                    Reason: "{returnReq.reason}"
                  </p>
                  {returnReq.status === "APPROVED" ? (
                    <div className="mt-2 space-y-1">
                      <p className="text-green-400 font-bold flex items-center gap-1.5">
                        <CheckCircle className="h-4 w-4" />
                        Refund Processed
                      </p>
                      <p className="text-[10px] text-gray-500 font-mono">
                        Ledger Txn ID: {returnReq.refundTransactionId}
                      </p>
                    </div>
                  ) : returnReq.status === "REJECTED" ? (
                    <p className="text-red-400 mt-2">Your return request was not approved. Please contact support at support@madhurgram.com.</p>
                  ) : (
                    <p className="text-amber-400 mt-2">Your return request is currently undergoing audit check. We have pre-approved your prepaid shipping label below.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Prepaid Shipping Label box */}
            {returnReq.status !== "REJECTED" && (
              <div className="border border-gray-800 rounded-2xl bg-black/60 p-5 space-y-5 flex flex-col items-center">
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-300">Prepaid Return Shipping Label</p>
                  <p className="text-[10px] text-gray-500">Generate, print, and affix to your packaging box.</p>
                </div>

                <div className="w-full max-w-[280px] bg-white p-2 rounded-xl border border-gray-200 shadow-md">
                  <iframe 
                    src={API_ENDPOINTS.publicReturnShippingLabel(returnReq.id)}
                    className="w-full h-80 border-0 pointer-events-none rounded"
                    title="Shipping Label Mock"
                  />
                </div>

                <a
                  href={API_ENDPOINTS.publicReturnShippingLabel(returnReq.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full max-w-sm py-3 bg-[#FDFBF7] hover:bg-gray-200 text-[#111] font-bold uppercase tracking-widest text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Print / Download Label
                </a>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
