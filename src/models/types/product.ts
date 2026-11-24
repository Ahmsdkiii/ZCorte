export type ProductCollection = "tactix" | "apextive" | "outdoor";

export type ProductCategory = "tops" | "bottoms" | "outerwear" | "accessories";

export const ALL_CATEGORIES: readonly ProductCategory[] = [
  "tops",
  "bottoms",
  "outerwear",
  "accessories",
];

export type ProductSize = "S" | "M" | "L" | "XL";

export const ALL_SIZES: readonly ProductSize[] = ["S", "M", "L", "XL"];

export type ProductColorId = "graphite" | "olive";

export interface ProductColorVariant {
  id: ProductColorId;
  name: string;
  swatch: string;
  images: {
    front: string;
    back: string;
  };
  unavailableSizes?: ProductSize[];
}

export interface ProductSpecification {
  concept: string;
  materials: string;
  fit: string;
  care: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  collection: ProductCollection;
  category: ProductCategory;
  price: number;
  featured: boolean;
  description: string;
  colors: ProductColorVariant[];
  sizes: ProductSize[];
  contextImages?: string[];
  isConcept: boolean;
  specifications: ProductSpecification;
  relatedProductSlugs: string[];
}
