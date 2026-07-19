"use client";
import React, { useState, useEffect } from "react";
import { Undo2, CheckCircle2, XCircle, ArrowDownCircle, AlertCircle, FileDown } from "lucide-react";
import { API_ENDPOINTS } from "@/apis/api";
import { getAuthFetchOptions, handleAuthError } from "@/utils/adminAuth";
import { showToast } from "@/components/ui/Toast";

interface ReturnRequest {
  id: number;
  orderId: number;
  customerPhone: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  refundTransactionId: string | null;
  createdAt: string;
  approvedAt: string | null;
}

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<number | null>(null);

  const fetchReturns = async (pageIndex = page) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_ENDPOINTS.adminReturnsAll}?page=${pageIndex}&size=10`, getAuthFetchOptions());
      if (await handleAuthError(res)) return;
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setReturns(data);
          setTotalPages(1);
        } else {
          setReturns(data.content || []);
          setTotalPages(data.totalPages || 1);
          setPage(data.number || 0);
        }
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to fetch Return Requests.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns(page);
  }, [page]);

  const handleApprove = async (id: number) => {
    setActioningId(id);
    try {
      const res = await fetch(API_ENDPOINTS.adminReturnsApprove(id), getAuthFetchOptions("POST"));
      if (await handleAuthError(res)) return;
      if (res.ok) {
        showToast("Return Request approved. Refund issued successfully!", "success");
        fetchReturns(page);
      } else {
        showToast("Failed to approve return.", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Error processing approval.", "error");
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id: number) => {
    setActioningId(id);
    try {
      const res = await fetch(API_ENDPOINTS.adminReturnsReject(id), getAuthFetchOptions("POST"));
      if (await handleAuthError(res)) return;
      if (res.ok) {
        showToast("Return request rejected.", "success");
        fetchReturns(page);
      } else {
        showToast("Failed to reject return.", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Error processing rejection.", "error");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#D4AF37] tracking-wide flex items-center gap-3">
          <Undo2 className="h-8 w-8 text-[#D4AF37]" />
          Return Requests & Refund Manager
        </h1>
        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
          Automated customer return ledger, postage labels, and instant ledger refunds
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[#D4AF37] animate-pulse font-mono">
          Loading Return Portal Logs...
        </div>
      ) : (
        <div className="bg-[#161616] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-900/40">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300">Return Requests Queue</h2>
            <button 
              onClick={() => fetchReturns(page)}
              className="text-xs text-[#D4AF37] border border-[#D4AF37]/20 hover:bg-[#D4AF37]/10 px-3 py-1.5 rounded-lg transition-all"
            >
              Refresh Queue
            </button>
          </div>

          <div className="overflow-x-auto">
            {returns.length === 0 ? (
              <div className="p-12 text-center text-gray-500 font-light">
                No customer returns requested yet. Self-service request entries will automatically queue here.
              </div>
            ) : (
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-[#0e0e0e] text-[10px] uppercase text-gray-500 font-bold tracking-wider border-b border-gray-800">
                  <tr>
                    <th className="px-6 py-4">Return ID</th>
                    <th className="px-6 py-4">Order Reference</th>
                    <th className="px-6 py-4">Customer Details</th>
                    <th className="px-6 py-4">Reason for Return</th>
                    <th className="px-6 py-4">Request Status</th>
                    <th className="px-6 py-4">Refund Transaction</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {returns.map((ret) => {
                    const isPending = ret.status === "PENDING";
                    const isApproved = ret.status === "APPROVED";
                    const isRejected = ret.status === "REJECTED";

                    return (
                      <tr key={ret.id} className="hover:bg-gray-900/25 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-[#FDFBF7]">
                          RET-{String(ret.id).padStart(5, "0")}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-[#FDFBF7]">Order #{ret.orderId}</p>
                          <p className="text-[10px] text-gray-500 font-mono">
                            Filed: {new Date(ret.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs">
                          <p className="text-gray-300">{ret.customerPhone}</p>
                        </td>
                        <td className="px-6 py-4 text-xs italic text-gray-300 max-w-xs">
                          "{ret.reason}"
                        </td>
                        <td className="px-6 py-4">
                          {isPending ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-950/40 text-amber-400 border border-amber-900/40">
                              <AlertCircle className="h-3 w-3" />
                              Pending Audit
                            </span>
                          ) : isApproved ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-950/40 text-green-400 border border-green-900/40">
                              <CheckCircle2 className="h-3 w-3" />
                              Approved (Refunded)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-950/40 text-red-400 border border-red-900/40">
                              <XCircle className="h-3 w-3" />
                              Rejected
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs">
                          {ret.refundTransactionId ? (
                            <div className="space-y-1">
                              <p className="font-semibold text-green-400">{ret.refundTransactionId}</p>
                              {ret.approvedAt && (
                                <p className="text-[9px] text-gray-600">
                                  Txn: {new Date(ret.approvedAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-600">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2.5">
                            <a 
                              href={API_ENDPOINTS.publicReturnShippingLabel(ret.id)}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 text-gray-400 hover:text-white bg-gray-800/40 hover:bg-gray-800 rounded-lg transition-all border border-gray-800/60"
                              title="Download/Print Return Label"
                            >
                              <FileDown className="h-4 w-4" />
                            </a>
                            {isPending && (
                              <>
                                <button
                                  onClick={() => handleReject(ret.id)}
                                  disabled={actioningId === ret.id}
                                  className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-red-400 border border-red-900/30 hover:bg-red-950/30 rounded-xl transition-all"
                                >
                                  Reject
                                </button>
                                <button
                                  onClick={() => handleApprove(ret.id)}
                                  disabled={actioningId === ret.id}
                                  className="px-3.5 py-2 text-xs font-bold uppercase tracking-widest text-[#111] bg-[#D4AF37] hover:bg-[#F7D070] disabled:bg-gray-700 disabled:text-gray-500 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                                >
                                  {actioningId === ret.id ? "Refunding..." : "Approve & Refund"}
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

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-800/60 p-5 bg-gray-900/20">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-4 py-2 border border-gray-800 bg-[#161616] rounded-xl text-xs font-bold text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
              >
                Previous
              </button>
              <span className="text-xs font-mono text-gray-400">
                Page <span className="text-[#D4AF37] font-bold">{page + 1}</span> of <span className="text-white font-bold">{totalPages}</span>
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page === totalPages - 1}
                className="px-4 py-2 border border-gray-800 bg-[#161616] rounded-xl text-xs font-bold text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
