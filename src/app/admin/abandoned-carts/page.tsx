"use client";
import React, { useState, useEffect } from "react";
import { Clock, ArrowLeft, RefreshCw, MessageSquare, AlertCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { getAdminToken, handleAuthError } from "@/utils/adminAuth";
import { fetchAdminAbandonedCarts, AbandonedCartInfo } from "@/apis/cartRecovery";
import { fetchAutoRecoveryStatus, updateAutoRecoveryStatus } from "@/apis/adminSettings";

export default function RecoverSalesDashboard() {
  const [carts, setCarts] = useState<AbandonedCartInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cutoffMinutes, setCutoffMinutes] = useState(30);
  const [autoPilotEnabled, setAutoPilotEnabled] = useState(false);
  const [togglingAutoPilot, setTogglingAutoPilot] = useState(false);

  const loadAbandonedCarts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAdminToken();
      if (!token) {
        window.location.href = "/admin/login";
        return;
      }
      const data = await fetchAdminAbandonedCarts(token, cutoffMinutes);
      setCarts(data);
    } catch (err) {
      console.error("Failed to fetch abandoned carts:", err);
      setError(err instanceof Error ? err.message : "Failed to load abandoned carts.");
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const token = getAdminToken();
      if (!token) return;
      const status = await fetchAutoRecoveryStatus(token);
      setAutoPilotEnabled(status);
    } catch (err) {
      console.error("Failed to load settings:", err);
    }
  };

  useEffect(() => {
    loadAbandonedCarts();
  }, [cutoffMinutes]);

  useEffect(() => {
    loadSettings();
  }, []);

  const handleToggleAutoPilot = async () => {
    setTogglingAutoPilot(true);
    try {
      const token = getAdminToken();
      if (!token) return;
      const nextState = !autoPilotEnabled;
      const status = await updateAutoRecoveryStatus(token, nextState);
      setAutoPilotEnabled(status);
    } catch (err) {
      console.error("Failed to toggle auto-recovery:", err);
      alert("Failed to toggle Auto-Pilot state.");
    } finally {
      setTogglingAutoPilot(false);
    }
  };

  const handleWhatsAppSend = (cart: AbandonedCartInfo) => {
    const formattedPhone = cart.phoneNumber.startsWith("+")
      ? cart.phoneNumber.replace(/\D/g, "")
      : `91${cart.phoneNumber.replace(/\D/g, "")}`;

    // Get origin of checkout
    const origin = typeof window !== "undefined" ? window.location.origin : "https://madhurgram.com";
    const deepLink = `${origin}/?recoverCart=${cart.phoneNumber}`;

    const greeting = cart.customerName ? `नमस्ते ${cart.customerName}!` : "नमस्ते!";
    const message = `${greeting} आपने MadhurGram पर शुद्ध, विलेज-क्राफ्टेड प्रोडक्ट्स कार्ट में छोड़े थे। 🌾\n\nऑर्डर पूरा करने के लिए आपकी कार्ट यहाँ सुरक्षित है। आपके लिए स्पेशल 5% डिस्काउंट कूपन तैयार है!\n\ncomplete your order here: ${deepLink}\n\nधन्यवाद, टीम MadhurGram 💛`;

    const waUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} mins ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  const parseItems = (jsonStr: string) => {
    try {
      return JSON.parse(jsonStr);
    } catch {
      return [];
    }
  };

  return (
    <main className="min-h-screen bg-[#111111] text-[#FDFBF7] p-8 md:p-16 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-800 pb-6 mb-12 gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-[#D4AF37]/10 flex items-center justify-center rounded-xl border border-[#D4AF37]/20">
              <Clock className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold tracking-wide">Recover Sales</h1>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Auto-Pilot Cart Retention Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-4 self-start md:self-auto">
            {/* Auto-Pilot Toggle Control */}
            <div className="flex items-center space-x-2 bg-[#161616] border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs">
              <span className="text-gray-500 uppercase tracking-wider text-[9px] font-bold">Auto-Pilot:</span>
              <button
                onClick={handleToggleAutoPilot}
                disabled={togglingAutoPilot}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                  autoPilotEnabled ? "bg-[#D4AF37]" : "bg-gray-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-[#111111] shadow ring-0 transition duration-200 ease-in-out ${
                    autoPilotEnabled ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
              <span className={`font-mono text-[9px] font-bold uppercase ${autoPilotEnabled ? "text-emerald-500" : "text-gray-500"}`}>
                {autoPilotEnabled ? "Active" : "Off"}
              </span>
            </div>

            {/* Range Selector */}
            <div className="flex items-center bg-[#161616] border border-gray-800 rounded-xl px-3 py-2 text-xs">
              <span className="text-gray-500 mr-2 uppercase tracking-wider text-[9px] font-bold">Inactivity Limit:</span>
              <select
                value={cutoffMinutes}
                onChange={(e) => setCutoffMinutes(Number(e.target.value))}
                className="bg-transparent text-white font-bold outline-none border-none cursor-pointer focus:ring-0"
              >
                <option value={0} className="bg-[#161616] text-[#D4AF37] font-bold">0 Minutes (For Testing ⚡)</option>
                <option value={30} className="bg-[#161616] text-white">30 Minutes</option>
                <option value={360} className="bg-[#161616] text-white">6 Hours</option>
                <option value={1440} className="bg-[#161616] text-white">24 Hours</option>
              </select>
            </div>

            {/* Sync Button */}
            <button
              onClick={loadAbandonedCarts}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-3.5 bg-[#161616] border border-gray-800 rounded-xl text-xs font-bold text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-[#D4AF37]" : ""}`} />
              <span className="hidden sm:inline">Sync Pipeline</span>
            </button>

            <Link
              href="/admin/analytics"
              className="text-xs uppercase tracking-widest text-gray-400 hover:text-[#D4AF37] flex items-center space-x-1 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#161616] border border-gray-800/80 rounded-2xl p-6 relative overflow-hidden">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Pending recovery</span>
            <h3 className="text-4xl font-semibold text-[#FDFBF7] mt-2 font-mono">{carts.length}</h3>
            <div className="absolute right-4 bottom-4 h-12 w-12 bg-yellow-500/5 rounded-full flex items-center justify-center text-yellow-500">
              <ShoppingBag className="h-6 w-6" />
            </div>
          </div>
          <div className="bg-[#161616] border border-gray-800/80 rounded-2xl p-6 relative overflow-hidden">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Unclaimed Value</span>
            <h3 className="text-4xl font-semibold text-[#D4AF37] mt-2 font-mono">
              ₹{carts.reduce((acc, c) => acc + c.totalAmount, 0).toLocaleString()}
            </h3>
            <div className="absolute right-4 bottom-4 h-12 w-12 bg-green-500/5 rounded-full flex items-center justify-center text-green-500">
              <span className="text-xl font-bold">₹</span>
            </div>
          </div>
          <div className="bg-[#161616] border border-gray-800/80 rounded-2xl p-6 flex flex-col justify-center">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Conversion Target</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Retrieve abandoned checkout sessions by deploying highly targeted discount links directly on WhatsApp.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/5 border border-red-500/10 text-red-400 text-sm px-5 py-4 rounded-xl flex items-center space-x-3 mb-8">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Pipeline Table */}
        <div className="bg-[#161616] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          {loading && carts.length === 0 ? (
            <div className="py-24 text-center space-y-4 animate-pulse">
              <div className="inline-block h-8 w-8 rounded-full border-2 border-t-[#D4AF37] border-gray-800 animate-spin"></div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Analyzing pipeline...</p>
            </div>
          ) : carts.length === 0 ? (
            <div className="py-24 text-center space-y-3">
              <Clock className="h-8 w-8 text-gray-700 mx-auto" />
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">No Abandoned Carts</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                Great job! All checkout attempts in the last {cutoffMinutes} minutes have either converted or no sessions were logged.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm text-gray-400">
                <thead className="bg-[#0f0f0f] border-b border-gray-800 text-[10px] uppercase text-gray-500 tracking-wider">
                  <tr>
                    <th className="p-5 font-semibold">Customer Details</th>
                    <th className="p-5 font-semibold">Cart Items</th>
                    <th className="p-5 font-semibold">Total Amount</th>
                    <th className="p-5 font-semibold">Status</th>
                    <th className="p-5 font-semibold">Time Inactive</th>
                    <th className="p-5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {carts.map((cart) => {
                    const items = parseItems(cart.cartItemsJson);
                    return (
                      <tr key={cart.id} className="hover:bg-gray-900/20 transition-all">
                        {/* Customer Phone & Name */}
                        <td className="p-5">
                          <div className="font-semibold text-white">
                            {cart.customerName || "Walk-in Customer"}
                          </div>
                          <div className="text-xs text-[#D4AF37] font-mono mt-1">
                            +91 {cart.phoneNumber}
                          </div>
                        </td>

                        {/* Cart Items Details */}
                        <td className="p-5 max-w-sm">
                          <div className="flex flex-wrap gap-2">
                            {items.map((item: any, idx: number) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#1a1a1a] text-gray-300 border border-gray-800/80"
                              >
                                {item.name} ({item.volume || item.weight}) x{item.quantity}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Value */}
                        <td className="p-5">
                          <span className="font-mono text-white font-bold text-base">
                            ₹{cart.totalAmount.toLocaleString()}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="p-5">
                          {cart.recovered ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Recovered
                            </span>
                          ) : cart.reminderSent ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              Auto Reminded
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                              Pending
                            </span>
                          )}
                        </td>

                        {/* Duration */}
                        <td className="p-5">
                          <div className="flex items-center space-x-1.5 text-xs">
                            <span className="h-1.5 w-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
                            <span className="text-gray-400 font-light">{formatTimeAgo(cart.lastUpdated)}</span>
                          </div>
                        </td>

                        {/* Action Link */}
                        <td className="p-5 text-right">
                          <button
                            onClick={() => handleWhatsAppSend(cart)}
                            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-600/10 hover:bg-emerald-600 border border-emerald-600/30 hover:border-emerald-600 rounded-xl text-xs font-bold text-emerald-400 hover:text-[#111111] transition-all duration-300 group active:scale-95"
                          >
                            <MessageSquare className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                            <span>WhatsApp Reminder</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
