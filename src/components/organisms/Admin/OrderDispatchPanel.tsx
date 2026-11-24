import type { FC } from "react";
import type { AdminOrderStatus } from "@/models/types/admin";

interface OrderDispatchPanelProps {
  orderId: string;
  newStatus: AdminOrderStatus;
  setNewStatus: (status: AdminOrderStatus) => void;
  courier: string;
  setCourier: (courier: string) => void;
  tracking: string;
  setTracking: (tracking: string) => void;
  onUpdateOrder: (id: string) => void;
  onClose: () => void;
  isPending: boolean;
}

export const OrderDispatchPanel: FC<OrderDispatchPanelProps> = ({
  orderId,
  newStatus,
  setNewStatus,
  courier,
  setCourier,
  tracking,
  setTracking,
  onUpdateOrder,
  onClose,
  isPending,
}) => {
  return (
    <div className="space-y-4 border border-ink bg-surface-raised p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold tracking-wider uppercase text-ink">
          Update Order Status & Dispatch Info
        </h3>
        <button type="button" onClick={onClose} className="text-xs text-muted hover:text-ink">
          Close
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label
            htmlFor="order-status-select"
            className="mb-1 block text-[10px] font-semibold uppercase text-muted"
          >
            Order Status
          </label>
          <select
            id="order-status-select"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as AdminOrderStatus)}
            className="w-full border border-control bg-surface px-2.5 py-1.5 text-xs focus:border-ink focus:outline-none"
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
            className="mb-1 block text-[10px] font-semibold uppercase text-muted"
          >
            Courier Name
          </label>
          <input
            id="order-courier-input"
            placeholder="JNE / SiCepat / Lion Parcel"
            value={courier}
            onChange={(e) => setCourier(e.target.value)}
            className="w-full border border-control bg-surface px-2.5 py-1.5 text-xs focus:border-ink focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="order-tracking-input"
            className="mb-1 block text-[10px] font-semibold uppercase text-muted"
          >
            Tracking Airway Bill
          </label>
          <input
            id="order-tracking-input"
            placeholder="AWB1234567890"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            className="w-full border border-control bg-surface px-2.5 py-1.5 text-xs focus:border-ink focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="border border-control px-3 py-1.5 text-[10px] font-semibold uppercase text-muted hover:text-ink"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => onUpdateOrder(orderId)}
          className="border border-button bg-button px-4 py-1.5 text-[10px] font-semibold tracking-wider uppercase text-button-text hover:bg-button-hover disabled:opacity-50"
        >
          {isPending ? "SAVING..." : "COMMIT CHANGES"}
        </button>
      </div>
    </div>
  );
};
