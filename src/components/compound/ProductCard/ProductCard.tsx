"use client";

import React, { createContext, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, ProductColorId } from "@/models/types/product";
import { ProductCardViewModel, useProductCardViewModel } from "@/hooks/useProductCardViewModel";
import { COLLECTION_LABELS } from "@/lib/product";
import { formatIDR, cn } from "@/lib/utils";

const ProductCardContext = createContext<ProductCardViewModel | null>(null);

export function useProductCardContext() {
  const context = useContext(ProductCardContext);
  if (!context) {
    throw new Error("ProductCard compound components must be within <ProductCard>");
  }
  return context;
}

export interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product;
  children: React.ReactNode;
}

export function ProductCardRoot({ product, children, className, ...props }: ProductCardProps) {
  const vm = useProductCardViewModel(product);

  return (
    <ProductCardContext.Provider value={vm}>
      <article data-collection={product.collection} className={cn("min-w-0", className)} {...props}>
        {children}
      </article>
    </ProductCardContext.Provider>
  );
}

export function ProductCardVisual({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative aspect-[4/5] overflow-hidden border border-line/70 bg-surface-raised transition-colors duration-300 hover:border-ink/40",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ProductCardImage({
  priority = false,
  sizes = "(max-width: 359px) 100vw, (max-width: 767px) 50vw, (min-width: 1700px) 25vw, 33vw",
}: {
  priority?: boolean;
  sizes?: string;
}) {
  const { product, activeColor } = useProductCardContext();

  return (
    <>
      <Link
        href={`/shop/${product.slug}`}
        aria-label={`View ${product.name}`}
        className="absolute inset-0 block"
      >
        <Image
          src={activeColor.images.front}
          alt={`${product.name} concept in ${activeColor.name}, front view`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain p-3 transition-[opacity,transform] duration-500 ease-out group-hover:scale-[1.03] group-hover:opacity-0 md:p-5"
        />
        <Image
          src={activeColor.images.back}
          alt={`${product.name} concept in ${activeColor.name}, back view`}
          fill
          sizes={sizes}
          className="object-contain p-3 opacity-0 transition-[opacity,transform] duration-500 ease-out group-hover:scale-[1.03] group-hover:opacity-100 md:p-5"
        />
      </Link>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-2.5 md:p-3.5">
        <span className="border-l-2 border-l-[var(--accent)] bg-surface-raised/90 px-2 py-1 text-[8px] font-medium tracking-[0.14em] text-ink uppercase backdrop-blur-xs">
          {COLLECTION_LABELS[product.collection]}
        </span>
        <span className="bg-surface-raised/80 px-2 py-1 text-[7px] tracking-[0.12em] text-muted uppercase backdrop-blur-xs">
          CONCEPT
        </span>
      </div>
    </>
  );
}

export function ProductCardQuickAdd({
  onQuickAdd,
}: {
  onQuickAdd: (colorId: ProductColorId) => void;
}) {
  const { product, selectedColorId } = useProductCardContext();

  return (
    <button
      type="button"
      onClick={() => onQuickAdd(selectedColorId)}
      aria-label={`Quick add ${product.name}`}
      className="absolute inset-x-0 bottom-0 z-10 flex min-h-11 w-full cursor-pointer items-center justify-between bg-button/95 px-4 py-2.5 text-[9px] font-semibold tracking-[0.12em] text-button-text uppercase backdrop-blur-xs transition-all duration-300 hover:bg-button-hover md:translate-y-full md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-visible:translate-y-0 md:focus-visible:opacity-100"
    >
      <span>QUICK ADD</span>
      <span className="text-sm leading-none">+</span>
    </button>
  );
}

export function ProductCardBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("mt-3 border-t border-line pt-3.5", className)}>{children}</div>;
}

export function ProductCardTop() {
  return null;
}

export function ProductCardTitleRow() {
  const { product } = useProductCardContext();
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <h3 className="text-[16px] leading-[1.18] font-bold tracking-[-0.03em] text-ink uppercase md:text-[18px]">
        <Link href={`/shop/${product.slug}`} className="transition-colors hover:text-muted">
          {product.name}
        </Link>
      </h3>
      <span className="whitespace-nowrap text-[11px] font-medium text-ink md:text-[12px]">
        {formatIDR(product.price)}
      </span>
    </div>
  );
}

export function ProductCardColorSelector() {
  const { product, selectedColorId, setSelectedColorId } = useProductCardContext();
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Select color">
      {product.colors.map((color) => {
        const isSelected = color.id === selectedColorId;
        return (
          <button
            key={color.id}
            type="button"
            onClick={() => setSelectedColorId(color.id)}
            aria-label={`Select color ${color.name}`}
            aria-pressed={isSelected}
            className={cn(
              "inline-flex min-h-8 cursor-pointer items-center gap-2 border px-2.5 py-1 text-[9px] tracking-[0.06em] uppercase transition-colors",
              isSelected
                ? "border-ink bg-surface-raised font-medium text-ink"
                : "border-line bg-transparent text-muted hover:border-control hover:text-ink"
            )}
          >
            <span
              className="h-2.5 w-2.5 rounded-full border border-control"
              style={{ backgroundColor: color.swatch }}
            />
            <span>{color.name}</span>
          </button>
        );
      })}
    </div>
  );
}

export const ProductCard = Object.assign(ProductCardRoot, {
  Visual: ProductCardVisual,
  Image: ProductCardImage,
  QuickAdd: ProductCardQuickAdd,
  Body: ProductCardBody,
  Top: ProductCardTop,
  TitleRow: ProductCardTitleRow,
  ColorSelector: ProductCardColorSelector,
});
