import { Product } from "@/services/productService";

export interface ProductVariant {
  volume: string;
  price: number;
  originalPrice?: number;
  suffix: string;
}

/**
 * Returns the parsed list of variants for a product if it supports multiple volumes.
 * Returns null if the product has only a single static size.
 */
export function getProductVariants(product: Product): ProductVariant[] | null {
  if (!product.volume || !product.volume.includes("/")) {
    return null;
  }

  const nameLower = product.name.toLowerCase();
  const basePrice = product.price;
  const baseOriginalPrice = product.originalPrice || Math.round(basePrice * 1.1);

  // Variant Mapping for A2 Cow Ghee
  if (nameLower.includes("ghee")) {
    const ratio500 = 0.538; 
    return [
      { volume: "500ml", price: Math.round(basePrice * ratio500), originalPrice: Math.round(baseOriginalPrice * 0.57), suffix: " (500ml)" },
      { volume: "1L", price: basePrice, originalPrice: baseOriginalPrice, suffix: " (1L)" }
    ];
  }

  // Variant Mapping for A2 Cow Dahi
  if (nameLower.includes("dahi")) {
    const ratio500 = 0.55; 
    return [
      { volume: "500ml", price: Math.round(basePrice * ratio500), originalPrice: Math.round(baseOriginalPrice * 0.565), suffix: " (500ml)" },
      { volume: "1L", price: basePrice, originalPrice: baseOriginalPrice, suffix: " (1L)" }
    ];
  }

  // General fallback for any future multi-volume products
  return [
    { volume: "500g", price: Math.round(basePrice * 0.55), originalPrice: Math.round(baseOriginalPrice * 0.55), suffix: " (500g)" },
    { volume: "1kg", price: basePrice, originalPrice: baseOriginalPrice, suffix: " (1kg)" }
  ];
}

/**
 * Normalizes product name to group variants (removes trailing parenthetical or plain volume suffixes)
 * Examples handled: "Cow Ghee (500ml)", "Cow Ghee 1L", "Mango Pickle 500g", "Organic Gud 1kg"
 */
export function getNormalizedBaseName(name: string): string {
  return name
    .replace(/\s*\(\s*\d+(?:\.\d+)?\s*(?:ml|g|kg|l|litre|litres|gm|gms|half|full)\s*\)\s*$/i, "") // Matches "(500ml)", "(1kg)", "(half)"
    .replace(/\s+\d+(?:\.\d+)?\s*(?:ml|g|kg|l|litre|litres|gm|gms)\s*$/i, "")                     // Matches " 500g", " 1kg"
    .trim()
    .toLowerCase();
}

/**
 * Dynamically groups flat list of products from the database by name prefix,
 * converting separate DB entries of different sizes into a single base product with variants.
 */
export function groupProducts(products: Product[]): Product[] {
  const grouped: Record<string, Product[]> = {};

  products.forEach(p => {
    const key = getNormalizedBaseName(p.name);
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(p);
  });

  const result: Product[] = [];

  Object.values(grouped).forEach(group => {
    if (group.length === 1) {
      // 1. Backward Compatible Path: single row with slash (e.g. '500ml / 1L')
      const p = group[0];
      const parsedVariants = getProductVariants(p);
      if (parsedVariants) {
        result.push({
          ...p,
          variants: parsedVariants.map(v => ({
            id: p.id,
            name: `${p.name} (${v.volume})`,
            volume: v.volume,
            price: v.price,
            originalPrice: v.originalPrice,
            stock: p.stock,
            tag: p.tag
          }))
        });
      } else {
        result.push(p);
      }
    } else {
      // 2. Future-Proof Path: Admin created multiple separate products in the DB for each size!
      // Sort variants by volume size (e.g. 500ml first, then 1L)
      group.sort((a, b) => {
        const valA = parseFloat(a.volume) || 0;
        const valB = parseFloat(b.volume) || 0;
        return valA - valB;
      });

      const baseProduct = group[0];
      
      // Use clean base name without size suffix for the grouped display card
      const baseCleanName = baseProduct.name.replace(/\s*\(\s*\d+\s*(?:ml|g|kg|l)\s*\)\s*$/i, "").trim();

      result.push({
        ...baseProduct,
        name: baseCleanName,
        variants: group.map(p => ({
          id: p.id,
          name: p.name,
          volume: p.volume,
          price: p.price,
          originalPrice: p.originalPrice,
          stock: p.stock,
          tag: p.tag
        }))
      });
    }
  });

  return result;
}

/**
 * Returns a new product object representing the specific active variant.
 */
export function getVariantProduct(product: Product, selectedVolume: string): Product {
  if (!product.variants || product.variants.length === 0) {
    return product;
  }

  const activeVariant = product.variants.find(v => v.volume === selectedVolume);
  if (!activeVariant) return product;

  return {
    ...product,
    id: activeVariant.id,
    name: activeVariant.name,
    price: activeVariant.price,
    originalPrice: activeVariant.originalPrice,
    volume: activeVariant.volume,
    stock: activeVariant.stock,
    tag: activeVariant.tag
  };
}
