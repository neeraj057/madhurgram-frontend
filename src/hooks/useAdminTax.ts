import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "@/apis/api";
import { getAuthFetchOptions, handleAuthError, parseApiError } from "@/utils/adminAuth";
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
      const response = await fetch(API_ENDPOINTS.adminTaxSlabs, getAuthFetchOptions());
      if (await handleAuthError(response)) return;
      if (response.ok) {
        const data = await response.json();
        setTaxSlabs(data);
      }
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
      ? `${API_ENDPOINTS.adminTaxSlabs}/${slab.hsnCode.trim()}` 
      : API_ENDPOINTS.adminTaxSlabs;
    const method = isUpdate ? "PUT" : "POST";

    try {
      const response = await fetch(
        url,
        getAuthFetchOptions(method, JSON.stringify(slab), "application/json")
      );

      if (await handleAuthError(response)) return false;

      if (!response.ok) {
        const errorMessage = await parseApiError(response);
        throw new Error(errorMessage || "Failed to save tax slab");
      }

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
      const response = await fetch(
        `${API_ENDPOINTS.adminTaxSlabs}/${hsnCode.trim()}`,
        getAuthFetchOptions("DELETE")
      );

      if (await handleAuthError(response)) return false;

      if (!response.ok) {
        const errorMessage = await parseApiError(response);
        throw new Error(errorMessage || "Failed to delete tax slab");
      }

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
