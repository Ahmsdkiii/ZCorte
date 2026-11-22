"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CartItem } from "@/models/types/cart";
import { QuantitySelector } from "@/components/molecules/QuantitySelector";
import { getProductColor } from "@/lib/product";
import { formatIDR } from "@/lib/utils";

export interface CheckoutSummarySectionProps {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  isSubmitting: boolean;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export function CheckoutSummarySection({
  items,
  subtotal,
  shippingCost,
  total,
  isSubmitting,
  onUpdateQuantity,
  onRemoveItem,
}: CheckoutSummarySectionProps) {
  return (
    <aside
      aria-label="Order summary"
      className="border border-line bg-surface-raised p-6 md:sticky md:top-[calc(var(--header-height)+28px)] md:p-8"
    >
      <div className="flex items-baseline justify-between border-b border-line pb-5">
        <div>
          <span className="eyebrow block text-muted">MANIFEST</span>
          <h2 className="mt-1.5 text-[22px] tracking-[-0.03em] text-ink uppercase">
            ORDER SUMMARY
          </h2>
        </div>
        <span className="text-xs font-medium text-muted">
          {items.reduce((acc, item) => acc + item.quantity, 0)} ITEMS
        </span>
      </div>

      <div className="divide-y divide-line">
        {items.map((item) => {
          const color = getProductColor(item.product, item.colorId);
          return (
            <div
              key={item.id}
              data-collection={item.product.collection}
              className="flex gap-4 py-5"
            >
              <div className="relative aspect-4/5 w-[72px] shrink-0 bg-surface">
                <Image
                  src={color.images.front}
                  alt={`${item.product.name} in ${color.name}`}
                  fill
                  sizes="72px"
                  className="object-contain p-1.5"
                />
              </div>

              <div className="min-w-0 flex-1">
                <span className="eyebrow inline-block border-l-2 border-l-[var(--accent)] pl-1.5 text-[8px] text-muted">
                  {item.product.collection}
                </span>
                <div className="mt-1 flex items-baseline justify-between gap-2">
                  <h3 className="truncate text-[15px] tracking-[-0.025em] text-ink uppercase">
                    <Link href={`/shop/${item.product.slug}`} className="hover:underline">
                      {item.product.name}
                    </Link>
                  </h3>
                  <span className="whitespace-nowrap text-xs font-medium text-ink">
                    {formatIDR(item.product.price * item.quantity)}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-muted">
                  {color.name} &middot; {item.size ? `Size ${item.size}` : "One Size"}
                </p>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <QuantitySelector
                    quantity={item.quantity}
                    onIncrease={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    onDecrease={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="cursor-pointer text-[9px] tracking-[0.08em] text-muted underline underline-offset-4 hover:text-ink"
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3 border-t border-line pt-5 text-xs">
        <div className="flex justify-between text-muted">
          <span>SUBTOTAL</span>
          <span className="text-ink">{formatIDR(subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>SHIPPING DISPATCH</span>
          <span className="text-ink">
            {shippingCost === 0 ? "COMPLIMENTARY" : formatIDR(shippingCost)}
          </span>
        </div>
        <div className="flex items-baseline justify-between border-t border-line pt-4 text-sm font-semibold text-ink">
          <span>TOTAL (IDR)</span>
          <span>{formatIDR(total)}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 flex min-h-[54px] w-full cursor-pointer items-center justify-center bg-button px-6 py-4 text-[11px] font-semibold tracking-[0.08em] text-button-text uppercase transition-colors hover:bg-button-hover disabled:opacity-60"
      >
        {isSubmitting ? "PROCESSING DISPATCH..." : `COMPLETE ORDER • ${formatIDR(total)}`}
      </button>

      <p className="mt-3 text-center text-[11px] leading-[1.6] text-muted">
        Concept catalog &middot; Simulated checkout &middot; No real financial charge
      </p>
    </aside>
  );
}
