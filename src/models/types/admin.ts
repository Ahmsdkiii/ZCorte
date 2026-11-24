export type AdminProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export type AdminOrderStatus =
  "PENDING_PAYMENT" | "PAID" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED" | "EXPIRED";

export interface AdminKpiDTO {
  totalRevenue: number;
  paidOrdersCount: number;
  pendingOrdersCount: number;
  averageOrderValue: number;
}

export interface AdminProductDTO {
  id: string;
  slug: string;
  name: string;
  price: number;
  status: AdminProductStatus;
  collectionName: string;
  categoryName: string;
  totalStock: number;
  image: string | null;
  createdAt: string;
}

export interface AdminOrderDTO {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: AdminOrderStatus;
  total: number;
  shippingCourier: string | null;
  trackingNumber: string | null;
  itemCount: number;
  createdAt: string;
}

export interface AdminOwnerDTO {
  name: string;
  email: string;
}

export interface AdminDashboardDataDTO {
  owner: AdminOwnerDTO;
  kpi: AdminKpiDTO;
  products: AdminProductDTO[];
  orders: AdminOrderDTO[];
}
