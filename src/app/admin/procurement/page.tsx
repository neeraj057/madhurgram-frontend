"use client";
import React, { useState, useEffect } from "react";
import { ClipboardList, Mail, CheckCircle2, AlertTriangle, Edit2, Check } from "lucide-react";
import { API_ENDPOINTS } from "@/apis/api";
import { getAuthFetchOptions, handleAuthError } from "@/utils/adminAuth";
import { showToast } from "@/components/ui/Toast";

interface PurchaseOrder {
  id: number;
  product: {
    id: number;
    name: string;
    volume: string;
    stock: number;
  };
  quantity: number;
  supplierName: string;
  supplierEmail: string;
  status: "DRAFT" | "APPROVED";
  createdAt: string;
  approvedAt: string | null;
}

export default function AdminProcurementPage() {
  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPoId, setEditingPoId] = useState<number | null>(null);
  const [editQty, setEditQty] = useState<number>(0);
  const [editSupplierName, setEditSupplierName] = useState<string>("");
  const [editSupplierEmail, setEditSupplierEmail] = useState<string>("");
  const [actioningId, setActioningId] = useState<number | null>(null);

  const fetchPOs = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.adminProcurementPOs, getAuthFetchOptions());
      if (await handleAuthError(res)) return;
      if (res.ok) {
        const data = await res.json();
        setPos(data);
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to fetch Purchase Orders.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPOs();
  }, []);

  const handleEditClick = (po: PurchaseOrder) => {
    setEditingPoId(po.id);
    setEditQty(po.quantity);
    setEditSupplierName(po.supplierName);
    setEditSupplierEmail(po.supplierEmail);
  };

  const handleSaveClick = async (id: number) => {
    setActioningId(id);
    try {
      const url = `${API_ENDPOINTS.adminProcurementPOs}/${id}?quantity=${editQty}&supplierName=${encodeURIComponent(editSupplierName)}&supplierEmail=${encodeURIComponent(editSupplierEmail)}`;
      const res = await fetch(url, getAuthFetchOptions("PUT"));
      if (await handleAuthError(res)) return;
      if (res.ok) {
        showToast("Purchase Order updated.", "success");
        setEditingPoId(null);
        fetchPOs();
      } else {
        showToast("Failed to update PO.", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Error updating PO.", "error");
    } finally {
      setActioningId(null);
    }
  };

  const handleApproveClick = async (id: number) => {
    setActioningId(id);
    try {
      const res = await fetch(API_ENDPOINTS.adminProcurementApprovePO(id), getAuthFetchOptions("POST"));
      if (await handleAuthError(res)) return;
      if (res.ok) {
        showToast("Purchase Order Approved! Vendor notified.", "success");
        fetchPOs();
      } else {
        showToast("Failed to approve PO.", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Error approving PO.", "error");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#D4AF37] tracking-wide flex items-center gap-3">
          <ClipboardList className="h-8 w-8 text-[#D4AF37]" />
          Inventory Restock Control
        </h1>
        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
          Automated Low-Stock Purchase Orders & Raw Material Supply Chain
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[#D4AF37] animate-pulse font-mono">
          Loading Procurement Records...
        </div>
      ) : (
        <div className="bg-[#161616] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-900/40">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300">Procurement Queue</h2>
            <button 
              onClick={fetchPOs}
              className="text-xs text-[#D4AF37] border border-[#D4AF37]/20 hover:bg-[#D4AF37]/10 px-3 py-1.5 rounded-lg transition-all"
            >
              Refresh Table
            </button>
          </div>

          <div className="overflow-x-auto">
            {pos.length === 0 ? (
              <div className="p-12 text-center text-gray-500 font-light">
                No Purchase Orders drafted or pending restock. Low-stock triggers will automatically queue drafts here.
              </div>
            ) : (
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-[#0e0e0e] text-[10px] uppercase text-gray-500 font-bold tracking-wider border-b border-gray-800">
                  <tr>
                    <th className="px-6 py-4">PO Ref</th>
                    <th className="px-6 py-4">Product Details</th>
                    <th className="px-6 py-4">Current Stock</th>
                    <th className="px-6 py-4">Reorder Qty</th>
                    <th className="px-6 py-4">Supplier Settings</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {pos.map((po) => {
                    const isEditing = editingPoId === po.id;
                    const isDraft = po.status === "DRAFT";

                    return (
                      <tr key={po.id} className="hover:bg-gray-900/25 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-[#FDFBF7]">
                          PO-{String(po.id).padStart(5, "0")}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-[#FDFBF7]">{po.product.name}</p>
                          <p className="text-[10px] text-gray-500">{po.product.volume}</p>
                        </td>
                        <td className="px-6 py-4 font-mono text-center">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            po.product.stock <= 5 ? "bg-red-950/40 text-red-400 border border-red-900/40" : "text-gray-400"
                          }`}>
                            {po.product.stock} units
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono">
                          {isEditing ? (
                            <input 
                              type="number"
                              value={editQty}
                              onChange={(e) => setEditQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                              className="w-20 bg-black border border-gray-800 rounded-lg p-1.5 text-center text-white"
                            />
                          ) : (
                            <span className="font-bold text-[#D4AF37]">{po.quantity}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs space-y-1">
                          {isEditing ? (
                            <div className="space-y-1.5">
                              <input 
                                type="text"
                                value={editSupplierName}
                                onChange={(e) => setEditSupplierName(e.target.value)}
                                className="w-full bg-black border border-gray-800 rounded-lg p-1.5 text-white"
                                placeholder="Supplier Name"
                              />
                              <input 
                                type="email"
                                value={editSupplierEmail}
                                onChange={(e) => setEditSupplierEmail(e.target.value)}
                                className="w-full bg-black border border-gray-800 rounded-lg p-1.5 text-white"
                                placeholder="Supplier Email"
                              />
                            </div>
                          ) : (
                            <>
                              <p className="font-semibold text-gray-300">{po.supplierName}</p>
                              <p className="text-gray-500 flex items-center gap-1 font-mono">
                                <Mail className="h-3 w-3 text-gray-600" />
                                {po.supplierEmail}
                              </p>
                            </>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isDraft ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-950/40 text-amber-400 border border-amber-900/40">
                              <AlertTriangle className="h-3 w-3" />
                              Draft PO
                            </span>
                          ) : (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-950/40 text-green-400 border border-green-900/40">
                                <CheckCircle2 className="h-3 w-3" />
                                Approved
                              </span>
                              {po.approvedAt && (
                                <p className="text-[9px] text-gray-500 font-mono">
                                  Sent: {new Date(po.approvedAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2.5">
                            {isDraft && (
                              <>
                                {isEditing ? (
                                  <button
                                    onClick={() => handleSaveClick(po.id)}
                                    disabled={actioningId === po.id}
                                    className="p-2 text-green-400 hover:bg-green-900/10 rounded-lg border border-green-900/30 transition-all"
                                    title="Save Details"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleEditClick(po)}
                                    className="p-2 text-gray-500 hover:text-[#D4AF37] hover:bg-gray-800/40 rounded-lg transition-all"
                                    title="Edit Restock Details"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleApproveClick(po.id)}
                                  disabled={actioningId === po.id || isEditing}
                                  className="px-3.5 py-2 text-xs font-bold uppercase tracking-widest text-[#111] bg-[#D4AF37] hover:bg-[#F7D070] disabled:bg-gray-700 disabled:text-gray-500 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                                >
                                  {actioningId === po.id ? "Sending..." : "Approve & PO"}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
