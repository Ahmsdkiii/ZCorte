"use client";

import React from "react";
import { Product, ProductCollection } from "@/models/types/product";
import { useShopViewModel } from "@/hooks/useShopViewModel";
import { ProductGridClient } from "@/components/organisms/ProductGridClient";
import { cn } from "@/lib/utils";

const COLLECTIONS: { id: ProductCollection | "all"; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "tactix", label: "TACTIX" },
  { id: "apextive", label: "APEXTIVE" },
  { id: "outdoor", label: "OUTDOOR" },
];

export function ShopBrowser({ initialProducts }: { initialProducts: Product[] }) {
  const { activeCollection, setActiveCollection, activeSort, setActiveSort, products, totalCount } =
    useShopViewModel(initialProducts);

  return (
    <div
      className="w-full"
      {...(activeCollection !== "all" ? { "data-collection": activeCollection } : {})}
    >
      <div className="grid border-y border-line md:grid-cols-[1fr_auto] md:items-stretch">
        <nav
          aria-label="Filter by collection"
          className="flex w-full justify-between gap-2 md:justify-start md:gap-8"
        >
          {COLLECTIONS.map((c) => {
            const isActive = activeCollection === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCollection(c.id)}
                aria-pressed={isActive}
                {...(c.id !== "all" ? { "data-collection": c.id } : {})}
                className={cn(
                  "relative min-h-12 py-2 text-[10px] tracking-[0.1em] transition-colors md:min-h-16 md:text-[11px]",
                  isActive
                    ? "text-ink after:absolute after:inset-x-0 after:bottom-[-1px] after:h-0.5 after:bg-[var(--accent)]"
                    : "text-muted hover:text-ink"
                )}
              >
                {c.label}
              </button>
            );
          })}
        </nav>

        <label className="flex min-h-12 items-center justify-end gap-3 border-t border-line text-[10px] tracking-[0.08em] text-muted md:min-h-16 md:border-t-0 md:border-l md:pl-7">
          <span>SORT</span>
          <select
            value={activeSort}
            onChange={(e) =>
              setActiveSort(e.target.value as "featured" | "price-asc" | "price-desc")
            }
            aria-label="Sort products"
            className="min-h-11 border-0 bg-surface px-1 text-xs text-ink cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </label>
      </div>

      <div className="flex items-center justify-between py-5 text-[10px] tracking-[0.1em] text-muted md:py-[25px]">
        <span>
          SHOWING {totalCount} {totalCount === 1 ? "CONCEPT" : "CONCEPTS"}
        </span>
        {activeCollection !== "all" && (
          <button
            type="button"
            onClick={() => setActiveCollection("all")}
            className="py-2 text-[10px] tracking-[0.08em] text-ink underline underline-offset-[5px]"
          >
            CLEAR FILTER
          </button>
        )}
      </div>

      <ProductGridClient products={products} fourColsOnWide />
    </div>
  );
}
