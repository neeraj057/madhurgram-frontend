"use client";
import React, { useState } from "react";
import { Plus, Edit2, Trash2, Package } from "lucide-react";
import { Product, useAdminProducts } from "@/hooks/useAdminProducts";

type ProductFormState = Omit<Product, 'price' | 'stock'> & {
  price: string | number;
  stock: string | number;
};

export const AdminProductManager = () => {
  const { products, loading, isSubmitting, saveProduct, deleteProduct } = useAdminProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const initialFormState: ProductFormState = {
    name: "",
    price: "",
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
    setFormData(product);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productToSave: Product = {
      ...formData,
      price: typeof formData.price === 'string' ? parseFloat(formData.price) || 0 : formData.price,
      stock: typeof formData.stock === 'string' ? parseInt(formData.stock, 10) || 0 : formData.stock,
    };
    const success = await saveProduct(productToSave);
    if (success) setIsModalOpen(false);
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
          className="flex items-center space-x-2 bg-[#D4AF37] text-[#111111] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#FDFBF7] transition-all"
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
              <th className="px-6 py-4">Price</th>
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
                      No image
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-[#FDFBF7]">{product.name}</p>
                    <p className="text-[10px] text-gray-500">
                      {product.category} • {product.volume} {product.hsnCode ? `• HSN: ${product.hsnCode}` : ""}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-[#D4AF37]">₹{product.price}</td>
                <td className="px-6 py-4 font-mono">{product.stock} units</td>
                <td className="px-6 py-4 text-xs">{product.isActive ? "Active" : "Inactive"}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEditModal(product)} className="p-2 text-gray-500 hover:text-[#D4AF37]"><Edit2 className="h-4 w-4" /></button>
                  <button onClick={() => setDeleteTarget(product)} className="p-2 ml-2 text-gray-500 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
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
            <h3 className="text-white font-bold mb-2">Delete Product?</h3>
            <p className="text-gray-400 text-sm mb-6">Are you sure you want to delete <span className="text-[#D4AF37]">{deleteTarget.name}</span>? This action is permanent.</p>
            <div className="flex space-x-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 border border-gray-800 text-gray-400 rounded-lg hover:bg-gray-900">Cancel</button>
              <button onClick={async () => { await deleteProduct(deleteTarget.id!); setDeleteTarget(null); }} className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Add Modal (Keep this as it was in your previous version) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-[#D4AF37] mb-4">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" value={formData.name || ""} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#161616] border border-gray-800 rounded-lg p-2.5 text-white" placeholder="Product Name" />
              <input type="text" value={formData.volume || ""} onChange={(e) => setFormData({...formData, volume: e.target.value})} className="w-full bg-[#161616] border border-gray-800 rounded-lg p-2.5 text-white" placeholder="Volume (e.g. 500ml, 1kg)" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={formData.category || ""} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-[#161616] border border-gray-800 rounded-lg p-2.5 text-white" placeholder="Category" />
                <select 
                  value={formData.hsnCode || ""} 
                  onChange={(e) => setFormData({...formData, hsnCode: e.target.value})} 
                  className="w-full bg-[#161616] border border-gray-800 rounded-lg p-2.5 text-white"
                >
                  <option value="">Select HSN / GST Code</option>
                  <option value="0405">0405 - Ghee (12% GST)</option>
                  <option value="1701">1701 - Sweeteners (5% GST)</option>
                  <option value="1512">1512 - Oils (5% GST)</option>
                  <option value="2001">2001 - Pickles (12% GST)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" value={formData.price ?? ""} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-[#161616] border border-gray-800 rounded-lg p-2.5 text-white" placeholder="Price" />
                <input type="number" value={formData.stock ?? ""} onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})} className="w-full bg-[#161616] border border-gray-800 rounded-lg p-2.5 text-white" placeholder="Stock" />
              </div>
              <input type="text" value={formData.imageUrl || ""} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-[#161616] border border-gray-800 rounded-lg p-2.5 text-white" placeholder="Image URL" />
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={formData.isActive ?? true} 
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})} 
                  className="h-4 w-4 rounded border-gray-800 text-[#D4AF37] focus:ring-[#D4AF37] bg-[#161616]" 
                />
                <label htmlFor="isActive" className="text-xs text-gray-400 font-medium cursor-pointer">Product is Active</label>
              </div>
              <button type="submit" className="w-full py-3 bg-[#D4AF37] text-[#111111] font-bold rounded-lg">{isSubmitting ? "Saving..." : "Save Product"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};