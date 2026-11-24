import type { FC } from "react";
import { AlertTriangle } from "lucide-react";

interface OrderCancelPanelProps {
  orderNumber: string;
  cancelReason: string;
  setCancelReason: (reason: string) => void;
  customReason: string;
  setCustomReason: (reason: string) => void;
  onConfirmCancel: () => void;
  onClose: () => void;
  isPending: boolean;
}

const CANCEL_REASONS = [
  "Changed my mind",
  "Incorrect shipping address",
  "Want to change item or size",
  "Found a different product",
  "Other",
] as const;

export const OrderCancelPanel: FC<OrderCancelPanelProps> = ({
  orderNumber,
  cancelReason,
  setCancelReason,
  customReason,
  setCustomReason,
  onConfirmCancel,
  onClose,
  isPending,
}) => {
  return (
    <section
      aria-labelledby="cancel-order-heading"
      className="border border-status-error bg-surface-raised p-6 print:hidden"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-status-error" />
        <div className="flex-1 space-y-4">
          <div>
            <h3
              id="cancel-order-heading"
              className="text-xs font-bold tracking-[0.14em] uppercase text-status-error"
            >
              Confirm Cancellation — #{orderNumber}
            </h3>
            <p className="mt-1 text-xs text-muted">
              Cancelling this unpaid order is permanent. All reserved product stock will be
              immediately released back to the catalog.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="cancel-reason-select"
              className="block text-[10px] font-semibold tracking-wider uppercase text-muted"
            >
              Cancellation Reason
            </label>
            <select
              id="cancel-reason-select"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full max-w-md border border-control bg-surface px-3 py-2 text-xs text-ink focus:border-ink focus:outline-none"
            >
              {CANCEL_REASONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            {cancelReason === "Other" && (
              <input
                type="text"
                aria-label="Custom cancellation reason"
                placeholder="Please specify your reason..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                maxLength={200}
                className="mt-2 block w-full max-w-md border border-control bg-surface px-3 py-2 text-xs text-ink focus:border-ink focus:outline-none"
              />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              disabled={isPending}
              onClick={onConfirmCancel}
              className="border border-status-error bg-status-error px-5 py-2 text-[10px] font-semibold tracking-[0.14em] uppercase text-white hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? "CANCELLING ORDER..." : "YES, CANCEL ORDER"}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={onClose}
              className="border border-control bg-surface px-4 py-2 text-[10px] font-semibold tracking-[0.12em] uppercase text-ink hover:border-ink"
            >
              Keep Order
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
