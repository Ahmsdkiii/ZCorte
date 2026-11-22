"use client";

import React from "react";
import Link from "next/link";
import { useCheckoutViewModel } from "@/hooks/useCheckoutViewModel";
import { CheckoutFormSection } from "./CheckoutView/CheckoutFormSection";
import { CheckoutSummarySection } from "./CheckoutView/CheckoutSummarySection";
import { CheckoutConfirmationSection } from "./CheckoutView/CheckoutConfirmationSection";

export function CheckoutView() {
  const {
    items,
    subtotal,
    shippingCost,
    total,
    form,
    errors,
    shippingMethods,
    paymentMethods,
    shippingMethodId,
    paymentMethodId,
    isSubmitting,
    submittedOrder,
    updateField,
    setShippingMethodId,
    setPaymentMethodId,
    updateQuantity,
    removeItem,
    handleSubmitOrder,
  } = useCheckoutViewModel();

  return (
    <div className="w-full">
      <nav
        aria-label="Breadcrumb"
        className="mb-7 flex flex-wrap items-center gap-2 text-[8px] leading-[1.8] tracking-[0.06em] text-muted uppercase md:text-[9px]"
      >
        <Link href="/" className="hover:text-ink">
          APEX
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-ink">
          SHOP
        </Link>
        <span>/</span>
        <span className="text-ink">CHECKOUT</span>
      </nav>

      {submittedOrder ? (
        <CheckoutConfirmationSection order={submittedOrder} />
      ) : items.length === 0 ? (
        <section
          aria-labelledby="empty-checkout-heading"
          className="border border-line bg-surface-raised px-6 py-16 text-center md:py-24"
        >
          <p className="eyebrow text-muted">APEX / DISPATCH QUEUE</p>
          <h1
            id="empty-checkout-heading"
            className="my-5 text-[clamp(32px,5vw,56px)] tracking-[-0.04em] text-ink uppercase"
          >
            YOUR BAG IS EMPTY.
          </h1>
          <p className="mx-auto mb-8 max-w-[44ch] text-xs leading-relaxed text-muted">
            Select technical pieces from the Tactix, Apextive, or Outdoor collections before
            proceeding to equipment dispatch.
          </p>
          <Link
            href="/shop"
            className="mx-auto inline-flex min-h-[52px] items-center justify-center bg-button px-8 py-4 text-[11px] font-semibold tracking-[0.08em] text-button-text uppercase transition-colors hover:bg-button-hover"
          >
            EXPLORE THE CATALOG ↗
          </Link>
        </section>
      ) : (
        <>
          <div className="mb-10 border-b border-line pb-7 md:mb-12">
            <span className="eyebrow block text-muted">APEX / EQUIPMENT DISPATCH</span>
            <h1 className="mt-2.5 text-[clamp(34px,5.2vw,68px)] leading-[0.95] tracking-[-0.045em] text-ink uppercase">
              PROCEED TO CHECKOUT.
            </h1>
          </div>

          <form
            onSubmit={handleSubmitOrder}
            noValidate
            className="grid grid-cols-1 items-start gap-10 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.95fr)] lg:gap-16"
          >
            <CheckoutFormSection
              form={form}
              errors={errors}
              shippingMethods={shippingMethods}
              paymentMethods={paymentMethods}
              shippingMethodId={shippingMethodId}
              paymentMethodId={paymentMethodId}
              onUpdateField={updateField}
              onSelectShipping={setShippingMethodId}
              onSelectPayment={setPaymentMethodId}
            />

            <CheckoutSummarySection
              items={items}
              subtotal={subtotal}
              shippingCost={shippingCost}
              total={total}
              isSubmitting={isSubmitting}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
            />
          </form>
        </>
      )}
    </div>
  );
}
