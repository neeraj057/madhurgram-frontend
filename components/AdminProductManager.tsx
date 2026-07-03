import React, { useState } from "react";
import { Plus, Edit2, Package, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Product } from "../app/hooks/useAdminProducts"; // पाथ अपने हिसाब से एडजस्ट कर लेना

interface AdminProductManagerProps {
  products: Product[];
  loading: boolean;
  isSubmitting: boolean;
  onSave: (product: Product) => Promise<boolean>;
}

export const AdminProductManager: React.FC<AdminProductManagerProps> = ({
  products,
  loading,
  isSubmitting,
  onSave,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // 🚀 फिक्स 1: 0 की जगह खाली डिब्बा (Empty State) और Category ऐड कर दी
  const initialFormState: Product = {
    name: "",
    price: "" as any,
    volume: "",
    imageUrl: "",
    stock: "" as any,
    category: "",
    isActive: true,
  };
  const [formData, setFormData] = useState<Product>(initialFormState);

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
    const success = await onSave(formData);
    if (success) setIsModalOpen(false);
  };

  if (loading) return <p className="text-[#D4AF37] animate-pulse font-mono text-sm">Loading Catalog...</p>;

  return (
    <div className="space-y-6">
      {/* 🎛️ Header & Add Button */}
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

      {/* 📊 Product Table */}
      <div className="bg-[#161616] border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
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
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-600 font-light">
                    No products found in the catalog.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-900/50 transition-colors">
                    <td className="px-6 py-4 flex items-center space-x-4">
                      <img src={product.imageUrl} alt={product.name} className="h-10 w-10 object-cover rounded bg-black border border-gray-800" onError={(e) => { e.currentTarget.src = "https://placehold.co/100x100/111/444?text=MG"; }} />
                      <div>
                        <p className="font-bold text-[#FDFBF7]">{product.name}</p>
                        {/* 🚀 फिक्स: यहाँ Category भी दिखा रहे हैं */}
                        <p className="text-[10px] text-gray-500">{product.category} • {product.volume}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-[#D4AF37]">₹{product.price}</td>
                    <td className="px-6 py-4">
                      <span className={`font-mono px-2 py-1 rounded text-xs ${product.stock <= 5 ? "bg-red-900/20 text-red-400 border border-red-900/30" : "text-gray-300"}`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.isActive ? (
                        <span className="flex items-center text-green-400 text-xs"><CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Active</span>
                      ) : (
                        <span className="flex items-center text-red-400 text-xs"><XCircle className="h-3.5 w-3.5 mr-1" /> Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEditModal(product)} className="p-2 text-gray-500 hover:text-[#D4AF37] transition-colors border border-transparent hover:border-[#D4AF37]/30 rounded-lg">
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📝 Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
              <h3 className="text-lg font-serif font-bold text-[#D4AF37]">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Product Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#161616] border border-gray-800 rounded-lg p-2.5 text-sm text-white outline-none focus:border-[#D4AF37]" placeholder="e.g. Premium Ashwagandha Root" />
              </div>

              {/* 🚀 फिक्स: Category का नया इनपुट */}
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Category</label>
                <input required type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-[#161616] border border-gray-800 rounded-lg p-2.5 text-sm text-white outline-none focus:border-[#D4AF37]" placeholder="e.g. Medicinal Plants" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* 🚀 फिक्स 2: onChange में e.target.value === "" चेक और Tailwind से एरो छुपाए */}
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Price (₹)</label>
                  <input 
                    required 
                    type="number" 
                    min="0" 
                    value={formData.price} 
                    onChange={(e) => setFormData({ ...formData, price: e.target.value === "" ? ("" as any) : Number(e.target.value) })} 
                    className="w-full bg-[#161616] border border-gray-800 rounded-lg p-2.5 text-sm font-mono text-white outline-none focus:border-[#D4AF37] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Stock Units</label>
                  <input 
                    required 
                    type="number" 
                    min="0" 
                    value={formData.stock} 
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value === "" ? ("" as any) : Number(e.target.value) })} 
                    className="w-full bg-[#161616] border border-gray-800 rounded-lg p-2.5 text-sm font-mono text-white outline-none focus:border-[#D4AF37] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Volume/Size</label>
                <input required type="text" value={formData.volume} onChange={(e) => setFormData({ ...formData, volume: e.target.value })} className="w-full bg-[#161616] border border-gray-800 rounded-lg p-2.5 text-sm text-white outline-none focus:border-[#D4AF37]" placeholder="e.g. 500g / 1L" />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Image URL</label>
                <input required type="text" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full bg-[#161616] border border-gray-800 rounded-lg p-2.5 text-sm text-white outline-none focus:border-[#D4AF37]" placeholder="https://..." />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 accent-[#D4AF37] bg-[#161616] border-gray-800 rounded" />
                <label htmlFor="isActive" className="text-sm text-gray-300">Product is Active (Visible on Store)</label>
              </div>

              <div className="border-t border-gray-800 pt-4 mt-6 flex space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-gray-800 text-gray-400 rounded-lg text-xs uppercase tracking-wider hover:bg-gray-900">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-[#D4AF37] text-[#111111] font-bold rounded-lg text-xs uppercase tracking-wider hover:bg-[#FDFBF7] flex justify-center items-center">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingProduct ? "Update Product" : "Save Product")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};