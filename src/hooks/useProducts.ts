import { useState, useEffect } from 'react';
import { Product, ProductService } from '@/services/productService';

/**
 * Custom React hook for fetching and managing products.
 * Handles mounting safeguards, loading states, and error propagation.
 */
export function useProducts(category: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    ProductService.getProductsByCategory(category)
      .then((data) => {
        if (isMounted) {
          setProducts(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Something went wrong while connecting to Backend.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [category]);

  return { products, loading, error };
}
