"use client";

import { useState, useTransition } from "react";
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

export function useAdminViewModel(initialData: AdminDashboardDataDTO) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [isPending, startTransition] = useTransition();

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [orderCourier, setOrderCourier] = useState("");
  const [orderTracking, setOrderTracking] = useState("");
  const [orderNewStatus, setOrderNewStatus] = useState<AdminOrderStatus>("PROCESSING");

  const [searchOrderQuery, setSearchOrderQuery] = useState("");

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

  const filteredOrders = initialData.orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchOrderQuery.toLowerCase())
  );

  return {
    activeTab,
    setActiveTab,
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
    filteredOrders,
    handleUpdateOrderStatus,
    handleUpdateProductStatus,
    handleCreateProduct,
  };
}
