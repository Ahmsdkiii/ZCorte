"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartViewModel } from "@/hooks/useCartViewModel";
import { QuantitySelector } from "@/components/molecules/QuantitySelector";
import { Icon } from "@/components/atoms/Icon";
import { getProductColor } from "@/lib/product";
import { formatIDR } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, totalCount, subtotal, closeCart, removeItem, updateQuantity } =
    useCartViewModel();

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
      closeCart();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={closeCart}
      onCancel={closeCart}
      onClick={handleBackdropClick}
      aria-label="Shopping bag"
      className="fixed inset-y-0 right-0 left-auto z-50 m-0 flex h-dvh max-h-dvh w-[min(560px,100%)] max-w-full flex-col overflow-auto border-0 border-l border-line bg-surface p-5 md:p-8 text-ink animate-drawer-enter backdrop:bg-black/60 backdrop:backdrop-blur-xs"
    >
      <div className="mb-7 flex items-center justify-between gap-5 border-b border-line pb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-[25px] tracking-[-0.035em] uppercase">YOUR BAG</h2>
          <span className="text-xs font-semibold text-muted">({totalCount})</span>
        </div>
        <button
          type="button"
          onClick={closeCart}
          aria-label="Close bag"
          className="flex min-h-11 min-w-11 items-center justify-center text-ink hover:opacity-70"
        >
          <Icon name="close" size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="mx-auto max-w-[650px] py-[35px] md:py-[50px] text-center">
            <p className="eyebrow text-muted">APEX / THE EQUIPMENT EDIT</p>
            <h2 className="my-6 text-[38px] uppercase">YOUR BAG IS EMPTY.</h2>
            <p className="mx-auto mb-7 max-w-[420px] text-muted">
              Explore the APEX equipment system built around readiness, movement, and exploration.
            </p>
            <button
              type="button"
              onClick={closeCart}
              className="mx-auto flex min-h-[54px] w-full max-w-[320px] items-center justify-center bg-button px-[22px] py-[18px] text-[11px] font-semibold tracking-[0.08em] text-button-text hover:bg-button-hover"
            >
              START EXPLORING
            </button>
          </div>
        ) : (
          <div>
            {items.map((item) => {
              const color = getProductColor(item.product, item.colorId);
              return (
                <div
                  key={item.id}
                  data-collection={item.product.collection}
                  className="relative flex gap-4 border-t border-line py-[26px]"
                >
                  <div className="relative aspect-4/5 w-[86px] shrink-0 self-start bg-surface-raised">
                    <Image
                      src={color.images.front}
                      alt={`${item.product.name} in ${color.name}`}
                      fill
                      sizes="86px"
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="eyebrow flex items-center gap-2 text-[8px] text-muted before:block before:h-1.5 before:w-1.5 before:bg-[var(--accent)]">
                      {item.product.collection.toUpperCase()}
                    </p>
                    <h3 className="my-[9px] text-[17px] tracking-[-0.025em]">
                      <Link
                        href={`/shop/${item.product.slug}`}
                        onClick={closeCart}
                        className="hover:underline"
                      >
                        {item.product.name}
                      </Link>
                    </h3>
                    <p className="my-1 text-xs text-muted">
                      Color: <strong>{color.name}</strong>
                      {item.size ? (
                        <>
                          {" "}
                          &middot; Size: <strong>{item.size}</strong>
                        </>
                      ) : (
                        <> &middot; One Size</>
                      )}
                    </p>

                    <div className="mt-[15px] flex items-center gap-4">
                      <QuantitySelector
                        quantity={item.quantity}
                        onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                        onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-[10px] tracking-[0.08em] underline underline-offset-4 text-muted hover:text-ink"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>

                  <div className="whitespace-nowrap text-[11px] font-normal">
                    {formatIDR(item.product.price * item.quantity)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="mt-4 border-t border-line pt-5 md:pt-7">
          <div className="my-4 flex justify-between border-t border-line pt-5 text-[13px]">
            <span>ESTIMATED TOTAL</span>
            <strong className="font-medium">{formatIDR(subtotal)}</strong>
          </div>
          <p className="text-[11px] leading-[1.7] tracking-[0.015em] text-muted">
            Concept catalog &middot; Demo pricing &middot; No real order fulfillment
          </p>
          <Link
            href="/checkout"
            onClick={closeCart}
            className="mt-5 mb-2 flex min-h-[54px] w-full items-center justify-center bg-button px-[22px] py-[18px] text-[11px] font-semibold tracking-[0.08em] text-button-text transition-colors hover:bg-button-hover"
          >
            PROCEED TO CHECKOUT ↗
          </Link>
          <button
            type="button"
            onClick={closeCart}
            className="mx-auto mt-2 block py-2 text-[10px] tracking-[0.08em] underline underline-offset-4"
          >
            CONTINUE EXPLORING
          </button>
        </div>
      )}
    </dialog>
  );
}
