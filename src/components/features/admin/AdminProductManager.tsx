"use client";
import React, { useState } from "react";
import { Plus, Edit2, Trash2, Package, X } from "lucide-react";
import { Product, useAdminProducts } from "@/hooks/useAdminProducts";

// All numeric fields stored as strings to avoid 0-on-empty and leading-zero bugs
type ProductFormState = {
  id?: number;
  name: string;
  price: string;
  originalPrice: string;
  volume: string;
  imageUrl: string;
  stock: string;
  category: string;
  isActive: boolean;
  hsnCode: string;
};

const inputClass =
  "w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4AF37]/60 rounded-xl p-3 text-sm text-[#FDFBF7] placeholder-gray-700 focus:ring-1 focus:ring-[#D4AF37]/20 outline-none transition-all";

const labelClass = "text-[10px] text-gray-500 uppercase tracking-widest block mb-1.5 font-bold";

export const AdminProductManager = () => {
  const { products, loading, isSubmitting, saveProduct, deleteProduct } = useAdminProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const initialFormState: ProductFormState = {
    name: "",
    price: "",
    originalPrice: "",
    volume: "",
    imageUrl: "",
    stock: "",
    category: "",
    isActive: true,
    hsnCode: "",
  };
  const [formData, setFormData] = useState<ProductFormState>(initialFormState);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      id: product.id,
      name: product.name || "",
      price: product.price != null ? String(product.price) : "",
      originalPrice: product.originalPrice != null ? String(product.originalPrice) : "",
      volume: product.volume || "",
      imageUrl: product.imageUrl || "",
      stock: product.stock != null ? String(product.stock) : "",
      category: product.category || "",
      isActive: product.isActive ?? true,
      hsnCode: product.hsnCode || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData(initialFormState);
  };

  // Only allow digits and a single decimal dot
  const handleNumericInput = (val: string) =>
    val.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(formData.price);
    const stock = parseInt(formData.stock, 10);
    const originalPriceRaw = formData.originalPrice.trim();
    const originalPrice = originalPriceRaw !== "" ? parseFloat(originalPriceRaw) : null;

    if (isNaN(price) || price <= 0) return;
    if (isNaN(stock) || stock < 0) return;

    const productToSave: Product = {
      id: formData.id,
      name: formData.name,
      volume: formData.volume,
      imageUrl: formData.imageUrl,
      category: formData.category,
      isActive: formData.isActive,
      hsnCode: formData.hsnCode,
      price,
      stock,
      originalPrice: originalPrice != null && !isNaN(originalPrice) ? originalPrice : null,
    };
    const success = await saveProduct(productToSave);
    if (success) closeModal();
  };

  if (loading) return <p className="text-[#D4AF37] animate-pulse font-mono text-sm">Loading Catalog...</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#161616] p-4 rounded-xl border border-gray-800">
        <div className="flex items-center space-x-3">
          <Package className="h-5 w-5 text-[#D4AF37]" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-300">Product Catalog</h2>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 bg-[#D4AF37] text-[#111111] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#FDFBF7] transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#161616] border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-[#111111] text-[10px] uppercase tracking-widest text-gray-500 border-b border-gray-800">
            <tr>
              <th className="px-6 py-4">Product Info</th>
              <th className="px-6 py-4">Price / MRP</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-900/50 transition-colors">
                <td className="px-6 py-4 flex items-center space-x-4">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-10 w-10 object-cover rounded bg-black border border-gray-800"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-800 text-[10px] uppercase text-gray-400 border border-gray-700">
                      No img
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-[#FDFBF7]">{product.name}</p>
                    <p className="text-[10px] text-gray-500">
                      {product.category} • {product.volume}{product.hsnCode ? ` • HSN: ${product.hsnCode}` : ""}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-[#D4AF37] font-bold">₹{product.price}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <s className="text-[10px] text-gray-600 font-mono">₹{product.originalPrice}</s>
                      <span className="text-[9px] bg-amber-500/15 text-amber-400 border border-amber-500/25 px-1.5 py-0.5 rounded-full font-bold">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 font-mono">{product.stock} units</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${
                    product.isActive
                      ? "bg-green-500/10 border-green-500/25 text-green-400"
                      : "bg-red-500/10 border-red-500/25 text-red-400"
                  }`}>
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEditModal(product)} className="p-2 text-gray-500 hover:text-[#D4AF37] transition-colors cursor-pointer">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(product)} className="p-2 ml-2 text-gray-500 hover:text-red-500 transition-colors cursor-pointer">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 w-full max-w-xs shadow-2xl">
            <h3 className="text-white font-bold mb-2">Delete Product?</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Are you sure you want to delete <span className="text-[#D4AF37] font-bold">{deleteTarget.name}</span>? This action is permanent.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 border border-gray-800 text-gray-400 rounded-xl hover:bg-gray-900 cursor-pointer font-bold text-xs uppercase tracking-wider transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => { await deleteProduct(deleteTarget.id!); setDeleteTarget(null); }}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 cursor-pointer font-bold text-xs uppercase tracking-wider transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#111111] border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-800/60 shrink-0">
              <h3 className="text-lg font-serif font-bold text-[#D4AF37]">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 custom-scrollbar">
              <div className="px-6 py-5 space-y-4">

                {/* Product Name */}
                <div>
                  <label className={labelClass}>Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={inputClass}
                    placeholder="e.g. MadhurGram Pure Ghee (A2)"
                    required
                  />
                </div>

                {/* Volume */}
                <div>
                  <label className={labelClass}>Volume / Size</label>
                  <input
                    type="text"
                    value={formData.volume}
                    onChange={(e) => setFormData({...formData, volume: e.target.value})}
                    className={inputClass}
                    placeholder="e.g. 500ml, 1kg, 250g"
                  />
                </div>

                {/* Category + HSN */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className={inputClass}
                      placeholder="e.g. dairy"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>HSN / GST Code</label>
                    <select
                      value={formData.hsnCode}
                      onChange={(e) => setFormData({...formData, hsnCode: e.target.value})}
                      className={inputClass}
                    >
                      <option value="">Select HSN Code</option>
                      <option value="0405">0405 — Ghee (12%)</option>
                      <option value="1701">1701 — Sweeteners (5%)</option>
                      <option value="1512">1512 — Oils (5%)</option>
                      <option value="2001">2001 — Pickles (12%)</option>
                    </select>
                  </div>
                </div>

                {/* Selling Price + MRP */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Selling Price (₹)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: handleNumericInput(e.target.value)})}
                      className={inputClass}
                      placeholder="e.g. 649"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      MRP (₹) <span className="text-gray-700 normal-case font-normal">optional</span>
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({...formData, originalPrice: handleNumericInput(e.target.value)})}
                      className={inputClass}
                      placeholder="e.g. 799"
                    />
                  </div>
                </div>

                {/* Live Discount Preview */}
                {formData.originalPrice && formData.price &&
                  parseFloat(formData.originalPrice) > parseFloat(formData.price) && (
                  <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-2.5 flex items-center justify-between">
                    <span className="text-[11px] text-amber-400/80 font-medium">🏷 Discount Preview:</span>
                    <span className="text-amber-400 font-bold">
                      {Math.round(
                        ((parseFloat(formData.originalPrice) - parseFloat(formData.price)) /
                          parseFloat(formData.originalPrice)) * 100
                      )}% OFF
                    </span>
                  </div>
                )}

                {/* Stock */}
                <div>
                  <label className={labelClass}>Stock (Units)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value.replace(/\D/g, "")})}
                    className={inputClass}
                    placeholder="e.g. 100"
                    required
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className={labelClass}>Image URL</label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className={inputClass}
                    placeholder="/images/product.png"
                  />
                </div>

                {/* Active Toggle */}
                <div className="flex items-center space-x-3 bg-[#0d0d0d] border border-gray-800 rounded-xl p-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive ?? true}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-700 text-[#D4AF37] focus:ring-[#D4AF37] bg-[#161616] cursor-pointer"
                  />
                  <label htmlFor="isActive" className="text-xs text-gray-300 font-medium cursor-pointer select-none flex-1">
                    Product is Active
                    <span className="text-gray-600 ml-1">(visible on storefront)</span>
                  </label>
                </div>

              </div>

              {/* Footer Action Buttons */}
              <div className="flex space-x-3 px-6 pb-6 pt-3 border-t border-gray-800/60">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 border border-gray-800 text-gray-400 font-bold rounded-xl cursor-pointer hover:bg-gray-900/60 hover:text-white transition-all text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#D4AF37] text-[#111111] font-bold rounded-xl cursor-pointer hover:bg-[#FDFBF7] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-wider active:scale-95"
                >
                  {isSubmitting ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};