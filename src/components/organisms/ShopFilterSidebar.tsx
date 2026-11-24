"use client";

import React from "react";
import {
  ALL_CATEGORIES,
  ALL_SIZES,
  ProductCategory,
  ProductColorId,
  ProductSize,
} from "@/models/types/product";
import {
  CATEGORY_LABELS,
  PRICE_RANGE_PRESETS,
  PriceRangePreset,
} from "@/models/domain/productRules";
import { cn } from "@/lib/utils";

const COLOR_SWATCHES: { id: ProductColorId; name: string; hex: string }[] = [
  { id: "graphite", name: "Graphite", hex: "#343939" },
  { id: "olive", name: "Olive", hex: "#676b4c" },
];

interface ShopFilterSidebarProps {
  activeCategory: ProductCategory | "all";
  onSelectCategory: (category: ProductCategory | "all") => void;
  activeSize: ProductSize | "all";
  onSelectSize: (size: ProductSize | "all") => void;
  activeColor: ProductColorId | "all";
  onSelectColor: (color: ProductColorId | "all") => void;
  activePricePreset: string | "all";
  onSelectPricePreset: (preset: string | "all") => void;
  hasActiveFilters: boolean;
  onClearAll: () => void;
  className?: string;
}

export function ShopFilterSidebar({
  activeCategory,
  onSelectCategory,
  activeSize,
  onSelectSize,
  activeColor,
  onSelectColor,
  activePricePreset,
  onSelectPricePreset,
  hasActiveFilters,
  onClearAll,
  className,
}: ShopFilterSidebarProps) {
  return (
    <aside
      aria-label="Filter catalog"
      className={cn("flex flex-col gap-8 text-[11px] tracking-[0.06em]", className)}
    >
      {/* Header with Clear Button */}
      <div className="flex items-center justify-between border-b border-line pb-3">
        <span className="text-[10px] font-bold tracking-[0.14em] text-ink uppercase">FILTERS</span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-[10px] tracking-[0.08em] text-muted underline underline-offset-4 transition-colors hover:text-ink cursor-pointer"
          >
            RESET ALL
          </button>
        )}
      </div>

      {/* Categories */}
      <fieldset className="flex flex-col gap-2.5">
        <legend className="mb-2 text-[10px] font-bold tracking-[0.12em] text-muted uppercase">
          CATEGORY
        </legend>
        <button
          type="button"
          onClick={() => onSelectCategory("all")}
          aria-pressed={activeCategory === "all"}
          className={cn(
            "flex min-h-8 items-center justify-between text-left transition-colors cursor-pointer",
            activeCategory === "all" ? "font-bold text-ink" : "text-muted hover:text-ink"
          )}
        >
          <span>All Categories</span>
          {activeCategory === "all" && <span className="text-[10px]">•</span>}
        </button>
        {ALL_CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(isSelected ? "all" : cat)}
              aria-pressed={isSelected}
              className={cn(
                "flex min-h-8 items-center justify-between text-left transition-colors cursor-pointer",
                isSelected ? "font-bold text-ink" : "text-muted hover:text-ink"
              )}
            >
              <span>{CATEGORY_LABELS[cat]}</span>
              {isSelected && <span className="text-[10px]">•</span>}
            </button>
          );
        })}
      </fieldset>

      {/* Sizes */}
      <fieldset className="flex flex-col gap-3 border-t border-line/60 pt-6">
        <legend className="mb-2 text-[10px] font-bold tracking-[0.12em] text-muted uppercase">
          SIZE
        </legend>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by size">
          <button
            type="button"
            onClick={() => onSelectSize("all")}
            aria-pressed={activeSize === "all"}
            className={cn(
              "flex h-9 min-w-9 items-center justify-center border px-2.5 text-[10px] font-medium transition-colors cursor-pointer",
              activeSize === "all"
                ? "border-ink bg-ink text-surface"
                : "border-line bg-surface text-muted hover:border-ink hover:text-ink"
            )}
          >
            ALL
          </button>
          {ALL_SIZES.map((size) => {
            const isSelected = activeSize === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => onSelectSize(isSelected ? "all" : size)}
                aria-pressed={isSelected}
                className={cn(
                  "flex h-9 min-w-9 items-center justify-center border px-2.5 text-[10px] font-medium transition-colors cursor-pointer",
                  isSelected
                    ? "border-ink bg-ink text-surface"
                    : "border-line bg-surface text-muted hover:border-ink hover:text-ink"
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Colors */}
      <fieldset className="flex flex-col gap-3 border-t border-line/60 pt-6">
        <legend className="mb-2 text-[10px] font-bold tracking-[0.12em] text-muted uppercase">
          COLOR
        </legend>
        <div className="flex flex-col gap-2" role="group" aria-label="Filter by color">
          <button
            type="button"
            onClick={() => onSelectColor("all")}
            aria-pressed={activeColor === "all"}
            className={cn(
              "flex min-h-8 items-center gap-2.5 text-left transition-colors cursor-pointer",
              activeColor === "all" ? "font-bold text-ink" : "text-muted hover:text-ink"
            )}
          >
            <span className="h-3 w-3 rounded-full border border-line bg-surface-raised" />
            <span>All Colors</span>
          </button>
          {COLOR_SWATCHES.map((color) => {
            const isSelected = activeColor === color.id;
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => onSelectColor(isSelected ? "all" : color.id)}
                aria-pressed={isSelected}
                className={cn(
                  "flex min-h-8 items-center gap-2.5 text-left transition-colors cursor-pointer",
                  isSelected ? "font-bold text-ink" : "text-muted hover:text-ink"
                )}
              >
                <span
                  className="h-3 w-3 rounded-full border border-line"
                  style={{ backgroundColor: color.hex }}
                />
                <span>{color.name}</span>
                {isSelected && <span className="ml-auto text-[10px]">•</span>}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Price Presets */}
      <fieldset className="flex flex-col gap-2.5 border-t border-line/60 pt-6">
        <legend className="mb-2 text-[10px] font-bold tracking-[0.12em] text-muted uppercase">
          PRICE RANGE
        </legend>
        <button
          type="button"
          onClick={() => onSelectPricePreset("all")}
          aria-pressed={activePricePreset === "all"}
          className={cn(
            "flex min-h-8 items-center justify-between text-left transition-colors cursor-pointer",
            activePricePreset === "all" ? "font-bold text-ink" : "text-muted hover:text-ink"
          )}
        >
          <span>All Prices</span>
          {activePricePreset === "all" && <span className="text-[10px]">•</span>}
        </button>
        {PRICE_RANGE_PRESETS.map((preset: PriceRangePreset) => {
          const isSelected = activePricePreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPricePreset(isSelected ? "all" : preset.id)}
              aria-pressed={isSelected}
              className={cn(
                "flex min-h-8 items-center justify-between text-left transition-colors cursor-pointer",
                isSelected ? "font-bold text-ink" : "text-muted hover:text-ink"
              )}
            >
              <span>{preset.label}</span>
              {isSelected && <span className="text-[10px]">•</span>}
            </button>
          );
        })}
      </fieldset>
    </aside>
  );
}
