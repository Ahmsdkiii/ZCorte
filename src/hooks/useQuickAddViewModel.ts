"use client";

import { useState } from "react";
import { Product, ProductColorId, ProductSize } from "@/models/types/product";
import { useCart } from "@/components/providers/CartProvider";
import { getAvailableSizes, isOneSize } from "@/lib/product";

export function useQuickAddViewModel() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<ProductColorId>("graphite");
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { addItem } = useCart();

  const openQuickAdd = (product: Product, initialColorId?: ProductColorId) => {
    const colorId = initialColorId ?? product.colors[0]?.id ?? "graphite";
    if (isOneSize(product)) {
      addItem(product, null, 1, colorId);
      return;
    }
    const available = getAvailableSizes(product, colorId);
    setSelectedProduct(product);
    setSelectedColorId(colorId);
    setSelectedSize(available[0] ?? null);
    setIsOpen(true);
  };

  const handleSelectColor = (colorId: ProductColorId) => {
    setSelectedColorId(colorId);
    if (selectedProduct) {
      const available = getAvailableSizes(selectedProduct, colorId);
      if (selectedSize && !available.includes(selectedSize)) {
        setSelectedSize(available[0] ?? null);
      }
    }
  };

  const closeQuickAdd = () => {
    setIsOpen(false);
    setSelectedProduct(null);
    setSelectedSize(null);
  };

  const confirmAdd = () => {
    if (!selectedProduct) return;
    if (isOneSize(selectedProduct)) {
      addItem(selectedProduct, null, 1, selectedColorId);
      closeQuickAdd();
      return;
    }
    if (selectedSize) {
      addItem(selectedProduct, selectedSize, 1, selectedColorId);
      closeQuickAdd();
    }
  };

  return {
    selectedProduct,
    selectedColorId,
    selectedSize,
    isOpen,
    setSelectedSize,
    handleSelectColor,
    openQuickAdd,
    closeQuickAdd,
    confirmAdd,
  };
}
