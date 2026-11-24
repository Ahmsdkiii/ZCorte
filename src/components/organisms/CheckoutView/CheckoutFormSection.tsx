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
import { CheckoutAddressFields } from "./CheckoutAddressFields";
import { CheckoutShippingFields } from "./CheckoutShippingFields";
import { CheckoutPaymentFields } from "./CheckoutPaymentFields";

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
  return (
    <div className="space-y-10">
      <CheckoutAddressFields form={form} errors={errors} onUpdateField={onUpdateField} />

      <CheckoutShippingFields
        shippingMethods={shippingMethods}
        shippingMethodId={shippingMethodId}
        onSelectShipping={onSelectShipping}
      />

      <CheckoutPaymentFields
        paymentMethods={paymentMethods}
        paymentMethodId={paymentMethodId}
        onSelectPayment={onSelectPayment}
      />
    </div>
  );
}
