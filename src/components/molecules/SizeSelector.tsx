"use client";

import React from "react";
import { ALL_SIZES, ProductSize } from "@/models/types/product";
import { cn } from "@/lib/utils";

export interface SizeSelectorProps {
  availableSizes: ProductSize[];
  selectedSize?: ProductSize;
  onSelectSize: (size: ProductSize) => void;
  sizesWithStock?: Partial<Record<ProductSize, number>>;
  className?: string;
}

export function SizeSelector({
  availableSizes,
  selectedSize,
  onSelectSize,
  sizesWithStock,
  className,
}: SizeSelectorProps) {
  return (
    <div
      className={cn("my-3.5 mb-6 flex flex-wrap gap-2", className)}
      role="group"
      aria-label="Available sizes"
    >
      {ALL_SIZES.map((size) => {
        const isSupported = availableSizes.includes(size);
        const stockCount = sizesWithStock ? sizesWithStock[size] : undefined;
        const isOutOfStock = stockCount !== undefined && stockCount <= 0;
        const isDisabled = !isSupported || isOutOfStock;
        const isSelected = selectedSize === size;

        return (
          <button
            key={size}
            type="button"
            data-testid="size-selector-btn"
            disabled={isDisabled}
            aria-pressed={isSelected}
            aria-disabled={isDisabled}
            onClick={() => onSelectSize(size)}
            className={cn(
              "relative min-h-12 min-w-[50px] border px-3 text-xs font-medium transition-colors cursor-pointer",
              isSelected
                ? "border-button bg-button text-button-text after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:bg-[var(--accent)]"
                : "border-control bg-transparent text-ink hover:border-ink",
              isDisabled && "cursor-not-allowed line-through opacity-40 hover:border-control"
            )}
          >
            {size}
            {isOutOfStock && isSupported && <span className="sr-only"> (out of stock)</span>}
          </button>
        );
      })}
    </div>
  );
}
