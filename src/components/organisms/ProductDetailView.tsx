"use client";

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Product } from "@/models/types/product";
import { useProductDetailViewModel } from "@/hooks/useProductDetailViewModel";
import { ProductGallerySection } from "./ProductDetailView/ProductGallerySection";
import { ProductInfoSection } from "./ProductDetailView/ProductInfoSection";
import { ProductAccordionSection } from "./ProductDetailView/ProductAccordionSection";

const FullscreenGalleryDialog = dynamic(
  () =>
    import("@/components/compound/ProductGallery").then((module) => module.FullscreenGalleryDialog),
  { ssr: false }
);

export function ProductDetailView({ product }: { product: Product }) {
  const {
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
  } = useProductDetailViewModel(product);

  const currentImage = galleryImages[activeImageIndex] || activeColor.images.front;

  return (
    <div className="w-full" data-collection={product.collection}>
      <nav
        aria-label="Breadcrumb"
        className="mb-[26px] flex flex-wrap items-center gap-2 text-[8px] leading-[1.8] tracking-[0.06em] text-muted uppercase md:text-[9px]"
      >
        <Link href="/" className="hover:text-ink">
          APEX
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-ink">
          SHOP
        </Link>
        <span>/</span>
        <Link href={`/collections/${product.collection}`} className="hover:text-ink">
          {product.collection}
        </Link>
        <span>/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 items-start gap-[30px] md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-[clamp(32px,6vw,100px)]">
        <ProductGallerySection
          product={product}
          activeColor={activeColor}
          galleryImages={galleryImages}
          activeImageIndex={activeImageIndex}
          onSelectImage={setActiveImageIndex}
          onOpenFullscreen={() => setIsFullscreen(true)}
          onNextImage={nextImage}
          onPrevImage={prevImage}
        />

        <div>
          <ProductInfoSection
            product={product}
            activeColor={activeColor}
            selectedColorId={selectedColorId}
            selectedSize={selectedSize}
            availableSizes={availableSizes}
            oneSize={oneSize}
            quantity={quantity}
            errorMessage={errorMessage}
            onSelectColor={handleSelectColor}
            onSelectSize={handleSelectSize}
            onChangeQuantity={setQuantity}
            onAddToBag={handleAddToBag}
          />

          <ProductAccordionSection product={product} />
        </div>
      </div>

      {isFullscreen && (
        <FullscreenGalleryDialog
          productName={product.name}
          image={currentImage}
          imageIndex={activeImageIndex}
          imageCount={galleryImages.length}
          onClose={() => setIsFullscreen(false)}
          onPrevious={prevImage}
          onNext={nextImage}
        />
      )}
    </div>
  );
}
