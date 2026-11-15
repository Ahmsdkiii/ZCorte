import { apiRequest, isApiConfigured } from "../api/httpClient";
import { mockProducts } from "../data/products.mock";
import { mapProductDtoToDomain, ProductDto } from "../mappers/product.mapper";
import { Product, ProductCollection } from "../types/product";

export interface GetProductsOptions {
  collection?: ProductCollection;
  featured?: boolean;
  sort?: "featured" | "price-asc" | "price-desc";
}

function applyProductFilters(source: Product[], options?: GetProductsOptions): Product[] {
  let products = [...source];

  if (options?.collection) {
    products = products.filter((p) => p.collection === options.collection);
  }

  if (options?.featured !== undefined) {
    products = products.filter((p) => p.featured === options.featured);
  }

  if (options?.sort === "price-asc") {
    products.sort((a, b) => a.price - b.price);
  } else if (options?.sort === "price-desc") {
    products.sort((a, b) => b.price - a.price);
  }

  return products;
}

export async function getProducts(options?: GetProductsOptions): Promise<Product[]> {
  if (isApiConfigured()) {
    try {
      const params = new URLSearchParams();
      if (options?.collection) params.set("collection", options.collection);
      if (options?.featured !== undefined) params.set("featured", String(options.featured));
      if (options?.sort) params.set("sort", options.sort);

      const query = params.toString();
      const dtos = await apiRequest<ProductDto[]>(`/products${query ? `?${query}` : ""}`);
      return applyProductFilters(dtos.map(mapProductDtoToDomain), options);
    } catch {
      return applyProductFilters(mockProducts, options);
    }
  }

  return applyProductFilters(mockProducts, options);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isApiConfigured()) {
    try {
      const dto = await apiRequest<ProductDto>(`/products/${encodeURIComponent(slug)}`);
      return mapProductDtoToDomain(dto);
    } catch {
      const fallback = mockProducts.find((p) => p.slug === slug);
      return fallback ?? null;
    }
  }

  const found = mockProducts.find((p) => p.slug === slug);
  return found ?? null;
}

export async function getRelatedProducts(slug: string): Promise<Product[]> {
  const current = await getProductBySlug(slug);
  if (!current) return [];

  const allProducts = await getProducts();
  return allProducts.filter((p) => current.relatedProductSlugs.includes(p.slug));
}
