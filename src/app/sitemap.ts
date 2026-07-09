import { MetadataRoute } from 'next';

interface Product {
  id: number;
  name: string;
  category: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'http://localhost:3000';

  // Base routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/orders`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  try {
    // Dynamic Product Routes
    const res = await fetch('http://localhost:8080/api/products?category=shop-all', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (res.ok) {
      const products: Product[] = await res.json();
      const productRoutes = products.map((product) => ({
        url: `${baseUrl}/products/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
      return [...routes, ...productRoutes];
    }
  } catch (error) {
    console.error('Failed to fetch sitemap products:', error);
  }

  return routes;
}
