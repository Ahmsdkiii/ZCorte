"use client";

import React from "react";
import { Product, ProductCollection } from "@/models/types/product";
import { useShopViewModel } from "@/hooks/useShopViewModel";
import { ProductGridClient } from "@/components/organisms/ProductGridClient";
import { ShopFilterSidebar } from "@/components/organisms/ShopFilterSidebar";
import { cn } from "@/lib/utils";

const COLLECTIONS: { id: ProductCollection | "all"; label: string }[] = [
  { id: "all", label: "ALL COLLECTIONS" },
  { id: "tactix", label: "ZCORTÉ TACTIX" },
  { id: "apextive", label: "APEXTIVE" },
  { id: "outdoor", label: "ZCORTÉ OUTDOOR" },
];

export function ShopBrowser({ initialProducts }: { initialProducts: Product[] }) {
  const {
    activeCollection,
    setActiveCollection,
    activeCategory,
    setActiveCategory,
    activeSize,
    setActiveSize,
    activeColor,
    setActiveColor,
    activePricePreset,
    setActivePricePreset,
    activeSort,
    setActiveSort,
    hasActiveFilters,
    clearAllFilters,
    isMobileFilterOpen,
    toggleMobileFilter,
    closeMobileFilter,
    products,
    totalCount,
    visibleCount,
    hasMore,
    loadMore,
  } = useShopViewModel(initialProducts);

  return (
    <div
      className="w-full"
      {...(activeCollection !== "all" ? { "data-collection": activeCollection } : {})}
    >
      {/* Collection Navigation & Controls Bar */}
      <div className="grid border-y border-line md:grid-cols-[1fr_auto] md:items-stretch">
        <nav
          aria-label="Filter by collection"
          className="flex w-full overflow-x-auto no-scrollbar justify-between gap-4 md:justify-start md:gap-8"
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
                  "relative min-h-12 py-2 whitespace-nowrap text-[10px] tracking-[0.1em] transition-colors md:min-h-16 md:text-[11px] cursor-pointer",
                  isActive
                    ? "text-ink font-semibold after:absolute after:inset-x-0 after:bottom-[-1px] after:h-0.5 after:bg-[var(--accent)]"
                    : "text-muted hover:text-ink"
                )}
              >
                {c.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center justify-between border-t border-line text-[10px] tracking-[0.08em] text-muted md:border-t-0 md:border-l md:pl-7">
          {/* Mobile Filter Toggle Button */}
          <button
            type="button"
            onClick={toggleMobileFilter}
            aria-expanded={isMobileFilterOpen}
            className="flex min-h-12 items-center gap-2 border-r border-line pr-5 text-ink md:hidden cursor-pointer"
          >
            <span>FILTERS</span>
            {hasActiveFilters && (
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />
            )}
          </button>

          {/* Sort Selector */}
          <label className="flex min-h-12 items-center gap-3 pl-4 md:min-h-16 md:pl-0">
            <span>SORT</span>
            <select
              value={activeSort}
              onChange={(e) =>
                setActiveSort(
                  e.target.value as "featured" | "price-asc" | "price-desc" | "name-asc"
                )
              }
              aria-label="Sort products"
              className="min-h-11 border-0 bg-surface px-1 text-xs text-ink cursor-pointer focus-visible:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Product Name (A-Z)</option>
            </select>
          </label>
        </div>
      </div>

      {/* Catalog Main Layout: Sidebar (Desktop) + Product Grid */}
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr] md:gap-12 lg:grid-cols-[250px_1fr]">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <ShopFilterSidebar
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            activeSize={activeSize}
            onSelectSize={setActiveSize}
            activeColor={activeColor}
            onSelectColor={setActiveColor}
            activePricePreset={activePricePreset}
            onSelectPricePreset={setActivePricePreset}
            hasActiveFilters={hasActiveFilters}
            onClearAll={clearAllFilters}
          />
        </div>

        {/* Product Grid Area */}
        <div className="flex flex-col">
          {/* Status Bar */}
          <div
            className="flex items-center justify-between pb-6 text-[10px] tracking-[0.1em] text-muted"
            aria-live="polite"
          >
            <span>
              SHOWING {visibleCount} OF {totalCount} {totalCount === 1 ? "PRODUCT" : "PRODUCTS"}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="py-1 text-[10px] tracking-[0.08em] text-ink underline underline-offset-4 hover:text-muted cursor-pointer"
              >
                CLEAR ALL FILTERS
              </button>
            )}
          </div>

          {/* Empty State */}
          {products.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center border border-dashed border-line p-8 text-center">
              <p className="text-[14px] font-medium text-ink">NO PRODUCTS FOUND</p>
              <p className="mt-2 max-w-sm text-[12px] text-muted leading-relaxed">
                No items match your active filter criteria. Try resetting one or more filters to
                explore the ZCorté collection.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-6 border border-ink bg-ink px-6 py-3 text-[10px] font-bold tracking-[0.14em] text-surface uppercase transition-colors hover:bg-surface hover:text-ink cursor-pointer"
              >
                CLEAR FILTERS
              </button>
            </div>
          ) : (
            <>
              <ProductGridClient products={products} fourColsOnWide={false} />

              {/* Load More Pagination */}
              {hasMore && (
                <div className="mt-12 flex justify-center border-t border-line pt-8">
                  <button
                    type="button"
                    onClick={loadMore}
                    className="border border-line bg-surface px-8 py-3.5 text-[10px] font-bold tracking-[0.14em] text-ink uppercase transition-colors hover:border-ink hover:bg-surface-raised cursor-pointer"
                  >
                    LOAD MORE ({totalCount - visibleCount} REMAINING)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer Modal */}
      {isMobileFilterOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filter catalog options"
          className="fixed inset-0 z-50 flex md:hidden"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={closeMobileFilter}
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <div className="relative ml-auto flex h-full w-[85%] max-w-sm flex-col bg-surface p-6 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <span className="text-[12px] font-bold tracking-[0.12em] text-ink uppercase">
                FILTERS
              </span>
              <button
                type="button"
                onClick={closeMobileFilter}
                aria-label="Close filters"
                className="p-2 text-ink text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 flex-1">
              <ShopFilterSidebar
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                activeSize={activeSize}
                onSelectSize={setActiveSize}
                activeColor={activeColor}
                onSelectColor={setActiveColor}
                activePricePreset={activePricePreset}
                onSelectPricePreset={setActivePricePreset}
                hasActiveFilters={hasActiveFilters}
                onClearAll={clearAllFilters}
              />
            </div>

            <div className="mt-8 border-t border-line pt-4">
              <button
                type="button"
                onClick={closeMobileFilter}
                className="w-full bg-ink py-3 text-[10px] font-bold tracking-[0.14em] text-surface uppercase cursor-pointer"
              >
                VIEW {totalCount} {totalCount === 1 ? "RESULT" : "RESULTS"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
