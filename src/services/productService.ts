import { apiClient } from "@/apis/apiClient";

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  volume: string;
  imageUrl: string; 
  tag: string;
  category: string;
  stock: number;
  rating?: number;
  showSalesCount?: boolean;
  salesCount?: number;
  realSalesCount?: number;
  clearanceActive?: boolean;
  variants?: {
    id: number;
    name: string;
    volume: string;
    price: number;
    originalPrice?: number;
    stock: number;
    tag: string;
    showSalesCount?: boolean;
    salesCount?: number;
    realSalesCount?: number;
  }[];
}

export const ProductService = {
  /**
   * Retrieves products in the catalog by category.
   */
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    return apiClient<Product[]>(`/api/v1/products?category=${encodeURIComponent(category)}`);
  },

  /**
   * Admin: Retrieves all products (including inactive ones).
   */
  getAllProductsForAdmin: async (): Promise<Product[]> => {
    return apiClient<Product[]>("/api/v1/admin/products");
  },

  /**
   * Admin: Adds a new product.
   */
  addProduct: async (product: Partial<Product>): Promise<Product> => {
    return apiClient<Product>("/api/v1/admin/products", {
      method: "POST",
      body: JSON.stringify(product),
    });
  },

  /**
   * Admin: Updates an existing product.
   */
  updateProduct: async (id: number, product: Partial<Product>): Promise<Product> => {
    return apiClient<Product>(`/api/v1/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    });
  },

  /**
   * Admin: Deletes (or deactivates) a product.
   */
  deleteProduct: async (id: number): Promise<void> => {
    return apiClient<void>(`/api/v1/admin/products/${id}`, {
      method: "DELETE",
    });
  }
};
