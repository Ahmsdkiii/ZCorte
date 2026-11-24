"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ALL_CATEGORIES,
  ALL_SIZES,
  Product,
  ProductCategory,
  ProductCollection,
  ProductColorId,
  ProductSize,
} from "@/models/types/product";
import {
  filterAndSortProducts,
  PRICE_RANGE_PRESETS,
  ProductFilterCriteria,
  ProductSortOption,
} from "@/models/domain/productRules";

const DEFAULT_PAGE_SIZE = 12;

export function useShopViewModel(initialProducts: Product[], pageSize = DEFAULT_PAGE_SIZE) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Parse filters directly from URL search params
  const collectionParam = searchParams.get("collection");
  const categoryParam = searchParams.get("category");
  const sizeParam = searchParams.get("size");
  const colorParam = searchParams.get("color");
  const priceParam = searchParams.get("price");
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  const qParam = searchParams.get("q") ?? "";
  const sortParam = searchParams.get("sort");
  const pageParam = searchParams.get("page");

  const activeCollection: ProductCollection | "all" =
    collectionParam === "tactix" || collectionParam === "apextive" || collectionParam === "outdoor"
      ? collectionParam
      : "all";

  const activeCategory: ProductCategory | "all" = ALL_CATEGORIES.includes(
    categoryParam as ProductCategory
  )
    ? (categoryParam as ProductCategory)
    : "all";

  const activeSize: ProductSize | "all" = ALL_SIZES.includes(sizeParam as ProductSize)
    ? (sizeParam as ProductSize)
    : "all";

  const activeColor: ProductColorId | "all" =
    colorParam === "graphite" || colorParam === "olive" ? colorParam : "all";

  const activePricePreset = PRICE_RANGE_PRESETS.some((p) => p.id === priceParam)
    ? (priceParam as string)
    : "all";

  const minPrice = minPriceParam ? Number(minPriceParam) : undefined;
  const maxPrice = maxPriceParam ? Number(maxPriceParam) : undefined;

  const activeSort: ProductSortOption =
    sortParam === "price-asc" || sortParam === "price-desc" || sortParam === "name-asc"
      ? sortParam
      : "featured";

  const currentPage = Math.max(1, Number(pageParam) || 1);

  const updateUrl = useCallback(
    (newParams: Record<string, string | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (!value || value === "all" || value === "featured") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const setActiveCollection = useCallback(
    (collection: ProductCollection | "all") => {
      updateUrl({ collection, page: null });
    },
    [updateUrl]
  );

  const setActiveCategory = useCallback(
    (category: ProductCategory | "all") => {
      updateUrl({ category, page: null });
    },
    [updateUrl]
  );

  const setActiveSize = useCallback(
    (size: ProductSize | "all") => {
      updateUrl({ size, page: null });
    },
    [updateUrl]
  );

  const setActiveColor = useCallback(
    (color: ProductColorId | "all") => {
      updateUrl({ color, page: null });
    },
    [updateUrl]
  );

  const setActivePricePreset = useCallback(
    (pricePreset: string | "all") => {
      updateUrl({ price: pricePreset, minPrice: null, maxPrice: null, page: null });
    },
    [updateUrl]
  );

  const setActiveSort = useCallback(
    (sort: ProductSortOption) => {
      updateUrl({ sort, page: null });
    },
    [updateUrl]
  );

  const setSearchQuery = useCallback(
    (q: string) => {
      updateUrl({ q: q.trim() ? q : null, page: null });
    },
    [updateUrl]
  );

  const clearAllFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  const loadMore = useCallback(() => {
    updateUrl({ page: String(currentPage + 1) });
  }, [currentPage, updateUrl]);

  const toggleMobileFilter = useCallback(() => {
    setIsMobileFilterOpen((prev) => !prev);
  }, []);

  const closeMobileFilter = useCallback(() => {
    setIsMobileFilterOpen(false);
  }, []);

  const filterCriteria: ProductFilterCriteria = useMemo(
    () => ({
      collection: activeCollection,
      category: activeCategory,
      size: activeSize,
      color: activeColor,
      pricePreset: activePricePreset,
      minPrice,
      maxPrice,
      searchQuery: qParam,
      sort: activeSort,
    }),
    [
      activeCollection,
      activeCategory,
      activeSize,
      activeColor,
      activePricePreset,
      minPrice,
      maxPrice,
      qParam,
      activeSort,
    ]
  );

  const filteredProducts = useMemo(
    () => filterAndSortProducts(initialProducts, filterCriteria),
    [initialProducts, filterCriteria]
  );

  const totalCount = filteredProducts.length;
  const maxVisibleCount = currentPage * pageSize;
  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, maxVisibleCount),
    [filteredProducts, maxVisibleCount]
  );

  const visibleCount = visibleProducts.length;
  const hasMore = visibleCount < totalCount;

  const hasActiveFilters =
    activeCollection !== "all" ||
    activeCategory !== "all" ||
    activeSize !== "all" ||
    activeColor !== "all" ||
    activePricePreset !== "all" ||
    Boolean(qParam);

  return {
    // Current filter states
    activeCollection,
    activeCategory,
    activeSize,
    activeColor,
    activePricePreset,
    activeSort,
    searchQuery: qParam,
    hasActiveFilters,
    // Actions
    setActiveCollection,
    setActiveCategory,
    setActiveSize,
    setActiveColor,
    setActivePricePreset,
    setActiveSort,
    setSearchQuery,
    clearAllFilters,
    loadMore,
    // Mobile Drawer State
    isMobileFilterOpen,
    toggleMobileFilter,
    closeMobileFilter,
    // Data & Pagination
    products: visibleProducts,
    allFilteredProducts: filteredProducts,
    totalCount,
    visibleCount,
    hasMore,
    currentPage,
  };
}

export type ShopViewModel = ReturnType<typeof useShopViewModel>;
