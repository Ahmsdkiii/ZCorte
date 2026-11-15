"use client";

import { useState } from "react";
import { Product, ProductColorId, ProductColorVariant } from "@/models/types/product";
import { getProductColor } from "@/lib/product";

export interface ProductCardViewModel {
  product: Product;
  selectedColorId: ProductColorId;
  activeColor: ProductColorVariant;
  setSelectedColorId: (colorId: ProductColorId) => void;
}

export function useProductCardViewModel(product: Product): ProductCardViewModel {
  const [selectedColorId, setSelectedColorId] = useState<ProductColorId>(
    product.colors[0]?.id ?? "graphite"
  );

  const activeColor = getProductColor(product, selectedColorId);

  return {
    product,
    selectedColorId,
    activeColor,
    setSelectedColorId,
  };
}
