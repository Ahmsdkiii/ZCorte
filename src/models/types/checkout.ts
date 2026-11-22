import { CartItem } from "./cart";

export type ShippingMethodId = "standard" | "express";

export type PaymentMethodId = "virtual_account" | "qris" | "card";

export interface ShippingMethodOption {
  id: ShippingMethodId;
  label: string;
  eta: string;
  price: number;
  description: string;
}

export interface PaymentMethodOption {
  id: PaymentMethodId;
  label: string;
  subtitle: string;
  details: string;
}

export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  province: string;
  postalCode: string;
  notes: string;
}

export type CheckoutFormErrors = Partial<Record<keyof CheckoutFormData, string>>;

export interface SubmittedOrder {
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingMethod: ShippingMethodOption;
  paymentMethod: PaymentMethodOption;
  customer: CheckoutFormData;
}
