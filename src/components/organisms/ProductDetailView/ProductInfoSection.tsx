"use client";

import React from "react";
import { Product, ProductColorId, ProductColorVariant, ProductSize } from "@/models/types/product";
import { ColorSelector } from "@/components/molecules/ColorSelector";
import { SizeSelector } from "@/components/molecules/SizeSelector";
import { QuantitySelector } from "@/components/molecules/QuantitySelector";
import { StockStatus } from "@/models/domain/productRules";
import { formatIDR, cn } from "@/lib/utils";

export interface ProductInfoSectionProps {
  product: Product;
  activeColor: ProductColorVariant;
  selectedColorId: ProductColorId;
  selectedSize: ProductSize | null;
  availableSizes: ProductSize[];
  oneSize: boolean;
  quantity: number;
  currentStock: number;
  stockStatus: StockStatus;
  isAddToCartDisabled: boolean;
  errorMessage: string | null;
  onSelectColor: (colorId: ProductColorId) => void;
  onSelectSize: (size: ProductSize) => void;
  onChangeQuantity: (qty: number) => void;
  onAddToBag: () => void;
}

export function ProductInfoSection({
  product,
  activeColor,
  selectedColorId,
  selectedSize,
  availableSizes,
  oneSize,
  quantity,
  currentStock,
  stockStatus,
  isAddToCartDisabled,
  errorMessage,
  onSelectColor,
  onSelectSize,
  onChangeQuantity,
  onAddToBag,
}: ProductInfoSectionProps) {
  return (
    <div className="flex flex-col">
      {/* Title & Price Header */}
      <div className="border-b border-line pb-6">
        <div className="flex items-center justify-between gap-4">
          <span className="eyebrow inline-block border-l-3 border-l-[var(--accent)] pl-2 text-ink uppercase">
            {product.collection}
          </span>

          {/* Stock Availability Badge */}
          <span
            className={cn(
              "px-2.5 py-1 text-[9px] font-semibold tracking-[0.1em] uppercase",
              stockStatus === "in_stock" && "bg-surface-raised text-ink border border-line",
              stockStatus === "low_stock" &&
                "bg-amber-500/10 text-amber-700 border border-amber-500/30",
              stockStatus === "out_of_stock" &&
                "bg-red-500/10 text-red-700 border border-red-500/30"
            )}
            aria-live="polite"
          >
            {stockStatus === "in_stock" && (oneSize || selectedSize ? "IN STOCK" : "AVAILABLE")}
            {stockStatus === "low_stock" && `LOW STOCK — ONLY ${currentStock} LEFT`}
            {stockStatus === "out_of_stock" && "OUT OF STOCK"}
          </span>
        </div>

        <h1 className="mt-3 font-display text-[clamp(28px,4vw,44px)] font-bold tracking-[-0.04em] text-ink uppercase">
          {product.name}
        </h1>
        <p className="mt-2 text-sm font-medium text-ink">{formatIDR(product.price)}</p>
      </div>

      {/* Description */}
      <div className="border-b border-line py-6">
        <p className="text-xs leading-relaxed text-muted">{product.description}</p>
      </div>

      {/* Color Selector */}
      <div className="border-b border-line py-6">
        <span className="eyebrow block text-muted">COLOR / {activeColor.name}</span>
        <div className="mt-3">
          <ColorSelector
            colors={product.colors}
            selectedColorId={selectedColorId}
            onSelectColor={onSelectColor}
          />
        </div>
      </div>

      {/* Size Selector */}
      {!oneSize && (
        <div className="border-b border-line py-6">
          <div className="flex items-center justify-between">
            <span className="eyebrow text-muted">
              SIZE {selectedSize ? `/ ${selectedSize}` : "— SELECT SIZE"}
            </span>
          </div>
          <div className="mt-3">
            <SizeSelector
              availableSizes={availableSizes}
              selectedSize={selectedSize ?? undefined}
              onSelectSize={onSelectSize}
              sizesWithStock={activeColor.stockBySize}
              className="my-0 mb-0"
            />
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="border-b border-line py-6">
        <div className="flex items-center justify-between">
          <span className="eyebrow text-muted">QUANTITY</span>
          {currentStock > 0 && (
            <span className="text-[10px] tracking-[0.06em] text-muted">
              {currentStock} available
            </span>
          )}
        </div>
        <div className="mt-3">
          <QuantitySelector
            quantity={quantity}
            onIncrease={() => onChangeQuantity(quantity + 1)}
            onDecrease={() => onChangeQuantity(Math.max(1, quantity - 1))}
          />
        </div>
      </div>

      {/* Inline Error Message */}
      {errorMessage && (
        <p
          className="mt-4 border-l-2 border-red-600 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-700"
          role="alert"
        >
          {errorMessage}
        </p>
      )}

      {/* Add To Bag Action */}
      <div className="mt-6">
        <button
          type="button"
          onClick={onAddToBag}
          disabled={isAddToCartDisabled}
          className={cn(
            "flex min-h-12 w-full cursor-pointer items-center justify-center px-6 py-4 text-xs font-semibold tracking-[0.08em] uppercase transition-colors",
            isAddToCartDisabled
              ? "bg-muted/30 text-muted cursor-not-allowed border border-line"
              : "bg-button text-button-text hover:bg-button-hover"
          )}
        >
          {stockStatus === "out_of_stock" && (oneSize || selectedSize)
            ? "OUT OF STOCK"
            : `ADD TO BAG • ${formatIDR(product.price * quantity)}`}
        </button>
      </div>
    </div>
  );
}
