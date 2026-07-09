"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { API_ENDPOINTS } from "@/apis/api";
import { ShoppingBag, ArrowLeft, Truck, Package, CheckCircle2, ShieldAlert, CreditCard, Copy, Check } from "lucide-react";
import Link from "next/link";
import { getFormattedOrderNumber } from "@/utils/invoiceGenerator";
import { showToast } from "@/components/ui/Toast";

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
}

interface OrderDetails {
  id: number;
  customerName: string;
  phoneNumber: string;
  address: string;
  pincode: string;
  cityState: string;
  totalAmount: number;
  orderStatus: string;
  orderDate: string;
  trackingNumber: string | null;
  courierName: string | null;
  paymentStatus: string;
  paymentTransactionId: string | null;
  orderItems: OrderItem[];
}

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params?.id ? parseInt(params.id as string) : null;

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [retryingPayment, setRetryingPayment] = useState(false);

  const fetchOrderDetails = async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_ENDPOINTS.trackOrder(orderId)}`);
      if (!response.ok) {
        throw new Error("Order not found or database sync issue.");
      }
      const data = await response.json();
      setOrder(data);
    } catch (err) {
      console.error(err);
      setError("Unable to find the order records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 💳 Webhook payment retry simulation
  const handleSimulatePaymentSuccess = async () => {
    if (!orderId) return;
    setRetryingPayment(true);
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
      const response = await fetch(`${BASE_URL}/api/payments/webhook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "payment_intent.succeeded",
          data: {
            orderId: orderId,
            transactionId: `ch_mock_stripe_${Math.floor(100000 + Math.random() * 900000)}`,
            amount: order?.totalAmount || 0,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Webhook payment processing failed.");
      }
      
      // Wait for logistics auto-pickup triggers
      setTimeout(() => {
        fetchOrderDetails();
        setRetryingPayment(false);
      }, 1200);

    } catch (err) {
      console.error(err);
      showToast("Failed to process payment retry.", "error");
      setRetryingPayment(false);
    }
  };

  // Define tracking steps
  const steps = [
    { label: "Order Placed", status: "PENDING", description: "Waiting for checkout payment approval" },
    { label: "Confirmed", status: "CONFIRMED", description: "Paid, stock deducted, ready to pack" },
    { label: "Shipped", status: "SHIPPED", description: "Waybill generated, pickup completed" },
    { label: "Out For Delivery", status: "OUT_FOR_DELIVERY", description: "Dispatched with delivery agent" },
    { label: "Delivered", status: "DELIVERED", description: "Received by customer" }
  ];

  const getStepIndex = (status: string) => {
    if (status === "CANCELLED") return -1;
    return steps.findIndex(step => step.status === status);
  };

  const currentStepIndex = order ? getStepIndex(order.orderStatus) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Synchronizing Tracking Timeline...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white border border-[#D4AF37]/20 p-8 rounded-3xl shadow-xl text-center space-y-6">
          <ShieldAlert className="h-14 w-14 text-red-500 mx-auto" />
          <h2 className="text-2xl font-serif font-bold text-gray-800">Order Not Found</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            We couldn&apos;t retrieve shipment records for Order ID #{orderId}. Please check the tracking link or contact customer care.
          </p>
          <Link href="/" className="inline-flex items-center space-x-2 px-6 py-3 bg-[#111111] hover:bg-[#D4AF37] text-white hover:text-black font-bold text-xs uppercase tracking-wider rounded-full transition-all duration-300">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Storefront</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] py-12 px-4 md:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Top Navigation */}
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 text-xs uppercase tracking-widest font-bold text-gray-600 hover:text-[#D4AF37] transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>MadhurGram Store</span>
          </Link>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Order ID</p>
            <p className="text-sm font-bold font-mono text-gray-800">#{getFormattedOrderNumber(order as any)}</p>
          </div>
        </div>

        {/* 💳 Payment Status Alert Box */}
        {order.orderStatus === "CANCELLED" ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-2xl flex items-start gap-4">
            <ShieldAlert className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm">Order Cancelled</h4>
              <p className="text-xs text-red-600/90 leading-relaxed">
                This order was cancelled due to payment failure or customer rejection. Deducted inventory stocks have been restored.
              </p>
            </div>
          </div>
        ) : (order.paymentStatus === "FAILED" || order.paymentStatus === "PENDING") ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 px-6 py-5 rounded-2xl space-y-4">
            <div className="flex items-start gap-4">
              <CreditCard className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm">Payment Pending / Failed</h4>
                <p className="text-xs text-amber-800/90 leading-relaxed">
                  Your last transaction was declined or is pending payment. Click below to simulate a successful Stripe/Razorpay payment intent update.
                </p>
              </div>
            </div>
            <button
              onClick={handleSimulatePaymentSuccess}
              disabled={retryingPayment}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#D4AF37] text-black hover:bg-black hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 disabled:opacity-50"
            >
              {retryingPayment ? "Authorizing checkout..." : "Retry Stripe/Razorpay Payment"}
            </button>
          </div>
        ) : order.paymentStatus === "COD" ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 px-6 py-4 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-[10px] text-emerald-700 uppercase tracking-widest font-bold">Payment Method</p>
                <p className="text-xs font-semibold text-emerald-900 mt-0.5">Cash on Delivery (COD)</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase tracking-widest rounded-full">
              COD
            </span>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 px-6 py-4 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-[10px] text-emerald-700 uppercase tracking-widest font-bold">Payment Verified</p>
                <p className="text-xs font-semibold font-mono text-emerald-900 mt-0.5">Txn ID: {order.paymentTransactionId}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase tracking-widest rounded-full">
              {order.paymentStatus}
            </span>
          </div>
        )}

        {/* 📈 Shipment Tracking Stepper Card */}
        {order.orderStatus !== "CANCELLED" && (
          <div className="bg-white border border-[#D4AF37]/20 rounded-3xl p-6 md:p-8 shadow-xl space-y-8">
            <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
              <div>
                <h3 className="font-serif font-bold text-lg text-gray-800">Shipment Status</h3>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Live Delhivery Tracker</p>
              </div>
              <Truck className="h-6 w-6 text-[#D4AF37] animate-pulse" />
            </div>

            {/* Stepper Grid (Vertical on Mobile / Horizontal on Desktop) */}
            <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-5 md:gap-4 relative pt-2">
              {/* Desktop Connecting Line */}
              <div className="hidden md:block absolute left-8 right-8 top-6 h-0.5 bg-gray-100 z-0">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500" 
                  style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
                />
              </div>

              {steps.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={idx} className="flex md:flex-col items-center md:text-center gap-4 md:gap-3 relative z-10">
                    {/* Step Icon Node */}
                    <div 
                      className={`h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isCompleted 
                          ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20" 
                          : isCurrent 
                            ? "bg-white border-[#D4AF37] text-[#D4AF37] scale-110" 
                            : "bg-white border-gray-200 text-gray-300"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <span className="text-xs font-bold font-mono">{idx + 1}</span>
                      )}
                    </div>

                    {/* Step Label Content */}
                    <div className="text-left md:text-center">
                      <p className={`text-xs font-bold ${isCompleted ? "text-gray-800" : "text-gray-400"}`}>
                        {step.label}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5 leading-tight max-w-[120px] mx-auto hidden md:block">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 📦 Courier Information */}
        {order.trackingNumber && (
          <div className="bg-white border border-[#D4AF37]/20 rounded-3xl p-6 md:p-8 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-[#D4AF37]" />
                <h4 className="font-bold text-sm text-gray-800">{order.courierName}</h4>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Your parcel has been handed over to the courier partner. You can use the Waybill number to query updates from the main portal.
              </p>
            </div>
            
            <div className="bg-[#FDFBF7] border border-gray-200/80 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Waybill AWB Number</p>
                <p className="text-sm font-bold font-mono text-gray-800 mt-1">{order.trackingNumber}</p>
              </div>
              <button
                onClick={() => copyToClipboard(order.trackingNumber || "")}
                className="p-2.5 bg-white border border-gray-200 rounded-xl hover:text-[#D4AF37] hover:border-[#D4AF37]/40 active:scale-95 transition-all cursor-pointer"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-gray-500" />}
              </button>
            </div>
          </div>
        )}

        {/* 🗺️ Delivery Details & Product Breakdown */}
        <div className="bg-white border border-[#D4AF37]/20 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
          <h3 className="font-serif font-bold text-lg text-gray-800 border-b border-gray-100 pb-3">Delivery Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Customer details</p>
              <p className="text-sm font-bold text-gray-800">{order.customerName}</p>
              <p className="text-xs text-gray-500 font-mono">{order.phoneNumber}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Shipping Address</p>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs">{order.address}</p>
              <p className="text-xs font-bold text-gray-800 mt-1">{order.cityState} - {order.pincode}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5 space-y-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Items Purchased</p>
            <div className="space-y-3">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-[#D4AF37]" />
                    <p className="font-semibold text-gray-700">{item.productName}</p>
                    <p className="text-gray-400 font-mono">x {item.quantity}</p>
                  </div>
                  <p className="font-bold text-gray-800">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Total Bill</p>
              <p className="text-lg font-serif font-bold text-[#D4AF37]">₹{order.totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
