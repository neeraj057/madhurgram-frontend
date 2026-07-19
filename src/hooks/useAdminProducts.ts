import { useState, useEffect } from "react";
import { apiClient } from "@/apis/apiClient";
import { showToast } from "@/components/ui/Toast";

export interface Product {
  id?: number;
  name: string;
  price: number;
  originalPrice?: number | null;
  volume: string;
  imageUrl: string;
  stock: number;
  category: string;
  isActive: boolean;
  hsnCode?: string;
  rating?: number;
  showSalesCount?: boolean;
  salesCount?: number;
  realSalesCount?: number;
}

export const useAdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await apiClient<Product[]>("/api/v1/admin/products");
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Run asynchronously to avoid calling setState synchronously within the effect body
    Promise.resolve().then(() => {
      fetchProducts();
    });
  }, []);

  const saveProduct = async (product: Product) => {
    setIsSubmitting(true);
    const isUpdate = !!product.id;
    const url = isUpdate ? `/api/v1/admin/products/${product.id}` : "/api/v1/admin/products";
    const method = isUpdate ? "PUT" : "POST";

    try {
      await apiClient<Product>(url, {
        method,
        body: JSON.stringify(product),
      });

      await fetchProducts();
      return true;
    } catch (error) {
      console.error("Error saving product:", error);
      showToast(error instanceof Error ? error.message : "Failed to save product details.", "error");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await apiClient<void>(`/api/v1/admin/products/${id}`, {
        method: "DELETE",
      });

      await fetchProducts();
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      showToast(error instanceof Error ? error.message : "Failed to delete product.", "error");
      return false;
    }
  };

  return { products, loading, isSubmitting, saveProduct, deleteProduct, fetchProducts };
};