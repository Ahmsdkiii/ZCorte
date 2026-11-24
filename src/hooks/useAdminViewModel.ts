"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type {
  AdminDashboardDataDTO,
  AdminOrderStatus,
  AdminProductStatus,
} from "@/models/types/admin";
import {
  adminUpdateOrderStatusAction,
  adminUpdateProductStatusAction,
} from "@/actions/admin.actions";
import { adminCreateProductAction } from "@/actions/admin-product.actions";

export type AdminTab = "overview" | "orders" | "products";
export type AdminOrderFilter = "ALL" | AdminOrderStatus;

export interface OrderStatusMetric {
  status: AdminOrderStatus;
  label: string;
  count: number;
  percentage: number;
}

const PIPELINE_STATUSES: ReadonlyArray<{ status: AdminOrderStatus; label: string }> = [
  { status: "PENDING_PAYMENT", label: "Pending Payment" },
  { status: "PAID", label: "Paid" },
  { status: "PROCESSING", label: "Processing" },
  { status: "SHIPPED", label: "Shipped" },
  { status: "COMPLETED", label: "Completed" },
];

export function useAdminViewModel(initialData: AdminDashboardDataDTO) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [orderCourier, setOrderCourier] = useState("");
  const [orderTracking, setOrderTracking] = useState("");
  const [orderNewStatus, setOrderNewStatus] = useState<AdminOrderStatus>("PROCESSING");

  const [searchOrderQuery, setSearchOrderQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<AdminOrderFilter>("ALL");
  const [searchProductQuery, setSearchProductQuery] = useState("");

  const selectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const handleUpdateOrderStatus = async (orderId: string) => {
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await adminUpdateOrderStatusAction({
        orderId,
        status: orderNewStatus,
        shippingCourier: orderCourier,
        trackingNumber: orderTracking,
      });

      if (result.success) {
        setMessage(result.message || "Order updated.");
        setSelectedOrder(null);
        router.refresh();
      } else {
        setError(result.error || "Failed to update order.");
      }
    });
  };

  const handleUpdateProductStatus = async (productId: string, newStatus: AdminProductStatus) => {
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await adminUpdateProductStatusAction({
        productId,
        status: newStatus,
      });

      if (result.success) {
        setMessage(result.message || "Product status updated.");
        router.refresh();
      } else {
        setError(result.error || "Failed to update product.");
      }
    });
  };

  const handleCreateProduct = async (formData: {
    name: string;
    price: number;
    description: string;
    collectionSlug: string;
    categorySlug: string;
    material: string;
    fit: "SLIM" | "REGULAR" | "RELAXED";
    status: "ACTIVE" | "DRAFT";
  }) => {
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await adminCreateProductAction(formData);
      if (result.success) {
        setMessage(result.message || "Product created successfully.");
        setIsProductModalOpen(false);
        router.refresh();
      } else {
        setError(result.error || "Failed to create product.");
      }
    });
  };

  const filteredOrders = useMemo(() => {
    const query = searchOrderQuery.trim().toLowerCase();
    return initialData.orders.filter((o) => {
      const matchesStatus = orderStatusFilter === "ALL" || o.status === orderStatusFilter;
      if (!matchesStatus) return false;
      if (!query) return true;
      return (
        o.orderNumber.toLowerCase().includes(query) ||
        o.customerEmail.toLowerCase().includes(query) ||
        o.customerName.toLowerCase().includes(query)
      );
    });
  }, [initialData.orders, orderStatusFilter, searchOrderQuery]);

  const filteredProducts = useMemo(() => {
    const query = searchProductQuery.trim().toLowerCase();
    if (!query) return initialData.products;
    return initialData.products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.collectionName.toLowerCase().includes(query) ||
        p.categoryName.toLowerCase().includes(query)
    );
  }, [initialData.products, searchProductQuery]);

  const lowStockProducts = useMemo(
    () =>
      [...initialData.products]
        .filter((p) => p.totalStock <= 5)
        .sort((a, b) => a.totalStock - b.totalStock),
    [initialData.products]
  );

  const orderStatusSummary = useMemo<OrderStatusMetric[]>(() => {
    const total = initialData.orders.length;
    return PIPELINE_STATUSES.map(({ status, label }) => {
      const count = initialData.orders.filter((o) => o.status === status).length;
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
      return { status, label, count, percentage };
    });
  }, [initialData.orders]);

  return {
    activeTab,
    setActiveTab: selectTab,
    isSidebarOpen,
    setIsSidebarOpen,
    isPending,
    message,
    error,
    isProductModalOpen,
    setIsProductModalOpen,
    selectedOrder,
    setSelectedOrder,
    orderCourier,
    setOrderCourier,
    orderTracking,
    setOrderTracking,
    orderNewStatus,
    setOrderNewStatus,
    searchOrderQuery,
    setSearchOrderQuery,
    orderStatusFilter,
    setOrderStatusFilter,
    searchProductQuery,
    setSearchProductQuery,
    filteredOrders,
    filteredProducts,
    lowStockProducts,
    orderStatusSummary,
    handleUpdateOrderStatus,
    handleUpdateProductStatus,
    handleCreateProduct,
  };
}
