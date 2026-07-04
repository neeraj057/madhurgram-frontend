import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "@/apis/api";
import { getAuthFetchOptions, handleAuthError, parseApiError } from "@/utils/adminAuth";

export interface Product {
  id?: number;
  name: string;
  price: number;
  volume: string;
  imageUrl: string;
  stock: number;
  category: string;
  isActive: boolean;
}

export const useAdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.adminProducts, getAuthFetchOptions());

      if (await handleAuthError(response)) return;
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const saveProduct = async (product: Product) => {
    setIsSubmitting(true);
    const isUpdate = !!product.id;
    const url = isUpdate ? `${API_ENDPOINTS.adminProducts}/${product.id}` : API_ENDPOINTS.adminProducts;
    const method = isUpdate ? "PUT" : "POST";

    try {
      const response = await fetch(
        url,
        getAuthFetchOptions(method, JSON.stringify(product), "application/json")
      );

      if (await handleAuthError(response)) return false;

      if (!response.ok) {
        const errorMessage = await parseApiError(response);
        throw new Error(errorMessage || "Failed to save product");
      }

      await fetchProducts();
      return true;
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product details.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🚀 नया डिलीट फंक्शन
  const deleteProduct = async (id: number) => {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.adminProducts}/${id}`,
        getAuthFetchOptions("DELETE")
      );

      if (await handleAuthError(response)) return false;

      if (!response.ok) {
        const errorMessage = await parseApiError(response);
        throw new Error(errorMessage || "Failed to delete product");
      }

      await fetchProducts();
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      return false;
    }
  };

  return { products, loading, isSubmitting, saveProduct, deleteProduct, fetchProducts };
};