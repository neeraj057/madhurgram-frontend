"use client";
import React, { useState } from "react";
import { Plus, Edit2, Trash2, Percent, ShieldAlert } from "lucide-react";
import { useAdminTax, TaxSlab } from "@/hooks/useAdminTax";

export default function AdminTaxSettingsPage() {
  const { taxSlabs, loading, isSubmitting, saveTaxSlab, deleteTaxSlab } = useAdminTax();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlab, setEditingSlab] = useState<TaxSlab | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TaxSlab | null>(null);

  const initialFormState: TaxSlab = {
    hsnCode: "",
    description: "",
    gstRate: 5,
  };
  const [formData, setFormData] = useState<TaxSlab>(initialFormState);

  const openAddModal = () => {
    setEditingSlab(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (slab: TaxSlab) => {
    setEditingSlab(slab);
    setFormData(slab);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.hsnCode || !formData.description) return;
    const success = await saveTaxSlab(formData, !!editingSlab);
    if (success) setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="p-6 md:p-10">
        <p className="text-[#D4AF37] animate-pulse font-mono text-sm">Loading Tax Settings...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#D4AF37] tracking-wide">
          Tax Rules Control
        </h1>
        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
          Configure HSN Slabs & Government GST Percentages
        </p>
      </div>

      {/* Control Banner */}
      <div className="flex justify-between items-center bg-[#161616] p-4 rounded-xl border border-gray-800">
        <div className="flex items-center space-x-3">
          <Percent className="h-5 w-5 text-[#D4AF37]" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-300">GST Categories Mapping</h2>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 bg-[#D4AF37] text-[#111111] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#FDFBF7] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Tax Slab</span>
        </button>
      </div>

      {/* Tax Table */}
      <div className="bg-[#161616] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-[#111111] text-[10px] uppercase tracking-widest text-gray-500 border-b border-gray-800">
            <tr>
              <th className="px-6 py-4">HSN Code</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">GST Rate</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {taxSlabs.map((slab) => (
              <tr key={slab.hsnCode} className="hover:bg-gray-900/50 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-[#FDFBF7]">{slab.hsnCode}</td>
                <td className="px-6 py-4 text-gray-300">{slab.description}</td>
                <td className="px-6 py-4 font-mono text-[#D4AF37] font-semibold">{slab.gstRate}%</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => openEditModal(slab)} 
                    className="p-2 text-gray-500 hover:text-[#D4AF37] cursor-pointer"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => setDeleteTarget(slab)} 
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

      {/* Custom Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 w-full max-w-xs shadow-2xl">
            <h3 className="text-white font-bold mb-2">Delete Tax Slab?</h3>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to delete HSN <span className="text-[#D4AF37]">{deleteTarget.hsnCode}</span>? Products linked to this HSN might fail tax calculations.
            </p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setDeleteTarget(null)} 
                className="flex-1 py-2 border border-gray-800 text-gray-400 rounded-lg hover:bg-gray-900 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={async () => { await deleteTaxSlab(deleteTarget.hsnCode); setDeleteTarget(null); }} 
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-[#D4AF37] mb-4">
              {editingSlab ? "Edit Tax Slab" : "Add New Tax Slab"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">HSN Code</label>
                <input 
                  type="text" 
                  disabled={!!editingSlab}
                  value={formData.hsnCode || ""} 
                  onChange={(e) => setFormData({...formData, hsnCode: e.target.value})} 
                  className="w-full bg-[#161616] border border-gray-800 rounded-lg p-2.5 text-white disabled:opacity-50" 
                  placeholder="e.g. 0405" 
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Description</label>
                <input 
                  type="text" 
                  value={formData.description || ""} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  className="w-full bg-[#161616] border border-gray-800 rounded-lg p-2.5 text-white" 
                  placeholder="e.g. Ghee and Dairy Products" 
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">GST Percentage (%)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.gstRate ?? ""} 
                  onChange={(e) => setFormData({...formData, gstRate: parseFloat(e.target.value) || 0})} 
                  className="w-full bg-[#161616] border border-gray-800 rounded-lg p-2.5 text-white" 
                  placeholder="e.g. 12" 
                  required
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-gray-800 text-gray-400 font-bold rounded-lg cursor-pointer hover:bg-gray-900/50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#D4AF37] text-[#111111] font-bold rounded-lg cursor-pointer hover:bg-[#FDFBF7] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Slab"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
