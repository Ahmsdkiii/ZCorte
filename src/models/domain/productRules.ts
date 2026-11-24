import {
  ALL_CATEGORIES,
  ALL_SIZES,
  Product,
  ProductCategory,
  ProductCollection,
  ProductColorId,
  ProductColorVariant,
  ProductSize,
} from "../types/product";

export const COLLECTION_LABELS: Record<ProductCollection, string> = {
  tactix: "TACTIX — Utility & Readiness",
  apextive: "APEXTIVE — Movement & Training",
  outdoor: "OUTDOOR — Terrain & Resilience",
};

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  tops: "Tops & T-Shirts",
  bottoms: "Bottoms & Shorts",
  outerwear: "Outerwear & Jackets",
  accessories: "Bags & Accessories",
};

export interface PriceRangePreset {
  id: string;
  label: string;
  minPrice: number;
  maxPrice: number;
}

export const PRICE_RANGE_PRESETS: readonly PriceRangePreset[] = [
  { id: "under-500k", label: "< IDR 500K", minPrice: 0, maxPrice: 500000 },
  { id: "500k-1m", label: "IDR 500K – 1M", minPrice: 500000, maxPrice: 1000000 },
  { id: "1m-1.5m", label: "IDR 1M – 1.5M", minPrice: 1000000, maxPrice: 1500000 },
  { id: "above-1.5m", label: "> IDR 1.5M", minPrice: 1500000, maxPrice: Infinity },
];

export type ProductSortOption = "featured" | "price-asc" | "price-desc" | "name-asc";

export interface ProductFilterCriteria {
  collection?: ProductCollection | "all";
  category?: ProductCategory | "all";
  size?: ProductSize | "all";
  color?: ProductColorId | "all";
  pricePreset?: string | "all";
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  sort?: ProductSortOption;
}

export function filterAndSortProducts(
  products: Product[],
  criteria: ProductFilterCriteria
): Product[] {
  const {
    collection = "all",
    category = "all",
    size = "all",
    color = "all",
    pricePreset = "all",
    minPrice,
    maxPrice,
    searchQuery = "",
    sort = "featured",
  } = criteria;

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const preset =
    pricePreset !== "all" ? PRICE_RANGE_PRESETS.find((p) => p.id === pricePreset) : undefined;

  const effectiveMinPrice =
    typeof minPrice === "number" && !Number.isNaN(minPrice)
      ? minPrice
      : preset
        ? preset.minPrice
        : 0;

  const effectiveMaxPrice =
    typeof maxPrice === "number" && !Number.isNaN(maxPrice)
      ? maxPrice
      : preset
        ? preset.maxPrice
        : Infinity;

  const filtered = products.filter((product) => {
    if (collection !== "all" && product.collection !== collection) {
      return false;
    }

    if (category !== "all" && product.category !== category) {
      return false;
    }

    if (size !== "all" && !product.sizes.includes(size)) {
      return false;
    }

    if (color !== "all" && !product.colors.some((c) => c.id === color)) {
      return false;
    }

    if (product.price < effectiveMinPrice || product.price > effectiveMaxPrice) {
      return false;
    }

    if (normalizedQuery) {
      const matchName = product.name.toLowerCase().includes(normalizedQuery);
      const matchDesc = product.description.toLowerCase().includes(normalizedQuery);
      if (!matchName && !matchDesc) {
        return false;
      }
    }

    return true;
  });

  return filtered.toSorted((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "featured":
      default:
        if (a.featured === b.featured) {
          return 0;
        }
        return a.featured ? -1 : 1;
    }
  });
}

export function getProductColor(product: Product, colorId?: ProductColorId): ProductColorVariant {
  const firstColor = product.colors[0];
  if (!firstColor) {
    throw new Error(`Product "${product.slug}" must have at least one color variant.`);
  }
  if (!colorId) {
    return firstColor;
  }
  const match = product.colors.find((c) => c.id === colorId);
  return match ?? firstColor;
}

export function getAvailableSizes(product: Product, colorId?: ProductColorId): ProductSize[] {
  if (product.sizes.length === 0) {
    return [];
  }
  const color = getProductColor(product, colorId);
  const unavailable = new Set(color.unavailableSizes ?? []);
  return product.sizes.filter((s) => !unavailable.has(s));
}

export function isOneSize(product: Product): boolean {
  return product.sizes.length === 0;
}

export function getGalleryImages(product: Product, colorId?: ProductColorId): string[] {
  const color = getProductColor(product, colorId);
  const colorImages = [color.images.front, color.images.back];
  const context = product.contextImages ?? [];
  return [...colorImages, ...context];
}

export function getProductStock(
  product: Product,
  colorId?: ProductColorId,
  size?: ProductSize | null
): number {
  const color = getProductColor(product, colorId);
  if (isOneSize(product) || size === null || size === undefined) {
    if (color.stockOneSize !== undefined) {
      return color.stockOneSize;
    }
    if (color.stockBySize) {
      return Object.values(color.stockBySize).reduce((acc, curr) => acc + (curr ?? 0), 0);
    }
    return 10;
  }
  return color.stockBySize?.[size] ?? 0;
}

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) return "out_of_stock";
  if (stock <= 3) return "low_stock";
  return "in_stock";
}

export function buildCartItemId(
  productId: string,
  colorId: ProductColorId,
  size: ProductSize | null
): string {
  return `${productId}:${colorId}:${size ?? "onesize"}`;
}
