import type { FC } from "react";
import type { AdminOrderDTO, AdminOrderStatus } from "@/models/types/admin";
import { formatIDR } from "@/lib/utils";

interface AdminOrdersTableProps {
  orders: AdminOrderDTO[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
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

function getStatusBadgeClass(status: AdminOrderStatus): string {
  switch (status) {
    case "PAID":
    case "COMPLETED":
      return "border-emerald-600 bg-emerald-50 text-emerald-800";
    case "PROCESSING":
    case "SHIPPED":
      return "border-blue-600 bg-blue-50 text-blue-800";
    case "PENDING_PAYMENT":
      return "border-amber-600 bg-amber-50 text-amber-800";
    default:
      return "border-neutral-400 bg-neutral-100 text-neutral-800";
  }
}

export const AdminOrdersTable: FC<AdminOrdersTableProps> = ({
  orders,
  searchQuery,
  onSearchChange,
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id="orders-table-heading" className="text-lg font-bold tracking-tight">
            Incoming Orders Management
          </h2>
          <p className="text-xs text-muted">
            Track transactions, update fulfillment, and assign dispatch courier info.
          </p>
        </div>
        <input
          type="search"
          placeholder="Search order number or email..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border border-control bg-surface px-3 py-1.5 text-xs focus:border-black focus:outline-none w-64"
        />
      </div>

      <div className="overflow-x-auto border border-line bg-surface">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-line bg-surface-raised text-[10px] uppercase tracking-wider text-muted font-semibold">
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
                <td colSpan={7} className="px-4 py-8 text-center text-muted">
                  No orders matching criteria.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="hover:bg-surface-raised/50">
                  <td className="px-4 py-3 font-semibold text-black">{o.orderNumber}</td>
                  <td className="px-4 py-3">
                    <p className="text-black font-medium">{o.customerName}</p>
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
                        <strong className="text-black">{o.shippingCourier}</strong>
                        {o.trackingNumber ? ` (${o.trackingNumber})` : ""}
                      </span>
                    ) : (
                      <span>—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-black">
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
                      className="border border-control px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase text-black hover:border-black"
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
        <div className="border border-black bg-surface-raised p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-black">
              Update Order Status & Dispatch Info
            </h3>
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="text-xs text-muted hover:text-black"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label
                htmlFor="order-status-select"
                className="block text-[10px] font-semibold uppercase text-muted mb-1"
              >
                Order Status
              </label>
              <select
                id="order-status-select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as AdminOrderStatus)}
                className="w-full border border-control bg-surface px-2.5 py-1.5 text-xs focus:border-black focus:outline-none"
              >
                <option value="PENDING_PAYMENT">PENDING PAYMENT</option>
                <option value="PAID">PAID</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="order-courier-input"
                className="block text-[10px] font-semibold uppercase text-muted mb-1"
              >
                Courier Name
              </label>
              <input
                id="order-courier-input"
                placeholder="JNE / SiCepat / Lion Parcel"
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
                className="w-full border border-control bg-surface px-2.5 py-1.5 text-xs focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="order-tracking-input"
                className="block text-[10px] font-semibold uppercase text-muted mb-1"
              >
                Tracking Airway Bill
              </label>
              <input
                id="order-tracking-input"
                placeholder="AWB1234567890"
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                className="w-full border border-control bg-surface px-2.5 py-1.5 text-xs focus:border-black focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="border border-control px-3 py-1.5 text-[10px] uppercase font-semibold text-muted hover:text-black"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => onUpdateOrder(selectedOrder)}
              className="border border-black bg-black px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white hover:opacity-85 disabled:opacity-50"
            >
              {isPending ? "SAVING..." : "COMMIT CHANGES"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
