export type OrderDetailStatus =
  "PENDING_PAYMENT" | "PAID" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED" | "EXPIRED";

export interface OrderShippingAddressDTO {
  recipientName: string;
  phone: string;
  street: string;
  apartment: string | null;
  city: string;
  province: string;
  postalCode: string;
}

export interface OrderStatusHistoryDTO {
  id: string;
  fromStatus: OrderDetailStatus | null;
  toStatus: OrderDetailStatus;
  actorType: string;
  reason: string | null;
  createdAt: string;
}

export interface OrderPaymentSummaryDTO {
  id: string;
  method: string;
  provider: string;
  status: string;
  amount: number;
  paidAt: string | null;
}

export interface OrderDetailItemDTO {
  id: string;
  productName: string;
  productSlug: string | null;
  colorName: string;
  size: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  image: string | null;
}

export interface OrderDetailDTO {
  id: string;
  orderNumber: string;
  status: OrderDetailStatus;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingMethod: string;
  shippingCourier: string | null;
  trackingNumber: string | null;
  shippingAddress: OrderShippingAddressDTO;
  cancelReason: string | null;
  expiresAt: string;
  paidAt: string | null;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  items: OrderDetailItemDTO[];
  payment: OrderPaymentSummaryDTO | null;
  statusHistory: OrderStatusHistoryDTO[];
}

export function getCourierTrackingUrl(courier: string, trackingNumber?: string | null): string {
  const normalized = courier.trim().toLowerCase();
  const awb = trackingNumber ? encodeURIComponent(trackingNumber.trim()) : "";

  if (normalized.includes("jne")) {
    return "https://www.jne.co.id/tracking-package";
  }
  if (normalized.includes("sicepat")) {
    return "https://www.sicepat.com/checkAwb";
  }
  if (normalized.includes("j&t") || normalized.includes("jnt")) {
    return "https://www.jet.co.id/track";
  }
  if (normalized.includes("anteraja")) {
    return "https://anteraja.id/tracking";
  }
  if (normalized.includes("lion")) {
    return "https://lionparcel.com/track/stt";
  }
  if (normalized.includes("pos")) {
    return "https://www.posindonesia.co.id/id/tracking";
  }

  return `https://www.google.com/search?q=${encodeURIComponent(`${courier} cek resi`)}+${awb}`;
}
