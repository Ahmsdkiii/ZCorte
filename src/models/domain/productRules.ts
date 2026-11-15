import {
  ALL_SIZES,
  Product,
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

export function getProductColor(product: Product, colorId?: ProductColorId): ProductColorVariant {
  if (!colorId) {
    return product.colors[0];
  }
  const match = product.colors.find((c) => c.id === colorId);
  return match ?? product.colors[0];
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

export function buildCartItemId(
  productId: string,
  colorId: ProductColorId,
  size: ProductSize | null
): string {
  return `${productId}:${colorId}:${size ?? "onesize"}`;
}
