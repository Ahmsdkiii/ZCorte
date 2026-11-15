"use client";

import { useState } from "react";
import { Product, ProductColorId, ProductSize } from "@/models/types/product";
import { useCart } from "@/components/providers/CartProvider";
import { getAvailableSizes, getGalleryImages, getProductColor, isOneSize } from "@/lib/product";

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
  };

  const handleAddToBag = () => {
    if (!oneSize && !selectedSize) {
      setErrorMessage("Please choose a size before adding to bag.");
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
    setQuantity,
    activeImageIndex,
    isFullscreen,
    errorMessage,
    galleryImages,
    handleSelectColor,
    handleSelectSize,
    handleAddToBag,
    nextImage,
    prevImage,
    setActiveImageIndex,
    setIsFullscreen,
  };
}
