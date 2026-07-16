"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Sparkles, RefreshCw, Star } from "lucide-react";
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

  // Hero Display Manager states
  const [heroType, setHeroType] = useState("video");
  const [heroOfferTitle, setHeroOfferTitle] = useState("");
  const [heroOfferSubtitle, setHeroOfferSubtitle] = useState("");
  const [heroOfferLink, setHeroOfferLink] = useState("/#products");
  const [heroOfferCoupon, setHeroOfferCoupon] = useState("");
  const [heroSaving, setHeroSaving] = useState(false);

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

  const fetchHeroConfig = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.adminHeroConfig, getAuthFetchOptions());
      if (res.ok) {
        const data = await res.json();
        setHeroType(data.heroContentType || "video");
        setHeroOfferTitle(data.offerTitle || "");
        setHeroOfferSubtitle(data.offerSubtitle || "");
        setHeroOfferLink(data.offerLink || "/#products");
        setHeroOfferCoupon(data.offerCoupon || "");
      }
    } catch (e) {
      console.error("Error fetching hero config:", e);
    }
  };

  const handleSaveHeroConfig = async () => {
    setHeroSaving(true);
    try {
      const payload = {
        heroContentType: heroType,
        offerTitle: heroOfferTitle,
        offerSubtitle: heroOfferSubtitle,
        offerLink: heroOfferLink,
        offerCoupon: heroOfferCoupon,
      };
      const res = await fetch(API_ENDPOINTS.updateHeroConfig, getAuthFetchOptions("PUT", JSON.stringify(payload), "application/json"));
      if (res.ok) {
        showToast("Hero Section configuration updated live!", "success");
      } else {
        showToast("Failed to save hero configurations.", "error");
      }
    } catch (e) {
      console.error("Error saving hero config:", e);
      showToast("Error updating hero config.", "error");
    } finally {
      setHeroSaving(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchProducts();
    fetchReviewsQueue();
    fetchReviewConfig();
    fetchHeroConfig();
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

    {/* 🎬 HOME HERO MEDIA & CAMPAIGN CONTROLLER BOARD */}
    <section className="rounded-3xl border border-gray-800 bg-[#161616] p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-800 pb-5 mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#D4AF37]" />
            Dynamic Home Hero Configuration Board
          </h2>
          <p className="text-sm text-gray-400">Choose between cinematic video background, Gopiganj ghee purity image, or custom deal banner templates.</p>
        </div>
        <button
          onClick={handleSaveHeroConfig}
          disabled={heroSaving}
          className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#F7D070] text-[#11] hover:text-[#111] text-xs font-bold uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
        >
          {heroSaving ? "Saving Config..." : "Save Live Configuration"}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left side: Toggles */}
        <div className="space-y-4">
          <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">Active Content Slot Type</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "video", label: "Cinematic Video" },
              { value: "image", label: "Purity HD Image" },
              { value: "offer", label: "Offers Card Banner" }
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setHeroType(opt.value)}
                className={`py-3 px-4 rounded-xl border text-center transition-all cursor-pointer text-xs uppercase font-bold tracking-wider ${
                  heroType === opt.value
                    ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                    : "border-gray-800 bg-[#111] hover:border-gray-700 text-gray-400"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            {heroType === 'video' && "Shows the background video loops for Gopiganj handcrafted goods."}
            {heroType === 'image' && "Shows the generated ultra HD wood table ghee purity background image."}
            {heroType === 'offer' && "Displays a custom promotional card layout over the sweets deal background image."}
          </p>
        </div>

        {/* Right side: Offer tags input */}
        <div className="space-y-4 border-t md:border-t-0 md:border-l border-gray-800/80 pt-4 md:pt-0 md:pl-6">
          <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">Offer Banner Details (Only for Offers Slot)</label>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-1">Headline Title</label>
              <input
                type="text"
                value={heroOfferTitle}
                onChange={(e) => setHeroOfferTitle(e.target.value)}
                placeholder="e.g. Inaugural Swadeshi Offer"
                className="w-full rounded-xl border border-gray-800 bg-[#111111] px-3.5 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-1">Voucher Coupon Code</label>
              <input
                type="text"
                value={heroOfferCoupon}
                onChange={(e) => setHeroOfferCoupon(e.target.value)}
                placeholder="e.g. GOPIGANJ10"
                className="w-full rounded-xl border border-gray-800 bg-[#111111] px-3.5 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
          <div>
            <label className="block text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-1">Detailed description</label>
            <input
              type="text"
              value={heroOfferSubtitle}
              onChange={(e) => setHeroOfferSubtitle(e.target.value)}
              placeholder="e.g. Get 10% Flat discount on Ghee and Oils today"
              className="w-full rounded-xl border border-gray-800 bg-[#111111] px-3.5 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
            />
          </div>
          <div>
            <label className="block text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-1">Action Button Redirection URL</label>
            <input
              type="text"
              value={heroOfferLink}
              onChange={(e) => setHeroOfferLink(e.target.value)}
              placeholder="e.g. /#products"
              className="w-full rounded-xl border border-gray-800 bg-[#111111] px-3.5 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
            />
          </div>
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
