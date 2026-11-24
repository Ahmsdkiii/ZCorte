export type AccountOrderStatus =
  "PENDING_PAYMENT" | "PAID" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED" | "EXPIRED";

export interface AccountProfileDTO {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  personalizationOptIn: boolean;
  createdAt: string;
}

export interface AddressDTO {
  id: string;
  recipientName: string;
  phone: string;
  street: string;
  apartment: string | null;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

export interface OrderSummaryItemDTO {
  id: string;
  productName: string;
  colorName: string;
  size: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  image: string | null;
}

export interface OrderSummaryDTO {
  id: string;
  orderNumber: string;
  status: AccountOrderStatus;
  total: number;
  shippingCost: number;
  courierName: string | null;
  trackingNumber: string | null;
  createdAt: string;
  items: OrderSummaryItemDTO[];
}

export interface CustomerAccountDataDTO {
  profile: AccountProfileDTO;
  addresses: AddressDTO[];
  orders: OrderSummaryDTO[];
}
