"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Sparkles, RefreshCw, Star, Trash2 } from "lucide-react";
import { useAdminMarketing, BroadcastCampaignRequest } from "@/hooks/useAdminMarketing";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import { showToast } from "@/components/ui/Toast";
import { API_ENDPOINTS } from "@/apis/api";
import { getAuthFetchOptions, handleAuthError } from "@/utils/adminAuth";

export default function AdminMarketingPage() {
  const { campaigns, loading, submitting, error, fetchCampaigns, createCampaign } = useAdminMarketing();
  const { products, fetchProducts } = useAdminProducts();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetSegment, setTargetSegment] = useState("oil buyers");
  const [productId, setProductId] = useState<number | null>(null);
  const [productKeyword, setProductKeyword] = useState("oil");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Google Review Reputation Engine states
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewUrl, setReviewUrl] = useState("https://g.page/r/MadhurGramGhee/review");
  const [testName, setTestName] = useState("");
  const [testPhone, setTestPhone] = useState("");
  const [testSubmitting, setTestSubmitting] = useState(false);


  // WhatsApp Quick Buy states
  const [whatsappEnabled, setWhatsappEnabled] = useState("true");
  const [whatsappNumber, setWhatsappNumber] = useState("917899999902");
  const [whatsappTemplate, setWhatsappTemplate] = useState("");
  const [whatsappSaving, setWhatsappSaving] = useState(false);

  // Pincode SLA Tiers states
  const [pincodeSlaLocal, setPincodeSlaLocal] = useState("1-2 Business Days");
  const [pincodeSlaRegional, setPincodeSlaRegional] = useState("2-3 Business Days");
  const [pincodeSlaNational, setPincodeSlaNational] = useState("4-6 Business Days");
  const [pincodeSaving, setPincodeSaving] = useState(false);

  const fetchReviewsQueue = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.adminMarketingReviews, getAuthFetchOptions());
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (e) {
      console.error("Error fetching reviews queue:", e);
    }
  };

  const fetchReviewConfig = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.adminMarketingReviewsConfig, getAuthFetchOptions());
      if (res.ok) {
        const data = await res.json();
        setReviewUrl(data.googleReviewUrl || "");
      }
    } catch (e) {
      console.error("Error fetching review config:", e);
    }
  };

  const handleSaveConfig = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.adminMarketingReviewsConfig, getAuthFetchOptions("PUT", JSON.stringify({ googleReviewUrl: reviewUrl }), "application/json"));
      if (res.ok) {
        showToast("Review link template updated.", "success");
        fetchReviewConfig();
      } else {
        showToast("Failed to update config.", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Error updating review URL.", "error");
    }
  };

  const handleSendNow = async (id: number) => {
    try {
      const res = await fetch(API_ENDPOINTS.adminMarketingReviewsSendNow(id), getAuthFetchOptions("POST"));
      if (res.ok) {
        showToast("Review solicitation transmitted instantly!", "success");
        fetchReviewsQueue();
      } else {
        showToast("Failed to send review request.", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Error sending review request.", "error");
    }
  };

  const handleSendTest = async () => {
    if (!testName || !testPhone) {
      showToast("Name and Phone are required for test send.", "error");
      return;
    }
    setTestSubmitting(true);
    try {
      const url = `${API_ENDPOINTS.adminMarketingReviewsSendTest}?name=${encodeURIComponent(testName)}&phone=${encodeURIComponent(testPhone)}`;
      const res = await fetch(url, getAuthFetchOptions("POST"));
      if (res.ok) {
        showToast("Test Google Review invite sent!", "success");
        setTestName("");
        setTestPhone("");
        fetchReviewsQueue();
      } else {
        showToast("Failed to send test invite.", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Error sending test invitation.", "error");
    } finally {
      setTestSubmitting(false);
    }
  };


  const fetchWhatsAppConfig = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.adminWhatsAppConfig, getAuthFetchOptions());
      if (res.ok) {
        const data = await res.json();
        setWhatsappEnabled(data.whatsappEnabled || "true");
        setWhatsappNumber(data.whatsappNumber || "917899999902");
        setWhatsappTemplate(data.whatsappTemplate || "");
      }
    } catch (e) {
      console.error("Error fetching WhatsApp config:", e);
    }
  };

  const handleSaveWhatsAppConfig = async () => {
    setWhatsappSaving(true);
    try {
      const res = await fetch(API_ENDPOINTS.updateWhatsAppConfig, getAuthFetchOptions("PUT", JSON.stringify({
        whatsappEnabled,
        whatsappNumber,
        whatsappTemplate
      }), "application/json"));
      if (res.ok) {
        showToast("WhatsApp Quick Buy settings updated.", "success");
        fetchWhatsAppConfig();
      } else {
        showToast("Failed to update WhatsApp settings.", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Error updating WhatsApp settings.", "error");
    } finally {
      setWhatsappSaving(false);
    }
  };

  const fetchPincodeConfig = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.adminPincodeConfig, getAuthFetchOptions());
      if (res.ok) {
        const data = await res.json();
        setPincodeSlaLocal(data.pincodeSlaLocal || "1-2 Business Days");
        setPincodeSlaRegional(data.pincodeSlaRegional || "2-3 Business Days");
        setPincodeSlaNational(data.pincodeSlaNational || "4-6 Business Days");
      }
    } catch (e) {
      console.error("Error fetching Pincode config:", e);
    }
  };

  const handleSavePincodeConfig = async () => {
    setPincodeSaving(true);
    try {
      const res = await fetch(API_ENDPOINTS.updatePincodeConfig, getAuthFetchOptions("PUT", JSON.stringify({
        pincodeSlaLocal,
        pincodeSlaRegional,
        pincodeSlaNational
      }), "application/json"));
      if (res.ok) {
        showToast("Pincode SLA settings updated successfully.", "success");
        fetchPincodeConfig();
      } else {
        showToast("Failed to update Pincode SLA settings.", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Error updating Pincode settings.", "error");
    } finally {
      setPincodeSaving(false);
    }
  };

  useEffect(() => {
    fetchWhatsAppConfig();
    fetchPincodeConfig();
    fetchCampaigns();
    fetchProducts();
    fetchReviewsQueue();
    fetchReviewConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatusMessage(null);

    const payload: BroadcastCampaignRequest = {
      title: title.trim(),
      message: message.trim(),
      targetSegment,
      productKeyword: productKeyword.trim(),
      productId,
    };

    if (!payload.title || !payload.message) {
      setStatusMessage("Campaign title and message are required.");
      return;
    }

    const result = await createCampaign(payload);
    if (result) {
      setStatusMessage(`Campaign queued for ${result.recipients} recipients.`);
      setTitle("");
      setMessage("");
    }
  };

  const segmentOptions = [
    { value: "top spenders", label: "Top Spenders" },
    { value: "inactive customers", label: "Inactive Customers" },
    { value: "oil buyers", label: "Oil Buyers" },
  ];

  return (
    <main className="min-h-screen bg-[#111111] text-[#FDFBF7] p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="h-6 w-6 text-[#D4AF37]" />
              <div>
                <h1 className="text-3xl font-serif font-bold tracking-wide">Marketing Broadcast</h1>
                <p className="text-sm text-gray-400">Target customers, send pulse campaigns, and measure campaign conversions.</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-xs uppercase tracking-widest text-gray-400 hover:text-[#D4AF37] flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
            <button
              onClick={fetchCampaigns}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-800 bg-[#161616] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-300 hover:text-[#D4AF37] disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>



    {/* 💬 WHATSAPP QUICK BUY CONFIGURATION BOARD */}
    <section className="rounded-3xl border border-gray-800 bg-[#161616] p-8 shadow-sm mt-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-800 pb-5 mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-green-500" />
            WhatsApp Quick Buy Configuration
          </h2>
          <p className="text-sm text-gray-400">Manage status, business phone number, and customizable templates for WhatsApp Quick Orders.</p>
          <div className="mt-2.5 flex items-center gap-2">
            {whatsappEnabled === "true" ? (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full select-none animate-fadeIn">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                </span>
                Live & Active on Storefront
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full select-none animate-fadeIn">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                Disabled & Hidden from Storefront
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleSaveWhatsAppConfig}
          disabled={whatsappSaving}
          className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-[#FDFBF7] text-xs font-bold uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 cursor-pointer"
        >
          {whatsappSaving ? "Saving Config..." : "Save WhatsApp Configuration"}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left side: Toggle & Number */}
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold mb-2">WhatsApp Order Channel Status</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "true", label: "Enabled" },
                { value: "false", label: "Disabled" }
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setWhatsappEnabled(opt.value)}
                  className={`py-3 px-4 rounded-xl border text-center transition-all cursor-pointer text-xs uppercase font-bold tracking-wider ${
                    whatsappEnabled === opt.value
                      ? "border-green-500 bg-green-500/10 text-green-400"
                      : "border-gray-800 bg-[#111] hover:border-gray-700 text-gray-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-1">WhatsApp Business Contact Phone</label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="e.g. 917899999902"
              className="w-full rounded-xl border border-gray-800 bg-[#0d0d0d] px-3.5 py-2 text-xs text-white outline-none focus:border-green-500 font-mono font-bold"
              style={{ color: "#FFFFFF", opacity: 1 }}
            />
            <p className="text-[10px] text-gray-500 mt-1">Must include country code (e.g. 91 for India) without '+' symbol.</p>
            {whatsappNumber && (
              <div className="mt-2.5">
                <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1.5 rounded-lg select-none">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                  </span>
                  Active Number: {whatsappNumber}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right side: Message Template */}
        <div className="space-y-4 border-t md:border-t-0 md:border-l border-gray-800/80 pt-4 md:pt-0 md:pl-6">
          <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">WhatsApp Message Text Template</label>
          <div>
            <textarea
              rows={4}
              value={whatsappTemplate}
              onChange={(e) => setWhatsappTemplate(e.target.value)}
              placeholder="e.g. नमस्ते MadhurGram, मुझे *{productName}* ({volume}) आर्डर करना है..."
              className="w-full rounded-xl border border-gray-800 bg-[#0d0d0d] px-3.5 py-2 text-xs text-white outline-none focus:border-green-500 leading-relaxed font-semibold"
              style={{ color: "#FFFFFF", opacity: 1 }}
            />
            <p className="text-[10px] text-gray-500 mt-1.5 leading-normal">
              Customize the message template. Use <code className="text-[#D4AF37] font-mono">{`{productName}`}</code> and <code className="text-[#D4AF37] font-mono">{`{volume}`}</code> to automatically map customer selection values.
            </p>
            {whatsappTemplate && (
              <div className="mt-2.5">
                <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1.5 rounded-lg select-none">
                  ✓ Active Message Template Loaded
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>

    {/* 📍 PINCODE DELIVERY SLA CONFIGURATION BOARD */}
    <section className="rounded-3xl border border-gray-800 bg-[#161616] p-8 shadow-sm mt-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-800 pb-5 mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Courier Delivery SLA Configurations
          </h2>
          <p className="text-sm text-gray-400">Configure expected delivery timelines for each geographic tier based on customer pincode validation.</p>
        </div>
        <button
          onClick={handleSavePincodeConfig}
          disabled={pincodeSaving}
          className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-[#FDFBF7] text-xs font-bold uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 cursor-pointer"
        >
          {pincodeSaving ? "Saving SLAs..." : "Save SLA Configurations"}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Local Tier */}
        <div className="space-y-2">
          <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Local Tier SLA (Bhadohi/Varanasi)</label>
          <input
            type="text"
            value={pincodeSlaLocal}
            onChange={(e) => setPincodeSlaLocal(e.target.value)}
            placeholder="e.g. 1-2 Business Days"
            className="w-full rounded-xl border border-gray-800 bg-[#0d0d0d] px-3.5 py-2 text-xs text-white outline-none focus:border-amber-500 font-semibold"
            style={{ color: "#FFFFFF", opacity: 1 }}
          />
          <p className="text-[9px] text-gray-500 mt-1">Expected delivery SLA message shown for local districts.</p>
        </div>

        {/* Regional Tier */}
        <div className="space-y-2">
          <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Regional Tier SLA (Uttar Pradesh)</label>
          <input
            type="text"
            value={pincodeSlaRegional}
            onChange={(e) => setPincodeSlaRegional(e.target.value)}
            placeholder="e.g. 2-3 Business Days"
            className="w-full rounded-xl border border-gray-800 bg-[#0d0d0d] px-3.5 py-2 text-xs text-white outline-none focus:border-amber-500 font-semibold"
            style={{ color: "#FFFFFF", opacity: 1 }}
          />
          <p className="text-[9px] text-gray-500 mt-1">Expected delivery SLA message shown for customers in rest of UP.</p>
        </div>

        {/* National Tier */}
        <div className="space-y-2">
          <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">National Tier SLA (Rest of India)</label>
          <input
            type="text"
            value={pincodeSlaNational}
            onChange={(e) => setPincodeSlaNational(e.target.value)}
            placeholder="e.g. 4-6 Business Days"
            className="w-full rounded-xl border border-gray-800 bg-[#0d0d0d] px-3.5 py-2 text-xs text-white outline-none focus:border-amber-500 font-semibold"
            style={{ color: "#FFFFFF", opacity: 1 }}
          />
          <p className="text-[9px] text-gray-500 mt-1">Expected delivery SLA message shown for other valid Indian states.</p>
        </div>
      </div>
    </section>

    <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-gray-800 bg-[#161616] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Create Broadcast Campaign</h2>
                <p className="text-sm text-gray-400">Choose a segment, craft your message, and hit send.</p>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-2">Campaign Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-2xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#D4AF37]"
                  placeholder="Example: Mustard Oil Festival Offer"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full rounded-2xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#D4AF37]"
                  placeholder="Share a short offer message and link to checkout."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-2">Target Segment</label>
                  <select
                    value={targetSegment}
                    onChange={(e) => setTargetSegment(e.target.value)}
                    className="w-full rounded-2xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#D4AF37]"
                  >
                    {segmentOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-2">Product Keyword</label>
                  <input
                    value={productKeyword}
                    onChange={(e) => setProductKeyword(e.target.value)}
                    className="w-full rounded-2xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#D4AF37]"
                    placeholder="oil, mustard, kachchi ghani"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-2">Product Reference (optional)</label>
                <select
                  value={productId ?? ""}
                  onChange={(e) => setProductId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full rounded-2xl border border-gray-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#D4AF37]"
                >
                  <option value="">Use keyword only</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.stock} in stock)
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-gray-500">Selecting a product helps tie the campaign to a specific SKU.</p>
              </div>

              {statusMessage && <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#1a1a1a] p-4 text-sm text-[#D4AF37]">{statusMessage}</div>}
              {error && <div className="rounded-2xl border border-red-500/30 bg-red-900/20 p-4 text-sm text-red-300">{error}</div>}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[#111111] transition hover:bg-[#FDFBF7] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Send className="h-4 w-4" />
                {submitting ? "Sending Broadcast…" : "Send Broadcast"}
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-gray-800 bg-[#161616] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Recent Campaigns</h2>
                <p className="text-sm text-gray-400">Live recipient and conversion insights.</p>
              </div>
              <div className="rounded-2xl bg-[#111111] px-4 py-2 text-xs uppercase tracking-[0.3em] text-gray-400">{campaigns.length} campaigns</div>
            </div>

            {campaigns.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-800 bg-[#111111] p-6 text-sm text-gray-500">
                No campaigns yet. Send your first broadcast to begin tracking conversions.
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="rounded-3xl border border-gray-800 bg-[#121212] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">{campaign.targetSegment}</p>
                        <h3 className="text-lg font-semibold text-white mt-2">{campaign.title}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Recipients</p>
                        <p className="text-2xl font-bold text-[#D4AF37]">{campaign.recipients}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-300">{campaign.message}</p>
                    <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
                      <span className="rounded-full bg-[#111111] px-3 py-1">Conversions: {campaign.conversions}</span>
                      <span className="rounded-full bg-[#111111] px-3 py-1">Keyword: {campaign.productKeyword || "—"}</span>
                      <span className="rounded-full bg-[#111111] px-3 py-1">Created: {new Date(campaign.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Google Review Reputation Engine Section */}
        <section className="rounded-3xl border border-gray-800 bg-[#161616] p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-800 pb-5 mb-6 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Star className="h-5 w-5 text-[#D4AF37] fill-[#D4AF37]" />
                Google Review Automation (Reputation Engine)
              </h2>
              <p className="text-sm text-gray-400">Manage review invitations sent 24h post-delivery, tweak template link, or trigger instant tests.</p>
            </div>
            
            {/* Quick config */}
            <div className="flex items-center gap-3">
              <input 
                type="text"
                value={reviewUrl}
                onChange={(e) => setReviewUrl(e.target.value)}
                placeholder="Google Business Profile Link"
                className="rounded-xl border border-gray-800 bg-[#111111] px-4 py-2 text-xs text-white outline-none w-60 focus:border-[#D4AF37]"
              />
              <button 
                onClick={handleSaveConfig}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#F7D070] text-[#111] text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
              >
                Save Url
              </button>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.4fr_0.6fr]">
            {/* Left side: Send Test Form */}
            <div className="space-y-5 bg-[#111111]/40 border border-gray-800/80 p-5 rounded-2xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">Send Instant Test Invite</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-1">Customer Name</label>
                  <input 
                    type="text"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full rounded-xl border border-gray-800 bg-[#111111] px-3.5 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-1">Phone Number (with WhatsApp/SMS)</label>
                  <input 
                    type="text"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full rounded-xl border border-gray-800 bg-[#111111] px-3.5 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <button 
                  onClick={handleSendTest}
                  disabled={testSubmitting}
                  className="w-full py-2.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37] border border-[#D4AF37]/20 hover:text-[#111] text-[#D4AF37] text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
                >
                  {testSubmitting ? "Sending..." : "Send Test Invite"}
                </button>
              </div>
            </div>

            {/* Right side: Queue table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">Invitation Logs Queue</h3>
                <button 
                  onClick={fetchReviewsQueue}
                  className="text-[10px] text-[#D4AF37] hover:underline"
                >
                  Refresh Queue
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto border border-gray-800 rounded-2xl bg-black/30 scrollbar-thin">
                {reviews.length === 0 ? (
                  <p className="p-10 text-center text-gray-500 text-xs">No reviews scheduled in the reputation queue. Complete an order to trigger.</p>
                ) : (
                  <table className="w-full text-left text-xs text-gray-400">
                    <thead className="bg-[#0e0e0e] text-[9px] uppercase text-gray-500 font-bold tracking-wider sticky top-0 border-b border-gray-800">
                      <tr>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Phone</th>
                        <th className="px-4 py-3">Scheduled / Sent</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/80">
                      {reviews.map((req) => (
                        <tr key={req.id} className="hover:bg-gray-900/30 transition-colors">
                          <td className="px-4 py-3 font-semibold text-[#FDFBF7]">{req.customerName}</td>
                          <td className="px-4 py-3 font-mono text-gray-500">{req.customerPhone}</td>
                          <td className="px-4 py-3 font-mono text-gray-500">
                            {req.status === "SENT" && req.sentAt 
                              ? new Date(req.sentAt).toLocaleString() 
                              : new Date(req.scheduledAt).toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              req.status === "SENT" 
                                ? "bg-green-950/40 text-green-400" 
                                : req.status === "FAILED"
                                  ? "bg-red-950/40 text-red-400"
                                  : "bg-amber-950/40 text-amber-400"
                            }`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {req.status === "PENDING" && (
                              <button 
                                onClick={() => handleSendNow(req.id)}
                                className="px-2.5 py-1 bg-[#D4AF37] hover:bg-[#F7D070] text-[#111] font-bold uppercase tracking-wider text-[9px] rounded-lg transition-all"
                              >
                                Send Now
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
