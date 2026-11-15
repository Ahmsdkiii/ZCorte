"use client";

import React from "react";
import { Product } from "@/models/types/product";
import { ProductCard } from "@/components/compound/ProductCard";
import { QuickAddModal } from "@/components/compound/QuickAddModal";
import { useQuickAddViewModel } from "@/hooks/useQuickAddViewModel";
import { cn } from "@/lib/utils";

interface ProductGridClientProps {
  products: Product[];
  fourColsOnWide?: boolean;
}

export function ProductGridClient({ products, fourColsOnWide = false }: ProductGridClientProps) {
  const {
    selectedProduct,
    selectedColorId,
    selectedSize,
    isOpen,
    setSelectedSize,
    handleSelectColor,
    openQuickAdd,
    closeQuickAdd,
    confirmAdd,
  } = useQuickAddViewModel();

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-2 gap-x-3 gap-y-8 max-[359px]:grid-cols-1 md:grid-cols-3 md:gap-x-6 md:gap-y-[50px]",
          fourColsOnWide && "min-[1700px]:grid-cols-4"
        )}
      >
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product}>
            <ProductCard.Visual>
              <ProductCard.Image priority={index < 2} />
              <ProductCard.QuickAdd onQuickAdd={(colorId) => openQuickAdd(product, colorId)} />
            </ProductCard.Visual>
            <ProductCard.Body>
              <ProductCard.Top />
              <ProductCard.TitleRow />
              <ProductCard.ColorSelector />
            </ProductCard.Body>
          </ProductCard>
        ))}
      </div>

      <QuickAddModal
        product={selectedProduct}
        selectedColorId={selectedColorId}
        isOpen={isOpen}
        selectedSize={selectedSize}
        onSelectColor={handleSelectColor}
        onSelectSize={setSelectedSize}
        onConfirm={confirmAdd}
        onClose={closeQuickAdd}
      />
    </>
  );
}
