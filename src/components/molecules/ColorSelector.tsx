"use client";

import React from "react";
import { ProductColorId, ProductColorVariant } from "@/models/types/product";
import { cn } from "@/lib/utils";

export interface ColorSelectorProps {
  colors: ProductColorVariant[];
  selectedColorId: ProductColorId;
  onSelectColor: (colorId: ProductColorId) => void;
  className?: string;
}

export function ColorSelector({
  colors,
  selectedColorId,
  onSelectColor,
  className,
}: ColorSelectorProps) {
  return (
    <fieldset className={cn("m-0 flex gap-[7px] border-0 p-0", className)}>
      <legend className="sr-only">Color</legend>
      {colors.map((color) => {
        const isSelected = selectedColorId === color.id;
        return (
          <button
            key={color.id}
            type="button"
            aria-label={color.name}
            aria-pressed={isSelected}
            title={color.name}
            onClick={() => onSelectColor(color.id)}
            className={cn(
              "relative h-9 w-9 border transition-all cursor-pointer",
              isSelected
                ? "border-ink after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:bg-[var(--accent)]"
                : "border-transparent hover:border-muted/60"
            )}
          >
            <span
              aria-hidden="true"
              style={{ backgroundColor: color.swatch }}
              className="absolute inset-[7px] rounded-full border border-control"
            />
          </button>
        );
      })}
    </fieldset>
  );
}
