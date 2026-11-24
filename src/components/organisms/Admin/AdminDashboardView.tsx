"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import type { AdminDashboardDataDTO } from "@/models/types/admin";
import { useAdminViewModel } from "@/hooks/useAdminViewModel";
import { logoutAction } from "@/actions/auth.actions";
import { AdminSidebar } from "@/components/organisms/Admin/AdminSidebar";
import { AdminHeader } from "@/components/organisms/Admin/AdminHeader";
import { AdminKpiSection } from "@/components/organisms/Admin/AdminKpiSection";
import { AdminOverviewPanel } from "@/components/organisms/Admin/AdminOverviewPanel";
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
  } = useAdminViewModel(initialData);

  const handleLogout = () => {
    startLogout(async () => {
      await logoutAction();
      router.push("/login");
      router.refresh();
    });
  };

  return (
    <div className="min-h-screen bg-surface text-ink">
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        owner={initialData.owner}
        pendingOrdersCount={initialData.kpi.pendingOrdersCount}
        lowStockCount={lowStockProducts.length}
        totalProductsCount={initialData.products.length}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />

      <div className="flex min-h-screen flex-col lg:pl-64">
        <AdminHeader
          activeTab={activeTab}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenCreateProduct={() => setIsProductModalOpen(true)}
        />

        <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-8 sm:px-8">
          {message && (
            <div
              role="status"
              aria-live="polite"
              className="border border-emerald-600/40 bg-emerald-50 px-4 py-3 text-xs text-emerald-800"
            >
              {message}
            </div>
          )}

          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="border border-red-600/40 bg-red-50 px-4 py-3 text-xs text-red-800"
            >
              {error}
            </div>
          )}

          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <p className="eyebrow text-muted">EXECUTIVE STORE OVERVIEW</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  Command Center
                </h1>
              </div>

              <AdminKpiSection kpi={initialData.kpi} />

              <AdminOverviewPanel
                recentOrders={initialData.orders}
                lowStockProducts={lowStockProducts}
                allProducts={initialData.products}
                orderStatusSummary={orderStatusSummary}
                onNavigateTab={setActiveTab}
              />
            </div>
          )}

          {activeTab === "orders" && (
            <AdminOrdersTable
              orders={filteredOrders}
              searchQuery={searchOrderQuery}
              onSearchChange={setSearchOrderQuery}
              statusFilter={orderStatusFilter}
              onStatusFilterChange={setOrderStatusFilter}
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
              products={filteredProducts}
              searchQuery={searchProductQuery}
              onSearchChange={setSearchProductQuery}
              onOpenCreateModal={() => setIsProductModalOpen(true)}
              onUpdateStatus={handleUpdateProductStatus}
              isPending={isPending}
            />
          )}
        </main>
      </div>

      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSubmit={handleCreateProduct}
        isPending={isPending}
      />
    </div>
  );
};
