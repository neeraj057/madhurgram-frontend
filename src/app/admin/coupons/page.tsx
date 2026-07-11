"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Ticket, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { API_ENDPOINTS } from "@/apis/api";
import { getAuthFetchOptions, parseApiError, handleAuthError } from "@/utils/adminAuth";
import { showToast } from "@/components/ui/Toast";

interface Coupon {
  id?: number;
  code: string;
  discountPercentage: number;
  minOrderValue: number;
  isActive: boolean;
  maxUsagePerUser: number;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);

  // Form states
  const initialFormState: Coupon = {
    code: "",
    discountPercentage: 10,
    minOrderValue: 999,
    isActive: true,
    maxUsagePerUser: 1,
  };
  const [formData, setFormData] = useState<Coupon>(initialFormState);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.adminCoupons, getAuthFetchOptions("GET"));
      const isUnauthorized = await handleAuthError(response);
      if (isUnauthorized) return;

      if (!response.ok) {
        throw new Error(await parseApiError(response));
      }
      const data = await response.json();
      setCoupons(data);
    } catch (err) {
      console.error("Failed to load coupons:", err);
      showToast(err instanceof Error ? err.message : "Failed to load coupons", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openAddModal = () => {
    setEditingCoupon(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData(coupon);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) return;

    setIsSubmitting(true);
    try {
      const url = editingCoupon && editingCoupon.id
        ? API_ENDPOINTS.adminCouponById(editingCoupon.id)
        : API_ENDPOINTS.adminCoupons;
      
      const method = editingCoupon ? "PUT" : "POST";
      const payload = {
        ...formData,
        code: formData.code.trim().toUpperCase(),
      };

      const response = await fetch(url, getAuthFetchOptions(method, JSON.stringify(payload), "application/json"));
      const isUnauthorized = await handleAuthError(response);
      if (isUnauthorized) return;

      if (!response.ok) {
        throw new Error(await parseApiError(response));
      }

      showToast(
        editingCoupon 
          ? `Coupon ${payload.code} updated successfully!` 
          : `Coupon ${payload.code} created successfully!`,
        "success"
      );
      setIsModalOpen(false);
      fetchCoupons();
    } catch (err) {
      console.error("Failed to save coupon:", err);
      showToast(err instanceof Error ? err.message : "Failed to save coupon", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    if (!coupon.id) return;
    try {
      const updated = { ...coupon, isActive: !coupon.isActive };
      const response = await fetch(
        API_ENDPOINTS.adminCouponById(coupon.id),
        getAuthFetchOptions("PUT", JSON.stringify(updated), "application/json")
      );
      const isUnauthorized = await handleAuthError(response);
      if (isUnauthorized) return;

      if (!response.ok) {
        throw new Error(await parseApiError(response));
      }

      showToast(`Coupon status updated.`, "success");
      fetchCoupons();
    } catch (err) {
      console.error("Failed to toggle coupon status:", err);
      showToast(err instanceof Error ? err.message : "Failed to update status", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !deleteTarget.id) return;
    try {
      const response = await fetch(
        API_ENDPOINTS.adminCouponById(deleteTarget.id),
        getAuthFetchOptions("DELETE")
      );
      const isUnauthorized = await handleAuthError(response);
      if (isUnauthorized) return;

      if (!response.ok) {
        throw new Error(await parseApiError(response));
      }

      showToast(`Coupon deleted successfully.`, "success");
      setDeleteTarget(null);
      fetchCoupons();
    } catch (err) {
      console.error("Failed to delete coupon:", err);
      showToast(err instanceof Error ? err.message : "Failed to delete coupon", "error");
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-10 flex flex-col justify-center items-center h-48 space-y-4">
        <Loader2 className="h-6 w-6 text-[#D4AF37] animate-spin" />
        <p className="text-[#D4AF37] font-mono text-xs tracking-widest uppercase">Loading Coupons...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#D4AF37] tracking-wide">
          Manage Coupons
        </h1>
        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
          Configure Promotion Rules, Discounts, and Order Thresholds
        </p>
      </div>

      {/* Control Banner */}
      <div className="flex justify-between items-center bg-[#161616] p-4 rounded-xl border border-gray-800">
        <div className="flex items-center space-x-3">
          <Ticket className="h-5 w-5 text-[#D4AF37]" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-300">Active Promo Rules</h2>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 bg-[#D4AF37] text-[#111111] px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#FDFBF7] transition-all cursor-pointer active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      {coupons.length > 0 ? (
        <div className="bg-[#161616] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-[#111111] text-[10px] uppercase tracking-widest text-gray-500 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Min order Value</th>
                <th className="px-6 py-4">Max usage/User</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-900/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-[#FDFBF7] text-base">{coupon.code}</td>
                  <td className="px-6 py-4 font-semibold text-amber-500 font-mono">{coupon.discountPercentage}% OFF</td>
                  <td className="px-6 py-4 font-mono">₹{coupon.minOrderValue.toFixed(2)}</td>
                  <td className="px-6 py-4 font-mono">{coupon.maxUsagePerUser} Time</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(coupon)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                        coupon.isActive
                          ? "bg-green-500/10 border-green-500/25 text-green-400"
                          : "bg-red-500/10 border-red-500/25 text-red-400"
                      }`}
                    >
                      {coupon.isActive ? (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" />
                          <span>Inactive</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => openEditModal(coupon)} 
                      className="p-2 text-gray-500 hover:text-[#D4AF37] cursor-pointer"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setDeleteTarget(coupon)} 
                      className="p-2 ml-2 text-gray-500 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-[#161616]/40 border border-gray-800 p-12 text-center rounded-2xl">
          <Ticket className="h-10 w-10 text-gray-600 mx-auto mb-4" />
          <h4 className="text-gray-400 font-bold uppercase tracking-widest text-sm">No Coupons Created</h4>
          <p className="text-xs text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
            Click the "Create Coupon" button above to configure your first active e-commerce discount code rule!
          </p>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 w-full max-w-xs shadow-2xl animate-scaleIn">
            <h3 className="text-white font-bold mb-2">Delete Coupon?</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Are you sure you want to delete coupon <span className="text-[#D4AF37] font-bold font-mono">{deleteTarget.code}</span>? Customers will no longer be able to apply it.
            </p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setDeleteTarget(null)} 
                className="flex-1 py-2.5 border border-gray-800 text-gray-400 rounded-lg hover:bg-gray-900 cursor-pointer font-bold text-xs uppercase tracking-wider"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete} 
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer font-bold text-xs uppercase tracking-wider"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-bold text-[#D4AF37] mb-4 font-serif">
              {editingCoupon ? "Edit Coupon Settings" : "Create New Coupon"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Coupon Code</label>
                <input 
                  type="text" 
                  disabled={!!editingCoupon}
                  value={formData.code || ""} 
                  onChange={(e) => setFormData({...formData, code: e.target.value.replace(/[^a-zA-Z0-9]/g, "")})} 
                  className="w-full bg-[#161616] border border-gray-800 focus:border-[#D4AF37]/50 rounded-lg p-2.5 text-white disabled:opacity-50 font-mono uppercase focus:outline-none" 
                  placeholder="e.g. PURE10" 
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Discount Percentage (%)</label>
                <input 
                  type="number" 
                  min="0.01"
                  max="100"
                  step="0.01"
                  value={formData.discountPercentage ?? ""} 
                  onChange={(e) => setFormData({...formData, discountPercentage: parseFloat(e.target.value) || 0})} 
                  className="w-full bg-[#161616] border border-gray-800 focus:border-[#D4AF37]/50 rounded-lg p-2.5 text-white focus:outline-none font-mono" 
                  placeholder="e.g. 10.00" 
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Minimum Order Value (₹)</label>
                <input 
                  type="number" 
                  min="0"
                  step="0.01"
                  value={formData.minOrderValue ?? ""} 
                  onChange={(e) => setFormData({...formData, minOrderValue: parseFloat(e.target.value) || 0})} 
                  className="w-full bg-[#161616] border border-gray-800 focus:border-[#D4AF37]/50 rounded-lg p-2.5 text-white focus:outline-none font-mono" 
                  placeholder="e.g. 999.00" 
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Max Usage Limit Per Customer</label>
                <input 
                  type="number" 
                  min="1"
                  value={formData.maxUsagePerUser ?? 1} 
                  onChange={(e) => setFormData({...formData, maxUsagePerUser: parseInt(e.target.value) || 1})} 
                  className="w-full bg-[#161616] border border-gray-800 focus:border-[#D4AF37]/50 rounded-lg p-2.5 text-white focus:outline-none font-mono" 
                  placeholder="e.g. 1" 
                  required
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-gray-800 text-gray-400 font-bold rounded-lg cursor-pointer hover:bg-gray-900/50 transition-all font-mono text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#D4AF37] text-[#111111] font-bold rounded-lg cursor-pointer hover:bg-[#FDFBF7] transition-all disabled:opacity-50 font-mono text-xs uppercase tracking-wider"
                >
                  {isSubmitting ? "Saving..." : "Save Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
