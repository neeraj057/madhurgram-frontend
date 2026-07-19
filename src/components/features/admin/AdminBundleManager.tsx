"use client";
import React, { useEffect, useState } from "react";
import { Plus, Package, Edit, Trash2, CheckCircle, XCircle, Settings } from "lucide-react";
import { apiClient } from "@/apis/apiClient";

interface BundleItem {
  productId: number;
  name: string;
  price: number;
  volume: string;
  imageUrl: string;
}

interface Bundle {
  id: number;
  tabName: string;
  name: string;
  description: string;
  discountPercent: number;
  active: boolean;
  displayOrder: number;
  originalPrice: number;
  bundlePrice: number;
  savings: number;
  items: BundleItem[];
}

export function AdminBundleManager() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [footerMode, setFooterMode] = useState<string>("BRAND_STORY");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  // Form State
  const [form, setForm] = useState({
    id: null as number | null,
    tabName: "",
    name: "",
    description: "",
    discountPercent: 10,
    productIds: [] as number[],
  });

  // Generator State
  const [generatorEngine, setGeneratorEngine] = useState<"RULE_BASED" | "AI">("RULE_BASED");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchData();
    fetchProducts();
  }, []);

  const fetchData = async () => {
    try {
      const bundleRes = await apiClient<Bundle[]>("/api/v1/admin/bundles", { requireAuth: true });
      setBundles(bundleRes || []);
      const modeRes = await apiClient<{ mode: string }>("/api/v1/admin/footer-mode", { requireAuth: true });
      setFooterMode(modeRes.mode || "BRAND_STORY");
    } catch (err) {
      console.error("Failed to fetch bundles:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await apiClient<any>("/api/v1/products?category=shop-all");
      setProducts(res.content || res || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const handleToggleMode = async (mode: string) => {
    try {
      await apiClient<{ mode: string }>("/api/v1/admin/footer-mode", { 
        method: "PUT",
        body: JSON.stringify({ mode }),
        requireAuth: true 
      });
      setFooterMode(mode);
    } catch (err) {
      alert("Failed to update footer mode");
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await apiClient(`/api/v1/admin/bundles/${id}/toggle`, { method: "PATCH", requireAuth: true });
      fetchData();
    } catch (err) {
      alert("Failed to toggle bundle status");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this bundle?")) {
      try {
        await apiClient(`/api/v1/admin/bundles/${id}`, { method: "DELETE", requireAuth: true });
        fetchData();
      } catch (err) {
        alert("Failed to delete bundle");
      }
    }
  };

  const openModal = (bundle?: Bundle) => {
    if (bundle) {
      setForm({
        id: bundle.id,
        tabName: bundle.tabName,
        name: bundle.name,
        description: bundle.description,
        discountPercent: bundle.discountPercent,
        productIds: bundle.items.map(i => i.productId),
      });
    } else {
      setForm({
        id: null,
        tabName: "",
        name: "",
        description: "",
        discountPercent: 10,
        productIds: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.productIds.length < 2) {
      alert("Please select at least 2 products for a bundle.");
      return;
    }

    try {
      if (form.id) {
        await apiClient(`/api/v1/admin/bundles/${form.id}`, { 
          method: "PUT",
          body: JSON.stringify(form),
          requireAuth: true 
        });
      } else {
        await apiClient("/api/v1/admin/bundles", { 
          method: "POST",
          body: JSON.stringify(form),
          requireAuth: true 
        });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert("Failed to save bundle");
    }
  };

  const handleGenerateCopy = async () => {
    if (form.productIds.length < 2) {
      alert("Please select at least 2 products first.");
      return;
    }
    
    setIsGenerating(true);
    try {
      const res = await apiClient<any>("/api/v1/admin/bundles/generate-copy", {
        method: "POST",
        body: JSON.stringify({
          productIds: form.productIds,
          engine: generatorEngine
        }),
        requireAuth: true
      });
      
      setForm(prev => ({
        ...prev,
        tabName: res.tabName || prev.tabName,
        name: res.name || prev.name,
        description: res.description || prev.description
      }));
    } catch (err) {
      alert("Failed to generate copy");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleProductSelection = (productId: number) => {
    setForm(prev => {
      const isSelected = prev.productIds.includes(productId);
      return {
        ...prev,
        productIds: isSelected 
          ? prev.productIds.filter(id => id !== productId)
          : [...prev.productIds, productId]
      };
    });
  };

  if (loading) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="space-y-8">
      {/* Settings Panel */}
      <div className="bg-[#1C1C1C] rounded-2xl p-6 border border-gray-800">
        <div className="flex items-center space-x-3 mb-6">
          <Settings className="w-5 h-5 text-[#D4AF37]" />
          <h2 className="text-lg font-bold text-white tracking-wide">Storefront Display Mode</h2>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => handleToggleMode("BRAND_STORY")}
            className={`flex-1 p-4 rounded-xl border-2 transition-all ${
              footerMode === "BRAND_STORY" 
                ? "bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]" 
                : "bg-black border-gray-800 text-gray-400 hover:border-gray-600"
            }`}
          >
            <div className="font-bold text-lg mb-1">Brand Story</div>
            <div className="text-xs opacity-70">Show heritage block (Premium feel, no discounts)</div>
          </button>
          <button
            onClick={() => handleToggleMode("COMBOS")}
            className={`flex-1 p-4 rounded-xl border-2 transition-all ${
              footerMode === "COMBOS" 
                ? "bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]" 
                : "bg-black border-gray-800 text-gray-400 hover:border-gray-600"
            }`}
          >
            <div className="font-bold text-lg mb-1">Combo Offers</div>
            <div className="text-xs opacity-70">Show active bundles with dynamic tabs</div>
          </button>
        </div>
      </div>

      {/* Bundles Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide flex items-center space-x-3">
            <Package className="w-6 h-6 text-[#D4AF37]" />
            <span>Combo Bundles</span>
          </h2>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-[#D4AF37] hover:bg-[#C5A028] text-black px-5 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Bundle</span>
        </button>
      </div>

      {/* Bundles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bundles.map(bundle => (
          <div key={bundle.id} className="bg-[#1C1C1C] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-[#D4AF37]/50 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="inline-block px-3 py-1 bg-black text-[#D4AF37] text-xs font-bold uppercase tracking-wider rounded-lg mb-2">
                  {bundle.tabName}
                </span>
                <h3 className="text-lg font-bold text-white">{bundle.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{bundle.description}</p>
              </div>
              <button 
                onClick={() => handleToggleActive(bundle.id)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold ${
                  bundle.active ? "bg-green-900/30 text-green-400 border border-green-800" : "bg-red-900/30 text-red-400 border border-red-800"
                }`}
              >
                {bundle.active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                <span>{bundle.active ? "ACTIVE" : "INACTIVE"}</span>
              </button>
            </div>

            <div className="bg-black rounded-xl p-4 mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Total MRP:</span>
                <span className="text-gray-400 line-through">₹{bundle.originalPrice}</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span className="text-[#D4AF37]">Bundle Price ({bundle.discountPercent}% Off):</span>
                <span className="text-[#D4AF37]">₹{bundle.bundlePrice}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {bundle.items.map(item => (
                <span key={item.productId} className="bg-gray-800 text-gray-300 text-xs px-2.5 py-1 rounded-md">
                  {item.name} ({item.volume})
                </span>
              ))}
            </div>

            <div className="flex space-x-3 border-t border-gray-800 pt-4">
              <button onClick={() => openModal(bundle)} className="flex-1 flex items-center justify-center space-x-2 text-gray-400 hover:text-white bg-gray-900 hover:bg-gray-800 py-2 rounded-xl text-sm transition-all">
                <Edit className="w-4 h-4" /> <span>Edit</span>
              </button>
              <button onClick={() => handleDelete(bundle.id)} className="flex-1 flex items-center justify-center space-x-2 text-red-500 hover:text-red-400 bg-red-950/20 hover:bg-red-900/30 py-2 rounded-xl text-sm transition-all border border-red-900/20">
                <Trash2 className="w-4 h-4" /> <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1C1C1C] border border-gray-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar p-8 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white">
              <XCircle className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-6">
              {form.id ? "Edit Bundle" : "Create New Bundle"}
            </h2>

            {/* Magic Auto-Fill Section */}
            <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center bg-black rounded-lg p-1 border border-gray-800">
                <button
                  type="button"
                  onClick={() => setGeneratorEngine("RULE_BASED")}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    generatorEngine === "RULE_BASED" ? "bg-gray-800 text-white" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  ⚙️ Rule-Based
                </button>
                <button
                  type="button"
                  onClick={() => setGeneratorEngine("AI")}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    generatorEngine === "AI" ? "bg-gray-800 text-[#D4AF37]" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  🧠 AI Powered
                </button>
              </div>
              
              <button
                type="button"
                onClick={handleGenerateCopy}
                disabled={form.productIds.length < 2 || isGenerating}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  form.productIds.length < 2 
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700" 
                    : "bg-[#D4AF37] text-black hover:bg-[#C5A028] shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                }`}
              >
                {isGenerating ? (
                  <span className="animate-pulse">✨ Thinking...</span>
                ) : (
                  <span>✨ Auto-Fill Copy</span>
                )}
              </button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Tab Name</label>
                  <input type="text" required value={form.tabName} onChange={e => setForm({...form, tabName: e.target.value})} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-all" placeholder="e.g. Rasoi Combo" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Discount %</label>
                  <input type="number" min="1" max="70" required value={form.discountPercent} onChange={e => setForm({...form, discountPercent: parseInt(e.target.value) || 0})} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Full Bundle Name</label>
                <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-all" placeholder="e.g. Complete Kitchen Combo" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description</label>
                <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-all h-24 resize-none" placeholder="Short description..." />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Select Products (Min 2)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto custom-scrollbar bg-black p-4 rounded-xl border border-gray-800">
                  {products.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => toggleProductSelection(p.id)}
                      className={`cursor-pointer p-3 rounded-lg border flex flex-col items-center text-center transition-all ${
                        form.productIds.includes(p.id) 
                          ? "bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]" 
                          : "bg-[#1C1C1C] border-gray-800 text-gray-400 hover:border-gray-600"
                      }`}
                    >
                      <img src={p.imageUrl} alt="" className="w-10 h-10 object-cover rounded-full mb-2 border border-gray-700" />
                      <span className="text-xs font-bold leading-tight">{p.name}</span>
                      <span className="text-[10px] mt-1 opacity-70">{p.volume} - ₹{p.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800 flex justify-end space-x-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl text-gray-400 hover:text-white font-bold text-sm transition-all">
                  Cancel
                </button>
                <button type="submit" className="bg-[#D4AF37] text-black px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#C5A028] transition-all">
                  Save Bundle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
