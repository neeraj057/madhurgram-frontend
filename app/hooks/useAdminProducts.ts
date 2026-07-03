import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../apis/api";

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
      const token = localStorage.getItem("adminToken"); // 👈 टोकन निकाला
      const response = await fetch(API_ENDPOINTS.adminProducts,{
        headers: {
          "Authorization": `Bearer ${token}` // 👈 हेडर में चिपका दिया
        }
      });
      
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
      const token = localStorage.getItem("adminToken"); // 👈 टोकन निकाला
      const response = await fetch(url, {
        method,
        headers: {
           "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // 👈 हेडर में चिपका दिया
         },
        body: JSON.stringify(product),
      });

      if (!response.ok) throw new Error("Failed to save product");
      
      await fetchProducts(); // लिस्ट रिफ्रेश करो
      return true; // सक्सेस
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product details.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { products, loading, isSubmitting, saveProduct, fetchProducts };
};