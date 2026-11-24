"use client";

import React from "react";
import { PaymentMethodId, PaymentMethodOption } from "@/models/types/checkout";
import { cn } from "@/lib/utils";

interface CheckoutPaymentFieldsProps {
  paymentMethods: PaymentMethodOption[];
  paymentMethodId: PaymentMethodId;
  onSelectPayment: (id: PaymentMethodId) => void;
}

export function CheckoutPaymentFields({
  paymentMethods,
  paymentMethodId,
  onSelectPayment,
}: CheckoutPaymentFieldsProps) {
  return (
    <section aria-labelledby="checkout-payment-heading" className="border-t border-line pt-7">
      <span className="eyebrow block text-muted">03 / PAYMENT METHOD (SIMULATION)</span>
      <h2
        id="checkout-payment-heading"
        className="mt-2 mb-5 text-[22px] tracking-[-0.03em] text-ink uppercase md:text-[26px]"
      >
        SETTLEMENT CHANNEL
      </h2>
      <div className="space-y-3" role="radiogroup" aria-label="Payment settlement options">
        {paymentMethods.map((method) => {
          const active = method.id === paymentMethodId;
          return (
            <button
              key={method.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSelectPayment(method.id)}
              className={cn(
                "flex w-full cursor-pointer flex-col gap-1 border p-4 text-left transition-colors md:p-5",
                active
                  ? "border-ink bg-surface-raised font-medium"
                  : "border-line bg-transparent hover:border-control"
              )}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span className="text-xs font-semibold tracking-[0.04em] text-ink uppercase">
                  {method.label}
                </span>
                <span className="text-[10px] tracking-[0.08em] text-muted uppercase">
                  {method.subtitle}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">{method.details}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
