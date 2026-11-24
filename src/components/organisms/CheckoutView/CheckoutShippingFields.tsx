"use client";

import React from "react";
import { ShippingMethodId, ShippingMethodOption } from "@/models/types/checkout";
import { formatIDR, cn } from "@/lib/utils";

interface CheckoutShippingFieldsProps {
  shippingMethods: ShippingMethodOption[];
  shippingMethodId: ShippingMethodId;
  onSelectShipping: (id: ShippingMethodId) => void;
}

export function CheckoutShippingFields({
  shippingMethods,
  shippingMethodId,
  onSelectShipping,
}: CheckoutShippingFieldsProps) {
  return (
    <section aria-labelledby="checkout-shipping-heading" className="border-t border-line pt-7">
      <span className="eyebrow block text-muted">02 / DISPATCH METHOD</span>
      <h2
        id="checkout-shipping-heading"
        className="mt-2 mb-5 text-[22px] tracking-[-0.03em] text-ink uppercase md:text-[26px]"
      >
        SELECT COURIER TIER
      </h2>
      <div className="space-y-3" role="radiogroup" aria-label="Shipping method options">
        {shippingMethods.map((method) => {
          const active = method.id === shippingMethodId;
          return (
            <button
              key={method.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSelectShipping(method.id)}
              className={cn(
                "flex w-full cursor-pointer items-start justify-between gap-4 border p-4 text-left transition-colors md:p-5",
                active
                  ? "border-ink bg-surface-raised font-medium"
                  : "border-line bg-transparent hover:border-control"
              )}
            >
              <div>
                <p className="text-xs font-semibold tracking-[0.04em] text-ink uppercase">
                  {method.label} <span className="ml-2 font-normal text-muted">({method.eta})</span>
                </p>
                <p className="mt-1 text-xs text-muted">{method.description}</p>
              </div>
              <span className="whitespace-nowrap text-xs font-medium text-ink">
                {method.price === 0 ? "COMPLIMENTARY" : formatIDR(method.price)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
