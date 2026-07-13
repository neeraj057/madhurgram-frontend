# Frontend Architectural Assessment & Loose-Coupling Roadmap

This document outlines the current state of code coupling in MadhurGram, evaluates its production readiness, and provides a clear, production-grade roadmap to build a highly scalable, loosely-coupled architecture.

---

## 📐 Architecture Overview

To achieve a true **loosely-coupled** and scalable architecture, we should transition to a **3-Layer Architecture**:

```
+--------------------------------------------------------+
| 1. UI Layer (React Components)                         |
|    - Handles layout, styling, and user events.         |
|    - Does not know how/where data is fetched.          |
+---------------------------+----------------------------+
                            |
                            | Calls Custom Hook
                            v
+--------------------------------------------------------+
| 2. State & Hooks Layer (Custom React Hooks)            |
|    - Manages state, loading, errors, and caching.      |
|    - Uses TanStack Query or simple local SWR.          |
+---------------------------+----------------------------+
                            |
                            | Calls Services
                            v
+--------------------------------------------------------+
| 3. Service Layer (API Client & Transport)              |
|    - Pure JS/TS functions mapping backend URLs.       |
|    - Manages headers, parsing, and global wrappers.   |
+--------------------------------------------------------+
```

---

## 🛠️ Key Refactoring Steps

### Step 1: Centralized API Client (`src/utils/apiClient.ts`)
Create a single HTTP wrapper to standardize headers, JSON extraction, and global errors.

```typescript
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP error! Status: ${response.status}`;
    try {
      const errorBody = await response.json();
      if (errorBody?.message) errorMessage = errorBody.message;
    } catch {}
    throw new Error(errorMessage);
  }

  return response.json();
}
```

---

### Step 2: The Service Layer (`src/services/productService.ts`)
Extract API operations into dedicated service modules. Components will call these services, meaning you can easily swap from `fetch` to `axios` or mock the data during unit tests without changing UI files.

```typescript
import { apiClient } from "@/utils/apiClient";

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
}

export const ProductService = {
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    return apiClient<Product[]>(`/api/products?category=${category}`);
  },

  getProductById: async (id: number): Promise<Product> => {
    return apiClient<Product>(`/api/products/${id}`);
  }
};
```

---

### Step 3: Custom Hooks Layer (`src/hooks/useProducts.ts`)
Create custom Hooks to manage component state, caching, and fetch triggers. This removes `useEffect` and `useState` boilerplate from components.

```typescript
import { useState, useEffect } from "react";
import { Product, ProductService } from "@/services/productService";

export function useProducts(category: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    ProductService.getProductsByCategory(category)
      .then((data) => {
        if (isMounted) setProducts(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Failed to load products");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [category]);

  return { products, loading, error };
}
```

---

### Step 4: Refactoring the UI Component (`ProductGrid.tsx`)
Now, the UI component simply consumes the hook. It has **no API URLs, no fetch logic, and no manual JSON extraction**.

```tsx
import { useProducts } from "@/hooks/useProducts";
import ProductQuickViewModal from "./ProductQuickViewModal";

export default function ProductGrid({ activeCategory, onAddToCart, addedProductId }: ProductGridProps) {
  const { products, loading, error } = useProducts(activeCategory);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (loading) return <div>Loading Fresh Batches...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <div key={product.id} className="group relative flex flex-col justify-between ...">
          {/* Card JSX */}
        </div>
      ))}
      <ProductQuickViewModal 
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={onAddToCart}
      />
    </div>
  );
}
```

---

## 🏁 Summary of Benefits

1. **Scalability:** If we need to implement React Query (TanStack Query) in the future for caching and offline support, we only modify the hooks layer. The UI components require **zero changes**.
2. **Maintainability:** If the API endpoints shift or auth headers are added, we only modify `apiClient.ts`.
3. **Testability:** We can write unit tests for `ProductGrid.tsx` by mock-injecting the hook `useProducts` with static arrays, making frontend testing simple and fast.
