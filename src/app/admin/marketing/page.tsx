"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Sparkles, RefreshCw } from "lucide-react";
import { useAdminMarketing, BroadcastCampaignRequest } from "@/hooks/useAdminMarketing";
import { useAdminProducts } from "@/hooks/useAdminProducts";

export default function AdminMarketingPage() {
  const { campaigns, loading, submitting, error, fetchCampaigns, createCampaign } = useAdminMarketing();
  const { products, fetchProducts } = useAdminProducts();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetSegment, setTargetSegment] = useState("oil buyers");
  const [productId, setProductId] = useState<number | null>(null);
  const [productKeyword, setProductKeyword] = useState("oil");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
    fetchProducts();
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
      </div>
    </main>
  );
}
