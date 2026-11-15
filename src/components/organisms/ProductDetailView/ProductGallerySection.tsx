"use client";

import React from "react";
import Image from "next/image";
import { Product, ProductColorVariant } from "@/models/types/product";

export interface ProductGallerySectionProps {
  product: Product;
  activeColor: ProductColorVariant;
  galleryImages: string[];
  activeImageIndex: number;
  onSelectImage: (index: number) => void;
  onOpenFullscreen: () => void;
  onNextImage: () => void;
  onPrevImage: () => void;
}

export function ProductGallerySection({
  product,
  activeColor,
  galleryImages,
  activeImageIndex,
  onSelectImage,
  onOpenFullscreen,
  onNextImage,
  onPrevImage,
}: ProductGallerySectionProps) {
  const currentImage = galleryImages[activeImageIndex] || activeColor.images.front;
  const currentNum = String(activeImageIndex + 1).padStart(2, "0");
  const totalNum = String(galleryImages.length).padStart(2, "0");

  return (
    <div className="relative min-w-0">
      <button
        type="button"
        onClick={onOpenFullscreen}
        aria-label="Expand fullscreen gallery"
        className="absolute top-4 right-4 z-1 min-h-11 bg-surface-raised/90 px-3 text-[9px] tracking-[0.08em] text-ink transition-colors hover:bg-surface-secondary"
      >
        EXPAND ↗
      </button>

      <div className="relative aspect-4/5 overflow-hidden bg-surface-raised touch-pan-y">
        <Image
          key={currentImage}
          src={currentImage}
          alt={`${product.name} concept in ${activeColor.name}, view ${activeImageIndex + 1}`}
          fill
          priority
          sizes="(max-width: 767px) 100vw, 60vw"
          className="animate-product-fade object-contain"
        />
      </div>

      <div className="my-3 flex items-center justify-between gap-3 text-muted">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevImage}
            aria-label="Previous image"
            className="flex min-h-11 cursor-pointer items-center gap-1.5 p-1 text-[9px] tracking-[0.08em] text-ink hover:text-muted"
          >
            &larr; PREV
          </button>
          <button
            type="button"
            onClick={onNextImage}
            aria-label="Next image"
            className="flex min-h-11 cursor-pointer items-center gap-1.5 p-1 text-[9px] tracking-[0.08em] text-ink hover:text-muted"
          >
            NEXT &rarr;
          </button>
        </div>
        <span className="text-[9px] tracking-[0.08em]" aria-live="polite">
          {currentNum} / {totalNum}
        </span>
      </div>

      <div
        className="flex gap-2 overflow-x-auto pb-2"
        role="tablist"
        aria-label="Product thumbnails"
      >
        {galleryImages.map((img, idx) => (
          <button
            key={img}
            type="button"
            role="tab"
            aria-selected={idx === activeImageIndex}
            onClick={() => onSelectImage(idx)}
            className={`relative h-16 w-14 shrink-0 overflow-hidden border bg-surface-raised transition-colors ${
              idx === activeImageIndex
                ? "border-ink"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <Image
              src={img}
              alt={`${product.name} thumbnail ${idx + 1}`}
              fill
              sizes="56px"
              className="object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
