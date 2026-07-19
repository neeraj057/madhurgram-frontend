import { useState, useEffect } from "react";
import { apiClient } from "@/apis/apiClient";
import { showToast } from "@/components/ui/Toast";

export interface TaxSlab {
  hsnCode: string;
  description: string;
  gstRate: number;
}

export const useAdminTax = () => {
  const [taxSlabs, setTaxSlabs] = useState<TaxSlab[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTaxSlabs = async () => {
    setLoading(true);
    try {
      const data = await apiClient<TaxSlab[]>("/api/v1/admin/tax-slabs");
      setTaxSlabs(data);
    } catch (error) {
      console.error("Error fetching tax slabs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxSlabs();
  }, []);

  const saveTaxSlab = async (slab: TaxSlab, isUpdate: boolean) => {
    setIsSubmitting(true);
    const url = isUpdate 
      ? `/api/v1/admin/tax-slabs/${slab.hsnCode.trim()}` 
      : "/api/v1/admin/tax-slabs";
    const method = isUpdate ? "PUT" : "POST";

    try {
      await apiClient<TaxSlab>(url, {
        method,
        body: JSON.stringify(slab),
      });

      showToast(`Tax slab ${slab.hsnCode} saved successfully!`, "success");
      await fetchTaxSlabs();
      return true;
    } catch (error: any) {
      console.error("Error saving tax slab:", error);
      showToast(error.message || "Failed to save tax slab details.", "error");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteTaxSlab = async (hsnCode: string) => {
    try {
      await apiClient<void>(`/api/v1/admin/tax-slabs/${hsnCode.trim()}`, {
        method: "DELETE",
      });

      showToast("Tax slab deleted successfully!", "success");
      await fetchTaxSlabs();
      return true;
    } catch (error) {
      console.error("Error deleting tax slab:", error);
      showToast("Failed to delete tax slab.", "error");
      return false;
    }
  };

  return { taxSlabs, loading, isSubmitting, saveTaxSlab, deleteTaxSlab, refreshTaxSlabs: fetchTaxSlabs };
};
