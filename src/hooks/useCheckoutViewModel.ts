"use client";

import { useState } from "react";
import { useCartViewModel } from "./useCartViewModel";
import {
  CheckoutFormData,
  CheckoutFormErrors,
  PaymentMethodId,
  PaymentMethodOption,
  ShippingMethodId,
  ShippingMethodOption,
  SubmittedOrder,
} from "@/models/types/checkout";

export const SHIPPING_METHODS: [ShippingMethodOption, ...ShippingMethodOption[]] = [
  {
    id: "standard",
    label: "Standard Ground Dispatch",
    eta: "3–5 Business Days",
    price: 0,
    description: "Complimentary tracked regional dispatch for all APEX equipment.",
  },
  {
    id: "express",
    label: "Express Priority Courier",
    eta: "1–2 Business Days",
    price: 45000,
    description: "Expedited air & priority urban courier with direct signature handoff.",
  },
];

export const PAYMENT_METHODS: [PaymentMethodOption, ...PaymentMethodOption[]] = [
  {
    id: "virtual_account",
    label: "Bank Transfer / Virtual Account",
    subtitle: "BCA · Mandiri · BNI · Permata",
    details: "Instant automated verification via simulated virtual account number.",
  },
  {
    id: "qris",
    label: "QRIS Instant Scan",
    subtitle: "GoPay · OVO · Dana · Mobile Banking",
    details: "Generate a dynamic QRIS code upon order confirmation (simulated).",
  },
  {
    id: "card",
    label: "Credit / Debit Card",
    subtitle: "Visa · Mastercard · JCB",
    details: "Encrypted 3D-Secure card authorization (demonstration mode).",
  },
];

const INITIAL_FORM: CheckoutFormData = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
  apartment: "",
  city: "",
  province: "",
  postalCode: "",
  notes: "",
};

export function useCheckoutViewModel() {
  const { items, subtotal, totalCount, updateQuantity, removeItem, clearCart } = useCartViewModel();

  const [form, setForm] = useState<CheckoutFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [shippingMethodId, setShippingMethodId] = useState<ShippingMethodId>("standard");
  const [paymentMethodId, setPaymentMethodId] = useState<PaymentMethodId>("virtual_account");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<SubmittedOrder | null>(null);

  const selectedShipping =
    SHIPPING_METHODS.find((m) => m.id === shippingMethodId) ?? SHIPPING_METHODS[0];
  const selectedPayment =
    PAYMENT_METHODS.find((m) => m.id === paymentMethodId) ?? PAYMENT_METHODS[0];

  const shippingCost = items.length > 0 ? selectedShipping.price : 0;
  const total = subtotal + shippingCost;

  const updateField = <K extends keyof CheckoutFormData>(field: K, value: CheckoutFormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const nextErrors: CheckoutFormErrors = {};

    if (!form.email.trim() || !form.email.includes("@")) {
      nextErrors.email = "Enter a valid email address for dispatch updates.";
    }
    if (!form.firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    }
    if (!form.lastName.trim()) {
      nextErrors.lastName = "Last name is required.";
    }
    if (!form.phone.trim()) {
      nextErrors.phone = "Phone number is required for courier coordination.";
    }
    if (!form.address.trim()) {
      nextErrors.address = "Street address is required.";
    }
    if (!form.city.trim()) {
      nextErrors.city = "City is required.";
    }
    if (!form.postalCode.trim()) {
      nextErrors.postalCode = "Postal code is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || isSubmitting) return;
    if (!validate()) return;

    setIsSubmitting(true);

    const randomCode = String(Math.floor(1000 + Math.random() * 9000));
    const orderSnapshot: SubmittedOrder = {
      orderNumber: `APX-2611-${randomCode}`,
      createdAt: new Date().toLocaleDateString("en-ID", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
      items: [...items],
      subtotal,
      shippingCost,
      total,
      shippingMethod: selectedShipping,
      paymentMethod: selectedPayment,
      customer: { ...form },
    };

    window.setTimeout(() => {
      setSubmittedOrder(orderSnapshot);
      clearCart();
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 450);
  };

  return {
    items,
    subtotal,
    totalCount,
    shippingCost,
    total,
    form,
    errors,
    shippingMethods: SHIPPING_METHODS,
    paymentMethods: PAYMENT_METHODS,
    shippingMethodId,
    paymentMethodId,
    selectedShipping,
    selectedPayment,
    isSubmitting,
    submittedOrder,
    updateField,
    setShippingMethodId,
    setPaymentMethodId,
    updateQuantity,
    removeItem,
    handleSubmitOrder,
  };
}
