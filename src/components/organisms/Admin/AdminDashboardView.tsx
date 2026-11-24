"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import type { AdminDashboardDataDTO } from "@/models/types/admin";
import { useAdminViewModel } from "@/hooks/useAdminViewModel";
import { logoutAction } from "@/actions/auth.actions";
import { AdminHeader } from "@/components/organisms/Admin/AdminHeader";
import { AdminKpiSection } from "@/components/organisms/Admin/AdminKpiSection";
import { AdminOrdersTable } from "@/components/organisms/Admin/AdminOrdersTable";
import { AdminProductsTable } from "@/components/organisms/Admin/AdminProductsTable";
import { ProductFormModal } from "@/components/organisms/Admin/ProductFormModal";

interface AdminDashboardViewProps {
  initialData: AdminDashboardDataDTO;
}

export const AdminDashboardView: FC<AdminDashboardViewProps> = ({ initialData }) => {
  const router = useRouter();
  const [isLoggingOut, startLogout] = useTransition();

  const {
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
  } = useAdminViewModel(initialData);

  const handleLogout = () => {
    startLogout(async () => {
      await logoutAction();
      router.push("/login");
      router.refresh();
    });
  };

  return (
    <div className="min-h-screen bg-surface pb-16">
      <AdminHeader onLogout={handleLogout} isPending={isLoggingOut} />

      <main className="mx-auto max-w-7xl px-gutter pt-8 space-y-8">
        <div>
          <p className="eyebrow text-muted">EXECUTIVE STORE OVERVIEW</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-black sm:text-3xl">
            Command Center
          </h1>
        </div>

        {message && (
          <div
            role="status"
            aria-live="polite"
            className="border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-800"
          >
            {message}
          </div>
        )}

        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-700"
          >
            {error}
          </div>
        )}

        {/* KPI OVERVIEW */}
        <AdminKpiSection kpi={initialData.kpi} />

        {/* NAVIGATION TABS */}
        <div className="flex border-b border-line gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 text-[10px] font-bold tracking-wider uppercase border-b-2 transition-colors ${
              activeTab === "overview"
                ? "border-black text-black"
                : "border-transparent text-muted hover:text-black"
            }`}
          >
            All Incoming Orders ({initialData.orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2.5 text-[10px] font-bold tracking-wider uppercase border-b-2 transition-colors ${
              activeTab === "products"
                ? "border-black text-black"
                : "border-transparent text-muted hover:text-black"
            }`}
          >
            Catalog & Stock ({initialData.products.length})
          </button>
        </div>

        {/* TAB CONTENTS */}
        {activeTab === "overview" && (
          <AdminOrdersTable
            orders={filteredOrders}
            searchQuery={searchOrderQuery}
            onSearchChange={setSearchOrderQuery}
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
            courier={orderCourier}
            setCourier={setOrderCourier}
            tracking={orderTracking}
            setTracking={setOrderTracking}
            newStatus={orderNewStatus}
            setNewStatus={setOrderNewStatus}
            onUpdateOrder={handleUpdateOrderStatus}
            isPending={isPending}
          />
        )}

        {activeTab === "products" && (
          <AdminProductsTable
            products={initialData.products}
            onOpenCreateModal={() => setIsProductModalOpen(true)}
            onUpdateStatus={handleUpdateProductStatus}
            isPending={isPending}
          />
        )}
      </main>

      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSubmit={handleCreateProduct}
        isPending={isPending}
      />
    </div>
  );
};
