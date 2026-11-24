"use client";

import React from "react";
import { CheckoutFormData, CheckoutFormErrors } from "@/models/types/checkout";
import { cn } from "@/lib/utils";

interface CheckoutAddressFieldsProps {
  form: CheckoutFormData;
  errors: CheckoutFormErrors;
  onUpdateField: <K extends keyof CheckoutFormData>(field: K, value: CheckoutFormData[K]) => void;
}

export function CheckoutAddressFields({ form, errors, onUpdateField }: CheckoutAddressFieldsProps) {
  const inputBase =
    "w-full border border-line bg-surface-raised px-4 py-3.5 text-xs text-ink placeholder:text-muted/70 transition-colors focus:border-ink focus:outline-none";

  return (
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
            placeholder="client@domain.com"
            className={cn(inputBase, errors.email && "border-red-600")}
          />
          {errors.email && (
            <p className="mt-1.5 text-[11px] text-red-600" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="checkout-firstName" className="eyebrow mb-2 block text-[8px] text-muted">
            FIRST NAME *
          </label>
          <input
            id="checkout-firstName"
            type="text"
            value={form.firstName}
            onChange={(e) => onUpdateField("firstName", e.target.value)}
            placeholder="First name"
            className={cn(inputBase, errors.firstName && "border-red-600")}
          />
          {errors.firstName && (
            <p className="mt-1.5 text-[11px] text-red-600" role="alert">
              {errors.firstName}
            </p>
          )}
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
            placeholder="Last name"
            className={cn(inputBase, errors.lastName && "border-red-600")}
          />
          {errors.lastName && (
            <p className="mt-1.5 text-[11px] text-red-600" role="alert">
              {errors.lastName}
            </p>
          )}
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
            placeholder="+62 812 3456 7890"
            className={cn(inputBase, errors.phone && "border-red-600")}
          />
          {errors.phone && (
            <p className="mt-1.5 text-[11px] text-red-600" role="alert">
              {errors.phone}
            </p>
          )}
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
            placeholder="Jl. Dago No. 120, Coblong"
            className={cn(inputBase, errors.address && "border-red-600")}
          />
          {errors.address && (
            <p className="mt-1.5 text-[11px] text-red-600" role="alert">
              {errors.address}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="checkout-apartment" className="eyebrow mb-2 block text-[8px] text-muted">
            APARTMENT / SUITE / UNIT (OPTIONAL)
          </label>
          <input
            id="checkout-apartment"
            type="text"
            value={form.apartment}
            onChange={(e) => onUpdateField("apartment", e.target.value)}
            placeholder="Studio 4A"
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
            placeholder="Bandung"
            className={cn(inputBase, errors.city && "border-red-600")}
          />
          {errors.city && (
            <p className="mt-1.5 text-[11px] text-red-600" role="alert">
              {errors.city}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="checkout-province" className="eyebrow mb-2 block text-[8px] text-muted">
              PROVINCE *
            </label>
            <input
              id="checkout-province"
              type="text"
              value={form.province}
              onChange={(e) => onUpdateField("province", e.target.value)}
              placeholder="Jawa Barat"
              className={cn(inputBase, errors.province && "border-red-600")}
            />
            {errors.province && (
              <p className="mt-1.5 text-[11px] text-red-600" role="alert">
                {errors.province}
              </p>
            )}
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
              placeholder="40132"
              className={cn(inputBase, errors.postalCode && "border-red-600")}
            />
            {errors.postalCode && (
              <p className="mt-1.5 text-[11px] text-red-600" role="alert">
                {errors.postalCode}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
