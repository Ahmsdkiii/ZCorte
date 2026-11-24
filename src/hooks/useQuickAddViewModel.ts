"use client";

import { useMemo, useState } from "react";
import { Product, ProductColorId, ProductSize } from "@/models/types/product";
import { useCart } from "@/components/providers/CartProvider";
import {
  getAvailableSizes,
  getProductStock,
  isOneSize,
  StockStatus,
  getStockStatus,
} from "@/models/domain/productRules";

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
    // Find first size that has stock > 0
    const inStockSize = available.find((s) => getProductStock(product, colorId, s) > 0);

    setSelectedProduct(product);
    setSelectedColorId(colorId);
    setSelectedSize(inStockSize ?? available[0] ?? null);
    setIsOpen(true);
  };

  const handleSelectColor = (colorId: ProductColorId) => {
    setSelectedColorId(colorId);
    if (selectedProduct) {
      const available = getAvailableSizes(selectedProduct, colorId);
      const inStockSize = available.find((s) => getProductStock(selectedProduct, colorId, s) > 0);
      if (selectedSize && !available.includes(selectedSize)) {
        setSelectedSize(inStockSize ?? available[0] ?? null);
      }
    }
  };

  const closeQuickAdd = () => {
    setIsOpen(false);
    setSelectedProduct(null);
    setSelectedSize(null);
  };

  const currentStock = useMemo(() => {
    if (!selectedProduct) return 0;
    return getProductStock(
      selectedProduct,
      selectedColorId,
      isOneSize(selectedProduct) ? null : selectedSize
    );
  }, [selectedProduct, selectedColorId, selectedSize]);

  const stockStatus: StockStatus = useMemo(() => {
    return getStockStatus(currentStock);
  }, [currentStock]);

  const confirmAdd = () => {
    if (!selectedProduct) return;
    if (isOneSize(selectedProduct)) {
      addItem(selectedProduct, null, 1, selectedColorId);
      closeQuickAdd();
      return;
    }
    if (selectedSize && currentStock > 0) {
      addItem(selectedProduct, selectedSize, 1, selectedColorId);
      closeQuickAdd();
    }
  };

  return {
    selectedProduct,
    selectedColorId,
    selectedSize,
    isOpen,
    currentStock,
    stockStatus,
    setSelectedSize,
    handleSelectColor,
    openQuickAdd,
    closeQuickAdd,
    confirmAdd,
  };
}
