"use client";

import React from "react";
import {
  CheckoutFormData,
  CheckoutFormErrors,
  PaymentMethodId,
  PaymentMethodOption,
  ShippingMethodId,
  ShippingMethodOption,
} from "@/models/types/checkout";
import { formatIDR, cn } from "@/lib/utils";

export interface CheckoutFormSectionProps {
  form: CheckoutFormData;
  errors: CheckoutFormErrors;
  shippingMethods: ShippingMethodOption[];
  paymentMethods: PaymentMethodOption[];
  shippingMethodId: ShippingMethodId;
  paymentMethodId: PaymentMethodId;
  onUpdateField: <K extends keyof CheckoutFormData>(field: K, value: CheckoutFormData[K]) => void;
  onSelectShipping: (id: ShippingMethodId) => void;
  onSelectPayment: (id: PaymentMethodId) => void;
}

export function CheckoutFormSection({
  form,
  errors,
  shippingMethods,
  paymentMethods,
  shippingMethodId,
  paymentMethodId,
  onUpdateField,
  onSelectShipping,
  onSelectPayment,
}: CheckoutFormSectionProps) {
  const inputBase =
    "w-full border border-line bg-surface-raised px-4 py-3.5 text-xs text-ink placeholder:text-muted/70 transition-colors focus:border-ink focus:outline-none";

  return (
    <div className="space-y-10">
      <section aria-labelledby="checkout-contact-heading" className="border-t border-line pt-7">
        <span className="eyebrow block text-muted">01 / CONTACT &amp; DELIVERY ADDRESS</span>
        <h2
          id="checkout-contact-heading"
          className="mt-2 mb-6 text-[22px] tracking-[-0.03em] text-ink uppercase md:text-[26px]"
        >
          DISPATCH COORDINATES
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="checkout-email" className="eyebrow mb-2 block text-[8px] text-muted">
              EMAIL ADDRESS *
            </label>
            <input
              id="checkout-email"
              type="email"
              value={form.email}
              onChange={(e) => onUpdateField("email", e.target.value)}
              placeholder="name@domain.com"
              className={cn(inputBase, errors.email && "border-ink")}
            />
            {errors.email && <p className="mt-1.5 text-[11px] text-ink">{errors.email}</p>}
          </div>

          <div>
            <label
              htmlFor="checkout-firstName"
              className="eyebrow mb-2 block text-[8px] text-muted"
            >
              FIRST NAME *
            </label>
            <input
              id="checkout-firstName"
              type="text"
              value={form.firstName}
              onChange={(e) => onUpdateField("firstName", e.target.value)}
              placeholder="Raka"
              className={inputBase}
            />
            {errors.firstName && <p className="mt-1.5 text-[11px] text-ink">{errors.firstName}</p>}
          </div>

          <div>
            <label htmlFor="checkout-lastName" className="eyebrow mb-2 block text-[8px] text-muted">
              LAST NAME *
            </label>
            <input
              id="checkout-lastName"
              type="text"
              value={form.lastName}
              onChange={(e) => onUpdateField("lastName", e.target.value)}
              placeholder="Pratama"
              className={inputBase}
            />
            {errors.lastName && <p className="mt-1.5 text-[11px] text-ink">{errors.lastName}</p>}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="checkout-phone" className="eyebrow mb-2 block text-[8px] text-muted">
              PHONE NUMBER *
            </label>
            <input
              id="checkout-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => onUpdateField("phone", e.target.value)}
              placeholder="+62 812 0000 0000"
              className={inputBase}
            />
            {errors.phone && <p className="mt-1.5 text-[11px] text-ink">{errors.phone}</p>}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="checkout-address" className="eyebrow mb-2 block text-[8px] text-muted">
              STREET ADDRESS *
            </label>
            <input
              id="checkout-address"
              type="text"
              value={form.address}
              onChange={(e) => onUpdateField("address", e.target.value)}
              placeholder="Jl. Senopati No. 42, Kebayoran Baru"
              className={inputBase}
            />
            {errors.address && <p className="mt-1.5 text-[11px] text-ink">{errors.address}</p>}
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="checkout-apartment"
              className="eyebrow mb-2 block text-[8px] text-muted"
            >
              APARTMENT / SUITE / UNIT (OPTIONAL)
            </label>
            <input
              id="checkout-apartment"
              type="text"
              value={form.apartment}
              onChange={(e) => onUpdateField("apartment", e.target.value)}
              placeholder="Tower B, Floor 12"
              className={inputBase}
            />
          </div>

          <div>
            <label htmlFor="checkout-city" className="eyebrow mb-2 block text-[8px] text-muted">
              CITY *
            </label>
            <input
              id="checkout-city"
              type="text"
              value={form.city}
              onChange={(e) => onUpdateField("city", e.target.value)}
              placeholder="Jakarta Selatan"
              className={inputBase}
            />
            {errors.city && <p className="mt-1.5 text-[11px] text-ink">{errors.city}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="checkout-province"
                className="eyebrow mb-2 block text-[8px] text-muted"
              >
                PROVINCE
              </label>
              <input
                id="checkout-province"
                type="text"
                value={form.province}
                onChange={(e) => onUpdateField("province", e.target.value)}
                placeholder="DKI Jakarta"
                className={inputBase}
              />
            </div>
            <div>
              <label
                htmlFor="checkout-postalCode"
                className="eyebrow mb-2 block text-[8px] text-muted"
              >
                POSTAL CODE *
              </label>
              <input
                id="checkout-postalCode"
                type="text"
                value={form.postalCode}
                onChange={(e) => onUpdateField("postalCode", e.target.value)}
                placeholder="12190"
                className={inputBase}
              />
              {errors.postalCode && (
                <p className="mt-1.5 text-[11px] text-ink">{errors.postalCode}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="checkout-shipping-heading" className="border-t border-line pt-7">
        <span className="eyebrow block text-muted">02 / DISPATCH METHOD</span>
        <h2
          id="checkout-shipping-heading"
          className="mt-2 mb-5 text-[22px] tracking-[-0.03em] text-ink uppercase md:text-[26px]"
        >
          SELECT COURIER TIER
        </h2>
        <div className="space-y-3">
          {shippingMethods.map((method) => {
            const active = method.id === shippingMethodId;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => onSelectShipping(method.id)}
                className={cn(
                  "flex w-full cursor-pointer items-start justify-between gap-4 border p-4 text-left transition-colors md:p-5",
                  active
                    ? "border-ink bg-surface-raised"
                    : "border-line bg-transparent hover:border-control"
                )}
              >
                <div>
                  <p className="text-xs font-semibold tracking-[0.04em] text-ink uppercase">
                    {method.label}{" "}
                    <span className="ml-2 font-normal text-muted">({method.eta})</span>
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

      <section aria-labelledby="checkout-payment-heading" className="border-t border-line pt-7">
        <span className="eyebrow block text-muted">03 / PAYMENT METHOD (SIMULATION)</span>
        <h2
          id="checkout-payment-heading"
          className="mt-2 mb-5 text-[22px] tracking-[-0.03em] text-ink uppercase md:text-[26px]"
        >
          SETTLEMENT CHANNEL
        </h2>
        <div className="space-y-3">
          {paymentMethods.map((method) => {
            const active = method.id === paymentMethodId;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => onSelectPayment(method.id)}
                className={cn(
                  "flex w-full cursor-pointer flex-col gap-1 border p-4 text-left transition-colors md:p-5",
                  active
                    ? "border-ink bg-surface-raised"
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
    </div>
  );
}
