"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Product, ProductColorId, ProductSize } from "@/models/types/product";
import { SizeSelector } from "@/components/molecules/SizeSelector";
import { ColorSelector } from "@/components/molecules/ColorSelector";
import { Icon } from "@/components/atoms/Icon";
import { getAvailableSizes, getProductColor } from "@/lib/product";
import { formatIDR } from "@/lib/utils";

export interface QuickAddModalProps {
  product: Product | null;
  selectedColorId: ProductColorId;
  isOpen: boolean;
  selectedSize: ProductSize | null;
  onSelectColor: (colorId: ProductColorId) => void;
  onSelectSize: (size: ProductSize) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export function QuickAddModal({
  product,
  selectedColorId,
  isOpen,
  selectedSize,
  onSelectColor,
  onSelectSize,
  onClose,
  onConfirm,
}: QuickAddModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  if (!product) return null;

  const activeColor = getProductColor(product, selectedColorId);
  const availableSizes = getAvailableSizes(product, selectedColorId);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onCancel={onClose}
      onClick={handleBackdropClick}
      data-collection={product.collection}
      aria-label={`Choose size for ${product.name}`}
      className="fixed inset-0 z-50 m-auto max-h-[90dvh] w-[min(480px,calc(100%-32px))] overflow-auto border border-line bg-surface-raised p-6 md:p-8 text-ink backdrop:bg-black/65 backdrop:backdrop-blur-[3px]"
    >
      <div className="mb-7 flex items-center justify-between gap-5 border-t border-line pt-5">
        <div>
          <p className="eyebrow flex items-center gap-2 text-muted before:block before:h-1.5 before:w-1.5 before:bg-[var(--accent)]">
            APEX / {product.collection.toUpperCase()}
          </p>
          <h2 className="mt-1.5 text-[25px] tracking-[-0.035em]">{product.name}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close size selector"
          className="flex min-h-11 min-w-11 items-center justify-center text-muted hover:text-ink"
        >
          <Icon name="close" size={20} />
        </button>
      </div>

      <div className="mb-6 flex items-center gap-4 border-y border-line py-4">
        <div className="relative aspect-4/5 w-24 shrink-0 bg-surface md:w-28">
          <Image
            src={activeColor.images.front}
            alt={`${product.name} in ${activeColor.name}`}
            fill
            sizes="112px"
            className="object-contain"
          />
        </div>
        <div>
          <p className="text-base font-semibold">{formatIDR(product.price)}</p>
          <p className="mt-1 text-xs text-muted">Color: {activeColor.name}</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted">
            Concept Product &middot; Demo Availability
          </p>
        </div>
      </div>

      <div className="mb-5">
        <div className="mb-2.5 flex gap-5 text-[10px] tracking-[0.08em]">
          COLOR <span className="tracking-normal text-muted">{activeColor.name}</span>
        </div>
        <ColorSelector
          colors={product.colors}
          selectedColorId={selectedColorId}
          onSelectColor={onSelectColor}
        />
      </div>

      <div>
        <div className="flex gap-5 text-[10px] tracking-[0.08em]">
          SIZE <span className="tracking-normal text-muted">{selectedSize ?? "Select a size"}</span>
        </div>
        <SizeSelector
          availableSizes={availableSizes}
          selectedSize={selectedSize ?? undefined}
          onSelectSize={onSelectSize}
        />
      </div>

      <button
        type="button"
        disabled={!selectedSize}
        onClick={onConfirm}
        className="flex min-h-[54px] w-full items-center justify-center bg-button px-[22px] py-[18px] text-[11px] font-semibold tracking-[0.08em] text-button-text transition-colors hover:bg-button-hover disabled:cursor-not-allowed disabled:opacity-40"
      >
        ADD TO BAG &mdash; {formatIDR(product.price)}
      </button>
    </dialog>
  );
}
