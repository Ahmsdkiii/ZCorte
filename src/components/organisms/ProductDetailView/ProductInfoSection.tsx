"use client";

import React from "react";
import { Product, ProductColorId, ProductColorVariant, ProductSize } from "@/models/types/product";
import { ColorSelector } from "@/components/molecules/ColorSelector";
import { SizeSelector } from "@/components/molecules/SizeSelector";
import { QuantitySelector } from "@/components/molecules/QuantitySelector";
import { formatIDR } from "@/lib/utils";

export interface ProductInfoSectionProps {
  product: Product;
  activeColor: ProductColorVariant;
  selectedColorId: ProductColorId;
  selectedSize: ProductSize | null;
  availableSizes: ProductSize[];
  oneSize: boolean;
  quantity: number;
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
  errorMessage,
  onSelectColor,
  onSelectSize,
  onChangeQuantity,
  onAddToBag,
}: ProductInfoSectionProps) {
  return (
    <div className="flex flex-col">
      <div className="border-b border-line pb-6">
        <span className="eyebrow inline-block border-l-3 border-l-[var(--accent)] pl-2 text-ink">
          {product.collection}
        </span>
        <h1 className="mt-2 font-display text-[clamp(28px,4vw,44px)] font-bold tracking-[-0.04em] text-ink uppercase">
          {product.name}
        </h1>
        <p className="mt-2 text-sm font-medium text-ink">{formatIDR(product.price)}</p>
      </div>

      <div className="border-b border-line py-6">
        <p className="text-xs leading-relaxed text-muted">{product.description}</p>
      </div>

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

      {!oneSize && (
        <div className="border-b border-line py-6">
          <div className="flex items-center justify-between">
            <span className="eyebrow text-muted">SIZE {selectedSize && `/ ${selectedSize}`}</span>
          </div>
          <div className="mt-3">
            <SizeSelector
              availableSizes={availableSizes}
              selectedSize={selectedSize ?? undefined}
              onSelectSize={onSelectSize}
              className="my-0 mb-0"
            />
          </div>
        </div>
      )}

      <div className="border-b border-line py-6">
        <span className="eyebrow block text-muted">QUANTITY</span>
        <div className="mt-3">
          <QuantitySelector
            quantity={quantity}
            onIncrease={() => onChangeQuantity(quantity + 1)}
            onDecrease={() => onChangeQuantity(Math.max(1, quantity - 1))}
          />
        </div>
      </div>

      {errorMessage && (
        <p className="mt-4 text-xs font-medium text-red-600" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="mt-6">
        <button
          type="button"
          onClick={onAddToBag}
          className="flex min-h-12 w-full cursor-pointer items-center justify-center bg-button px-6 py-4 text-xs font-semibold tracking-[0.08em] text-button-text uppercase transition-colors hover:bg-button-hover"
        >
          ADD TO BAG &bull; {formatIDR(product.price * quantity)}
        </button>
      </div>
    </div>
  );
}
