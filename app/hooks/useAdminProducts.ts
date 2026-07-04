import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../apis/api";
import { clearAdminSession } from "../utils/adminAuth";

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
      const token = localStorage.getItem("adminToken");
      const response = await fetch(API_ENDPOINTS.adminProducts, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        clearAdminSession();
        return;
      }

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
      const token = localStorage.getItem("adminToken");
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      if (response.status === 401 || response.status === 403) {
        clearAdminSession();
        return false;
      }

      if (!response.ok) throw new Error("Failed to save product");

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
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_ENDPOINTS.adminProducts}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        clearAdminSession();
        return false;
      }

      if (!response.ok) throw new Error("Failed to delete product");

      await fetchProducts();
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      return false;
    }
  };

  return { products, loading, isSubmitting, saveProduct, deleteProduct, fetchProducts };
};