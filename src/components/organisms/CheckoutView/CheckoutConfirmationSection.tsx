"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SubmittedOrder } from "@/models/types/checkout";
import { getProductColor } from "@/models/domain/productRules";
import { formatIDR } from "@/lib/utils";

export function CheckoutConfirmationSection({ order }: { order: SubmittedOrder }) {
  return (
    <section
      aria-labelledby="order-confirmed-heading"
      className="mx-auto max-w-[920px] border border-line bg-surface-raised p-6 md:p-12"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-7">
        <div>
          <span className="eyebrow inline-block border-l-3 border-l-ink pl-2 text-ink uppercase">
            ZCORTÉ / ORDER CONFIRMED
          </span>
          <h1
            id="order-confirmed-heading"
            className="mt-3 text-[clamp(30px,4.5vw,52px)] leading-[0.96] tracking-[-0.04em] text-ink uppercase"
          >
            THANK YOU FOR YOUR ORDER.
          </h1>
          <p className="mt-3 max-w-[54ch] text-xs leading-relaxed text-muted">
            Your technical equipment order has been registered in the ZCorté dispatch log. Below is
            your official receipt manifest.
          </p>
        </div>

        <div className="border border-line bg-surface px-4 py-3 text-left md:text-right">
          <span className="eyebrow block text-[8px] text-muted">ORDER REFERENCE</span>
          <strong className="mt-1 block text-sm tracking-[0.06em] text-ink">
            #{order.orderNumber}
          </strong>
          <span className="mt-0.5 block text-[11px] text-muted">{order.createdAt}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 border-b border-line py-7 text-xs md:grid-cols-3">
        <div>
          <span className="eyebrow block text-[8px] text-muted">RECIPIENT &amp; DESTINATION</span>
          <p className="mt-2 font-medium text-ink">
            {order.customer.firstName} {order.customer.lastName}
          </p>
          <p className="mt-1 text-muted">{order.customer.address}</p>
          {order.customer.apartment && <p className="text-muted">{order.customer.apartment}</p>}
          <p className="text-muted">
            {order.customer.city}
            {order.customer.province ? `, ${order.customer.province}` : ""}{" "}
            {order.customer.postalCode}
          </p>
          <p className="mt-1 text-muted">{order.customer.email}</p>
        </div>

        <div>
          <span className="eyebrow block text-[8px] text-muted">DISPATCH TIER</span>
          <p className="mt-2 font-medium text-ink">{order.shippingMethod.label}</p>
          <p className="mt-1 text-muted">Estimated window: {order.shippingMethod.eta}</p>
          <p className="mt-1 text-muted">Contact: {order.customer.phone}</p>
        </div>

        <div>
          <span className="eyebrow block text-[8px] text-muted">SETTLEMENT CHANNEL</span>
          <p className="mt-2 font-medium text-ink">{order.paymentMethod.label}</p>
          <p className="mt-1 text-muted">{order.paymentMethod.subtitle}</p>
          <p className="mt-1 font-medium text-ink">Status: Settlement Authorized (Simulated)</p>
        </div>
      </div>

      <div className="divide-y divide-line py-2" role="list" aria-label="Confirmed items">
        {order.items.map((item) => {
          const color = getProductColor(item.product, item.colorId);
          return (
            <div
              key={item.id}
              role="listitem"
              className="flex items-center justify-between gap-4 py-4"
            >
              <div className="flex items-center gap-4">
                <div className="relative aspect-4/5 w-14 shrink-0 bg-surface">
                  <Image
                    src={color.images.front}
                    alt={item.product.name}
                    fill
                    sizes="56px"
                    className="object-contain p-1"
                  />
                </div>
                <div>
                  <h2 className="text-sm font-bold tracking-[-0.02em] text-ink uppercase">
                    {item.product.name}
                  </h2>
                  <p className="mt-0.5 text-xs text-muted">
                    Color: {color.name} &middot; {item.size ? `Size ${item.size}` : "One Size"}{" "}
                    &middot; Qty {item.quantity}
                  </p>
                </div>
              </div>
              <span className="text-xs font-medium text-ink">
                {formatIDR(item.product.price * item.quantity)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="space-y-2 border-t border-line pt-5 text-xs">
        <div className="flex justify-between text-muted">
          <span>SUBTOTAL</span>
          <span className="text-ink font-medium">{formatIDR(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>SHIPPING</span>
          <span className="text-ink font-medium">
            {order.shippingCost === 0 ? "COMPLIMENTARY" : formatIDR(order.shippingCost)}
          </span>
        </div>
        <div className="flex justify-between border-t border-line pt-3 text-sm font-bold text-ink">
          <span>TOTAL PAID (SIMULATED)</span>
          <span>{formatIDR(order.total)}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-line pt-7">
        <Link
          href="/account"
          className="inline-flex min-h-[50px] items-center justify-center bg-button px-7 py-3.5 text-[11px] font-semibold tracking-[0.08em] text-button-text uppercase transition-colors hover:bg-button-hover cursor-pointer"
        >
          TRACK ORDER &amp; INVOICE ↗
        </Link>
        <Link
          href="/shop"
          className="inline-flex min-h-[50px] items-center justify-center border border-line bg-surface px-7 py-3.5 text-[11px] font-semibold tracking-[0.08em] text-ink uppercase transition-colors hover:border-ink cursor-pointer"
        >
          CONTINUE EXPLORING
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-[50px] items-center justify-center border border-line bg-surface px-7 py-3.5 text-[11px] font-semibold tracking-[0.08em] text-ink uppercase transition-colors hover:border-ink cursor-pointer"
        >
          RETURN HOME
        </Link>
      </div>
    </section>
  );
}
