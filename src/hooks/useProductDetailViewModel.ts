"use client";

import { useMemo, useState } from "react";
import { Product, ProductColorId, ProductSize } from "@/models/types/product";
import { useCart } from "@/components/providers/CartProvider";
import {
  getAvailableSizes,
  getGalleryImages,
  getProductColor,
  getProductStock,
  getStockStatus,
  isOneSize,
  StockStatus,
} from "@/models/domain/productRules";

export function useProductDetailViewModel(product: Product) {
  const [selectedColorId, setSelectedColorId] = useState<ProductColorId>(
    product.colors[0]?.id ?? "graphite"
  );
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { addItem } = useCart();

  const activeColor = getProductColor(product, selectedColorId);
  const availableSizes = getAvailableSizes(product, selectedColorId);
  const galleryImages = getGalleryImages(product, selectedColorId);
  const oneSize = isOneSize(product);

  const currentStock = useMemo(
    () => getProductStock(product, selectedColorId, oneSize ? null : selectedSize),
    [product, selectedColorId, oneSize, selectedSize]
  );

  const stockStatus: StockStatus = useMemo(() => {
    if (!oneSize && !selectedSize) {
      // If size is not selected yet, check if any size has stock
      const totalAvailableStock = availableSizes.reduce(
        (sum, s) => sum + getProductStock(product, selectedColorId, s),
        0
      );
      return totalAvailableStock > 0 ? "in_stock" : "out_of_stock";
    }
    return getStockStatus(currentStock);
  }, [oneSize, selectedSize, availableSizes, product, selectedColorId, currentStock]);

  const isAddToCartDisabled =
    (!oneSize && selectedSize !== null && currentStock <= 0) ||
    (oneSize && currentStock <= 0) ||
    quantity > currentStock;

  const handleSelectColor = (colorId: ProductColorId) => {
    setSelectedColorId(colorId);
    setErrorMessage(null);
    const nextAvailable = getAvailableSizes(product, colorId);
    if (selectedSize && !nextAvailable.includes(selectedSize)) {
      setSelectedSize(null);
    }
    if (activeImageIndex >= 2) {
      setActiveImageIndex(0);
    }
  };

  const handleSelectSize = (size: ProductSize) => {
    setSelectedSize(size);
    setErrorMessage(null);
    // Adjust quantity if exceeds new size's stock
    const sizeStock = getProductStock(product, selectedColorId, size);
    if (sizeStock > 0 && quantity > sizeStock) {
      setQuantity(sizeStock);
    }
  };

  const handleChangeQuantity = (newQty: number) => {
    const maxQty = Math.max(1, currentStock > 0 ? currentStock : 10);
    const clamped = Math.min(Math.max(1, newQty), maxQty);
    setQuantity(clamped);
  };

  const handleAddToBag = () => {
    if (!oneSize && !selectedSize) {
      setErrorMessage("Please select a size before adding to your bag.");
      // Focus size selector element if present
      const sizeSelectorElem = document.querySelector<HTMLButtonElement>(
        '[data-testid="size-selector-btn"]'
      );
      sizeSelectorElem?.focus();
      return;
    }

    if (currentStock <= 0) {
      setErrorMessage("This variant is currently out of stock.");
      return;
    }

    if (quantity > currentStock) {
      setErrorMessage(`Only ${currentStock} item(s) available in this variant.`);
      return;
    }

    addItem(product, oneSize ? null : selectedSize, quantity, selectedColorId);
    setErrorMessage(null);
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return {
    selectedColorId,
    activeColor,
    selectedSize,
    availableSizes,
    oneSize,
    quantity,
    setQuantity: handleChangeQuantity,
    activeImageIndex,
    isFullscreen,
    errorMessage,
    galleryImages,
    currentStock,
    stockStatus,
    isAddToCartDisabled,
    handleSelectColor,
    handleSelectSize,
    handleAddToBag,
    nextImage,
    prevImage,
    setActiveImageIndex,
    setIsFullscreen,
  };
}

export type ProductDetailViewModel = ReturnType<typeof useProductDetailViewModel>;
