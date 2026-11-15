"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Icon } from "@/components/atoms/Icon";

interface FullscreenGalleryDialogProps {
  productName: string;
  image: string;
  imageIndex: number;
  imageCount: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function FullscreenGalleryDialog({
  productName,
  image,
  imageIndex,
  imageCount,
  onClose,
  onPrevious,
  onNext,
}: FullscreenGalleryDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();

    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onCancel={onClose}
      aria-labelledby="fullscreen-gallery-title"
      className="fixed inset-0 m-0 h-[100dvh] max-h-none w-full max-w-none bg-black p-4 text-white backdrop:bg-black sm:p-6"
    >
      <div className="grid h-full grid-rows-[auto_1fr_auto]">
        <div className="flex min-h-12 items-center justify-between gap-4 border-b border-white/20 pb-3">
          <h2
            id="fullscreen-gallery-title"
            className="text-xs font-semibold uppercase tracking-widest"
          >
            {productName}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close fullscreen gallery"
            className="grid min-h-11 min-w-11 place-items-center text-white transition-opacity hover:opacity-70"
          >
            <Icon name="close" size={24} />
          </button>
        </div>

        <div className="relative min-h-0 w-full">
          <Image
            src={image}
            alt={`${productName}, expanded view ${imageIndex + 1}`}
            fill
            sizes="100vw"
            className="object-contain py-4"
          />
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center border-t border-white/20 pt-3 text-xs font-semibold uppercase tracking-wider">
          <button
            type="button"
            onClick={onPrevious}
            className="min-h-11 justify-self-start px-2 hover:underline"
          >
            Previous
          </button>
          <span className="px-4 text-white/60" aria-live="polite">
            {imageIndex + 1} / {imageCount}
          </span>
          <button
            type="button"
            onClick={onNext}
            className="min-h-11 justify-self-end px-2 hover:underline"
          >
            Next
          </button>
        </div>
      </div>
    </dialog>
  );
}
