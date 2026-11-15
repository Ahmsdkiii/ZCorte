"use client";

import React from "react";
import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/utils";

export interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
  className,
}: QuantitySelectorProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center border border-control h-11 bg-surface-raised",
        className
      )}
    >
      <button
        type="button"
        disabled={quantity <= min}
        onClick={onDecrease}
        aria-label="Decrease quantity"
        className="w-11 h-full flex items-center justify-center text-ink hover:bg-surface-secondary disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
      >
        <Icon name="minus" size={14} />
      </button>
      <span
        className="w-9 text-center text-xs font-semibold tabular-nums text-ink"
        aria-live="polite"
      >
        {quantity}
      </span>
      <button
        type="button"
        disabled={quantity >= max}
        onClick={onIncrease}
        aria-label="Increase quantity"
        className="w-11 h-full flex items-center justify-center text-ink hover:bg-surface-secondary disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
      >
        <Icon name="plus" size={14} />
      </button>
    </div>
  );
}
