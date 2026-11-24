import type { FC } from "react";
import type { AdminOrderDTO, AdminOrderStatus } from "@/models/types/admin";
import type { AdminOrderFilter } from "@/hooks/useAdminViewModel";
import { OrderDispatchPanel } from "@/components/organisms/Admin/OrderDispatchPanel";
import { formatIDR } from "@/lib/utils";

interface AdminOrdersTableProps {
  orders: AdminOrderDTO[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: AdminOrderFilter;
  onStatusFilterChange: (status: AdminOrderFilter) => void;
  selectedOrder: string | null;
  setSelectedOrder: (id: string | null) => void;
  courier: string;
  setCourier: (c: string) => void;
  tracking: string;
  setTracking: (t: string) => void;
  newStatus: AdminOrderStatus;
  setNewStatus: (s: AdminOrderStatus) => void;
  onUpdateOrder: (id: string) => void;
  isPending: boolean;
}

const FILTER_OPTIONS: ReadonlyArray<{ value: AdminOrderFilter; label: string }> = [
  { value: "ALL", label: "All" },
  { value: "PENDING_PAYMENT", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "COMPLETED", label: "Completed" },
];

function getStatusBadgeClass(status: AdminOrderStatus): string {
  switch (status) {
    case "PAID":
    case "COMPLETED":
      return "border-emerald-600/40 bg-emerald-50 text-emerald-800";
    case "PROCESSING":
    case "SHIPPED":
      return "border-slate-500/40 bg-slate-100 text-slate-800";
    case "PENDING_PAYMENT":
      return "border-amber-600/40 bg-amber-50 text-amber-800";
    default:
      return "border-neutral-400/50 bg-neutral-100 text-neutral-700";
  }
}

export const AdminOrdersTable: FC<AdminOrdersTableProps> = ({
  orders,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  selectedOrder,
  setSelectedOrder,
  courier,
  setCourier,
  tracking,
  setTracking,
  newStatus,
  setNewStatus,
  onUpdateOrder,
  isPending,
}) => {
  return (
    <section aria-labelledby="orders-table-heading" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-muted">ORDER FULFILLMENT</p>
          <h2 id="orders-table-heading" className="mt-1 text-xl font-bold tracking-tight text-ink">
            Incoming Orders Management
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Track transactions, update fulfillment status, and assign dispatch courier details.
          </p>
        </div>
        <input
          type="search"
          aria-label="Search orders"
          placeholder="Search order number, name, or email..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full border border-control bg-surface-raised px-3 py-2 text-xs text-ink focus:border-ink focus:outline-none sm:w-72"
        />
      </div>

      {/* STATUS FILTER CHIPS */}
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter orders by status">
        {FILTER_OPTIONS.map((opt) => {
          const active = statusFilter === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onStatusFilterChange(opt.value)}
              className={`border px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em] uppercase transition-colors ${
                active
                  ? "border-cinematic-bg bg-cinematic-bg text-cinematic-text"
                  : "border-line bg-surface-raised text-muted hover:border-ink hover:text-ink"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto border border-line bg-surface-raised">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-line bg-surface text-[10px] font-semibold tracking-wider uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Order Number</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Courier / Tracking</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted">
                  No orders matching the current filter.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="hover:bg-surface/60">
                  <td className="px-4 py-3 font-semibold text-ink">{o.orderNumber}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{o.customerName}</p>
                    <p className="text-[10px] text-muted">{o.customerEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(o.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block border px-2 py-0.5 text-[8px] font-bold tracking-widest uppercase ${getStatusBadgeClass(
                        o.status
                      )}`}
                    >
                      {o.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {o.shippingCourier ? (
                      <span>
                        <strong className="text-ink">{o.shippingCourier}</strong>
                        {o.trackingNumber ? ` (${o.trackingNumber})` : ""}
                      </span>
                    ) : (
                      <span>—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-medium tabular-nums text-ink">
                    {formatIDR(o.total)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOrder(o.id);
                        setCourier(o.shippingCourier || "");
                        setTracking(o.trackingNumber || "");
                        setNewStatus(o.status);
                      }}
                      className="border border-control bg-surface px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase text-ink hover:border-ink"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <OrderDispatchPanel
          orderId={selectedOrder}
          newStatus={newStatus}
          setNewStatus={setNewStatus}
          courier={courier}
          setCourier={setCourier}
          tracking={tracking}
          setTracking={setTracking}
          onUpdateOrder={onUpdateOrder}
          onClose={() => setSelectedOrder(null)}
          isPending={isPending}
        />
      )}
    </section>
  );
};
