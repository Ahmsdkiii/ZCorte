"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Product, ProductCollection } from "@/models/types/product";

type SortMode = "featured" | "price-asc" | "price-desc";

export function useShopViewModel(initialProducts: Product[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const collectionParam = searchParams.get("collection");
  const sortParam = searchParams.get("sort");
  const initialCollection: ProductCollection | "all" =
    collectionParam === "tactix" || collectionParam === "apextive" || collectionParam === "outdoor"
      ? collectionParam
      : "all";
  const initialSort: SortMode =
    sortParam === "price-asc" || sortParam === "price-desc" ? sortParam : "featured";

  const [activeCollection, setCollectionState] = useState<ProductCollection | "all">(
    initialCollection
  );
  const [activeSort, setSortState] = useState<SortMode>(initialSort);

  const updateUrl = useCallback(
    (collection: ProductCollection | "all", sort: SortMode) => {
      const params = new URLSearchParams();
      if (collection !== "all") params.set("collection", collection);
      if (sort !== "featured") params.set("sort", sort);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router]
  );

  const setActiveCollection = useCallback(
    (collection: ProductCollection | "all") => {
      setCollectionState(collection);
      updateUrl(collection, activeSort);
    },
    [activeSort, updateUrl]
  );

  const setActiveSort = useCallback(
    (sort: SortMode) => {
      setSortState(sort);
      updateUrl(activeCollection, sort);
    },
    [activeCollection, updateUrl]
  );

  const sortedProducts = useMemo(() => {
    const filteredProducts = initialProducts.filter(
      (product) => activeCollection === "all" || product.collection === activeCollection
    );

    return filteredProducts.toSorted((a, b) => {
      if (activeSort === "price-asc") return a.price - b.price;
      if (activeSort === "price-desc") return b.price - a.price;
      return 0;
    });
  }, [activeCollection, activeSort, initialProducts]);

  return {
    activeCollection,
    setActiveCollection,
    activeSort,
    setActiveSort,
    products: sortedProducts,
    totalCount: sortedProducts.length,
  };
}
