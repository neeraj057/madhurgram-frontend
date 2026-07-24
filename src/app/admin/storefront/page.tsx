"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Save, Image as ImageIcon, Trash2, LayoutTemplate, RefreshCw } from "lucide-react";
import { showToast } from "@/components/ui/Toast";
import { API_ENDPOINTS } from "@/apis/api";
import { getAuthFetchOptions } from "@/utils/adminAuth";

export default function AdminStorefrontPage() {
  // Hero Display Manager states
  const [heroType, setHeroType] = useState("video");
  const [heroOfferTitle, setHeroOfferTitle] = useState("");
  const [heroOfferSubtitle, setHeroOfferSubtitle] = useState("");
  const [heroOfferLink, setHeroOfferLink] = useState("/#products");
  const [heroOfferCoupon, setHeroOfferCoupon] = useState("");
  const [heroCustomImageUrl, setHeroCustomImageUrl] = useState("");
  
  // Flash Sale Manager states
  const [flashSaleEnabled, setFlashSaleEnabled] = useState("false");
  const [flashSaleText, setFlashSaleText] = useState("");
  const [flashSaleEndTime, setFlashSaleEndTime] = useState("");
  const [flashSaleLink, setFlashSaleLink] = useState("/#products");
  const [flashSalePercentage, setFlashSalePercentage] = useState("15");
  const [flashSaleCategory, setFlashSaleCategory] = useState("shop-all");
  const [dbCategories, setDbCategories] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchStorefrontConfig = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.adminHeroConfig, getAuthFetchOptions());
      if (res.ok) {
        const data = await res.json();
        // Hero
        setHeroType(data.heroContentType || "video");
        setHeroOfferTitle(data.offerTitle || "");
        setHeroOfferSubtitle(data.offerSubtitle || "");
        setHeroOfferLink(data.offerLink || "/#products");
        setHeroOfferCoupon(data.offerCoupon || "");
        setHeroCustomImageUrl(data.customImageUrl || "");
        
        // Flash Sale
        setFlashSaleEnabled(data.flashSaleEnabled || "false");
        setFlashSaleText(data.flashSaleText || "Monsoon Wellness Sale: Get Flat 15% OFF on Premium Bilona Ghee");
        setFlashSaleEndTime(data.flashSaleEndTime || "");
        setFlashSaleLink(data.flashSaleLink || "/#products");
        setFlashSalePercentage(data.flashSalePercentage || "15");
        setFlashSaleCategory(data.flashSaleCategory || "shop-all");
      }
    } catch (e) {
      console.error("Error fetching storefront config:", e);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.adminCategories);
      if (res.ok) {
        const data = await res.json();
        setDbCategories(data);
      }
    } catch (e) {
      console.error("Error fetching categories:", e);
    }
  };

  useEffect(() => {
    fetchStorefrontConfig();
    fetchCategories();
  }, []);

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      const payload = {
        heroContentType: heroType,
        offerTitle: heroOfferTitle,
        offerSubtitle: heroOfferSubtitle,
        offerLink: heroOfferLink,
        offerCoupon: heroOfferCoupon,
        customImageUrl: heroCustomImageUrl,
        
        flashSaleEnabled,
        flashSaleText,
        flashSaleEndTime,
        flashSaleLink,
        flashSalePercentage,
        flashSaleCategory,
      };
      const res = await fetch(API_ENDPOINTS.updateHeroConfig, getAuthFetchOptions("PUT", JSON.stringify(payload), "application/json"));
      if (res.ok) {
        showToast("Storefront configuration updated live!", "success");
      } else {
        showToast("Failed to save configurations.", "error");
      }
    } catch (e) {
      console.error("Error saving storefront config:", e);
      showToast("Error updating storefront config.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAutoGenerateText = () => {
    let categoryName = "All Products";
    if (flashSaleCategory !== "shop-all") {
      // capitalize first letter
      categoryName = flashSaleCategory.charAt(0).toUpperCase() + flashSaleCategory.slice(1);
    }
    
    setFlashSaleText(`Grand Sale: Get Flat ${flashSalePercentage}% OFF on ${categoryName}!`);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file.", "error");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      showToast("File size exceeds 5MB limit. Please compress your image.", "error");
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(API_ENDPOINTS.adminMediaUpload, getAuthFetchOptions("POST", formData));

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setHeroCustomImageUrl(data.url);
          showToast("Custom banner image uploaded successfully!", "success");
        } else {
          showToast("Upload failed: No URL returned.", "error");
        }
      } else {
        showToast("Upload failed.", "error");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      showToast("Error uploading banner image.", "error");
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <LayoutTemplate className="h-7 w-7 text-[#D4AF37]" />
            Storefront & UI Settings
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Control the visual appearance of your homepage banners, flash sales, and categories.
          </p>
        </div>
        <button
          onClick={handleSaveConfig}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-2.5 text-sm font-bold text-black hover:bg-[#F7D070] transition-all disabled:opacity-50"
        >
          {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save Live Configuration"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Flash Sale Settings */}
        <div className="rounded-2xl border border-gray-800 bg-[#0a0a0a] p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37]" />
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#D4AF37]" />
            Flash Sale Timer Banner
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-3">Enable Banner</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFlashSaleEnabled("true")}
                  className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition-all ${
                    flashSaleEnabled === "true" 
                      ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]" 
                      : "border-gray-800 bg-[#111111] text-gray-400 hover:border-gray-600"
                  }`}
                >
                  🟢 Enabled (Live)
                </button>
                <button
                  type="button"
                  onClick={() => setFlashSaleEnabled("false")}
                  className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition-all ${
                    flashSaleEnabled === "false" 
                      ? "border-red-500 bg-red-500/10 text-red-500" 
                      : "border-gray-800 bg-[#111111] text-gray-400 hover:border-gray-600"
                  }`}
                >
                  🔴 Disabled (Hidden)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[9px] uppercase tracking-wider text-gray-500 font-bold">Banner Announcement Text</label>
                  <button 
                    type="button" 
                    onClick={handleAutoGenerateText}
                    className="text-[10px] text-[#D4AF37] hover:text-[#F7D070] font-bold flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="h-3 w-3" /> Auto-Fill
                  </button>
                </div>
                <input
                  type="text"
                  value={flashSaleText}
                  onChange={(e) => setFlashSaleText(e.target.value)}
                  placeholder="e.g. Monsoon Sale: 15% OFF"
                  className="w-full rounded-xl border border-gray-800 bg-[#111111] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-1">Target Route (On Click)</label>
                <input
                  type="text"
                  value={flashSaleLink}
                  onChange={(e) => setFlashSaleLink(e.target.value)}
                  placeholder="e.g. /#products"
                  className="w-full rounded-xl border border-gray-800 bg-[#111111] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-1">Target Audience (Category)</label>
                <select
                  value={flashSaleCategory}
                  onChange={(e) => setFlashSaleCategory(e.target.value)}
                  className="w-full rounded-xl border border-gray-800 bg-[#111111] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#D4AF37]"
                >
                  <option value="shop-all">All Products</option>
                  {dbCategories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-1">Discount Percentage (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={flashSalePercentage}
                  onChange={(e) => setFlashSalePercentage(e.target.value)}
                  placeholder="e.g. 20"
                  className="w-full rounded-xl border border-gray-800 bg-[#111111] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-1">Timer End Time (ISO 8601 Date)</label>
              <input
                type="text"
                value={flashSaleEndTime}
                onChange={(e) => setFlashSaleEndTime(e.target.value)}
                placeholder="e.g. 2026-07-30T12:00:00Z (Leave blank to use default rolling timer)"
                className="w-full rounded-xl border border-gray-800 bg-[#111111] px-3.5 py-2.5 text-sm font-mono text-gray-300 outline-none focus:border-[#D4AF37]"
              />
              <p className="mt-1 text-xs text-gray-500">Leave blank if you want the timer to auto-roll for demo purposes.</p>
            </div>
          </div>
        </div>

        {/* Hero Section Settings */}
        <div className="rounded-2xl border border-gray-800 bg-[#0a0a0a] p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-blue-500" />
            Dynamic Home Hero Configuration
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold mb-3">Active Content Slot Type</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["video", "image", "offer", "custom"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setHeroType(type)}
                    className={`rounded-xl border py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                      heroType === type 
                        ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]" 
                        : "border-gray-800 bg-[#111111] text-gray-500 hover:border-gray-600 hover:text-gray-300"
                    }`}
                  >
                    {type === "custom" ? "Custom Banner" : type}
                  </button>
                ))}
              </div>
            </div>

            {heroType === "offer" && (
              <div className="space-y-4 rounded-xl border border-gray-800 bg-[#111111] p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-1">Offer Title</label>
                    <input
                      type="text"
                      value={heroOfferTitle}
                      onChange={(e) => setHeroOfferTitle(e.target.value)}
                      placeholder="e.g. Mega Monsoon Sale"
                      className="w-full rounded-xl border border-gray-700 bg-black px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-1">Coupon Code</label>
                    <input
                      type="text"
                      value={heroOfferCoupon}
                      onChange={(e) => setHeroOfferCoupon(e.target.value)}
                      placeholder="e.g. GET15"
                      className="w-full rounded-xl border border-gray-700 bg-black px-3 py-2 text-xs text-[#D4AF37] font-bold outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-1">Subtitle Details</label>
                  <input
                    type="text"
                    value={heroOfferSubtitle}
                    onChange={(e) => setHeroOfferSubtitle(e.target.value)}
                    placeholder="e.g. Use code GET15 for 15% discount on all orders!"
                    className="w-full rounded-xl border border-gray-700 bg-black px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            )}

            {heroType === "custom" && (
              <div className="space-y-4 rounded-xl border border-gray-800 bg-[#111111] p-5">
                <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">🖼️ Upload Custom Hero Banner Image</label>
                {heroCustomImageUrl ? (
                  <div className="mt-4 relative group rounded-2xl overflow-hidden border border-gray-700 bg-black">
                    <img
                      src={heroCustomImageUrl}
                      alt="Active Custom Banner"
                      className="w-full h-32 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <label
                        htmlFor="file-upload-replace"
                        className="cursor-pointer bg-[#D4AF37] text-black px-4 py-2 text-[10px] uppercase font-bold tracking-widest rounded-lg hover:bg-white transition-colors"
                      >
                        {uploadingImage ? "Uploading..." : "Replace"}
                        <input
                          id="file-upload-replace"
                          name="file-upload-replace"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setHeroCustomImageUrl("")}
                        className="bg-red-500/80 text-white p-2 rounded-lg hover:bg-red-500 transition-colors"
                        title="Remove Banner"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-green-500/20 text-green-400 border border-green-500/30 text-[9px] uppercase font-bold tracking-widest px-2 py-1 rounded backdrop-blur-md flex items-center gap-1.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                      </span>
                      Live
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex justify-center rounded-2xl border border-dashed border-gray-700 px-6 py-8 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all">
                    <div className="text-center">
                      <Sparkles className="mx-auto h-8 w-8 text-gray-500" aria-hidden="true" />
                      <div className="mt-4 flex text-sm leading-6 text-gray-400 justify-center">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-semibold text-[#D4AF37] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#D4AF37] hover:text-white"
                        >
                          <span>{uploadingImage ? "Uploading..." : "Upload a file"}</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">PNG, JPG, WEBP up to 5MB (1920x800 recommended)</p>
                    </div>
                  </div>
                )}
                <div className="pt-2">
                  <label className="block text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-1 mt-4">Target Click Route</label>
                  <input
                    type="text"
                    value={heroOfferLink}
                    onChange={(e) => setHeroOfferLink(e.target.value)}
                    placeholder="e.g. /#products"
                    className="w-full rounded-xl border border-gray-700 bg-black px-3.5 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
