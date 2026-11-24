import type { FC } from "react";
import { Check, Clock, Copy, ExternalLink, PackageCheck, Truck, XCircle } from "lucide-react";
import type { OrderDetailDTO, OrderDetailStatus } from "@/models/types/order-detail";
import { getCourierTrackingUrl } from "@/models/types/order-detail";

interface OrderTrackingTimelineProps {
  order: OrderDetailDTO;
  copiedAwb: boolean;
  onCopyTracking: (awb: string) => void;
}

const TIMELINE_STEPS: ReadonlyArray<{
  status: OrderDetailStatus;
  label: string;
  description: string;
}> = [
  {
    status: "PENDING_PAYMENT",
    label: "Order Placed",
    description: "Awaiting settlement",
  },
  {
    status: "PAID",
    label: "Payment Verified",
    description: "Confirmed in ledger",
  },
  {
    status: "PROCESSING",
    label: "Studio Prep",
    description: "Inspection & packing",
  },
  {
    status: "SHIPPED",
    label: "Dispatched",
    description: "In transit via courier",
  },
  {
    status: "COMPLETED",
    label: "Delivered",
    description: "Fulfillment complete",
  },
];

function getStepIndex(status: OrderDetailStatus): number {
  const idx = TIMELINE_STEPS.findIndex((step) => step.status === status);
  return idx;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const OrderTrackingTimeline: FC<OrderTrackingTimelineProps> = ({
  order,
  copiedAwb,
  onCopyTracking,
}) => {
  const isTerminalCancelled = order.status === "CANCELLED" || order.status === "EXPIRED";
  const currentStepIndex = getStepIndex(order.status);

  return (
    <section
      aria-labelledby="tracking-timeline-heading"
      className="border border-line bg-surface-raised p-6 sm:p-8"
    >
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow text-muted">EXPEDITION & FULFILLMENT</p>
          <h2 id="tracking-timeline-heading" className="mt-1 text-xl font-bold text-ink">
            Order Tracking Timeline
          </h2>
        </div>
        <span
          className={`inline-block border px-2.5 py-1 text-[9px] font-bold tracking-[0.16em] uppercase ${
            isTerminalCancelled
              ? "border-status-error/40 bg-red-50 text-status-error"
              : order.status === "COMPLETED" || order.status === "PAID"
                ? "border-status-success/40 bg-emerald-50 text-status-success"
                : "border-ink bg-cinematic-bg text-cinematic-text"
          }`}
        >
          {order.status.replace("_", " ")}
        </span>
      </div>

      {/* TERMINAL STATE BANNER */}
      {isTerminalCancelled ? (
        <div className="mb-6 flex items-start gap-3 border border-status-error/40 bg-red-50 p-4 text-status-error">
          <XCircle size={18} className="mt-0.5 shrink-0" />
          <div className="text-xs">
            <p className="font-bold tracking-wider uppercase">
              Order {order.status === "CANCELLED" ? "Cancelled" : "Expired"}
            </p>
            <p className="mt-1 text-red-900/80">
              {order.cancelReason ||
                "This order was closed prior to fulfillment and all reserved inventory has been released."}
            </p>
          </div>
        </div>
      ) : (
        /* 5-STAGE STEPPER */
        <ol className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-5 sm:gap-2">
          {TIMELINE_STEPS.map((step, index) => {
            const isCompleted = currentStepIndex > index;
            const isCurrent = currentStepIndex === index;

            return (
              <li
                key={step.status}
                className="relative flex items-start gap-3 sm:flex-col sm:gap-2"
              >
                <div className="flex items-center sm:w-full">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center border text-xs font-bold transition-colors ${
                      isCompleted
                        ? "border-cinematic-bg bg-cinematic-bg text-cinematic-text"
                        : isCurrent
                          ? "border-ink bg-surface text-ink ring-2 ring-ink/20"
                          : "border-line bg-surface text-muted"
                    }`}
                  >
                    {isCompleted ? (
                      <Check size={14} />
                    ) : isCurrent ? (
                      step.status === "SHIPPED" ? (
                        <Truck size={14} />
                      ) : step.status === "COMPLETED" ? (
                        <PackageCheck size={14} />
                      ) : (
                        <Clock size={14} />
                      )
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  {index < TIMELINE_STEPS.length - 1 && (
                    <div
                      className={`hidden h-px flex-1 sm:block ${
                        isCompleted ? "bg-ink" : "bg-line"
                      }`}
                    />
                  )}
                </div>

                <div>
                  <p
                    className={`text-[11px] font-bold tracking-wider uppercase ${
                      isCompleted || isCurrent ? "text-ink" : "text-muted"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[11px] text-muted">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {/* COURIER & AIRWAY BILL DISPATCH CARD */}
      <div className="border border-line bg-surface p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Truck size={18} className="mt-0.5 shrink-0 text-ink" />
            <div>
              <p className="eyebrow text-muted">COURIER & WAYBILL</p>
              {order.shippingCourier ? (
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                  <strong className="font-semibold text-ink">{order.shippingCourier}</strong>
                  {order.trackingNumber && (
                    <span className="border border-line bg-surface-raised px-2 py-0.5 font-mono text-[11px] text-ink">
                      {order.trackingNumber}
                    </span>
                  )}
                </div>
              ) : (
                <p className="mt-1 text-xs text-muted">
                  Awaiting studio dispatch assignment ({order.shippingMethod} tier).
                </p>
              )}
            </div>
          </div>

          {order.shippingCourier && (
            <div className="flex flex-wrap items-center gap-2 print:hidden">
              {order.trackingNumber && (
                <button
                  type="button"
                  onClick={() => onCopyTracking(order.trackingNumber as string)}
                  className="inline-flex items-center gap-1.5 border border-control bg-surface-raised px-3 py-1.5 text-[10px] font-semibold tracking-wider uppercase text-ink hover:border-ink"
                >
                  {copiedAwb ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedAwb ? "Copied AWB" : "Copy AWB"}</span>
                </button>
              )}
              <a
                href={getCourierTrackingUrl(order.shippingCourier, order.trackingNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border border-button bg-button px-3 py-1.5 text-[10px] font-semibold tracking-wider uppercase text-button-text hover:bg-button-hover"
              >
                <span>Track on Courier Site</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* STATUS HISTORY LOG */}
      {order.statusHistory.length > 0 && (
        <div className="mt-6 border-t border-line pt-5">
          <p className="eyebrow mb-3 text-muted">STATUS ACTIVITY LOG</p>
          <ul className="space-y-2.5 text-xs">
            {[...order.statusHistory].reverse().map((entry) => (
              <li
                key={entry.id}
                className="flex flex-wrap items-baseline justify-between gap-2 border-l-2 border-ink/40 pl-3"
              >
                <div>
                  <span className="font-semibold text-ink">{entry.toStatus.replace("_", " ")}</span>
                  {entry.reason && <span className="ml-2 text-muted">— {entry.reason}</span>}
                </div>
                <span className="tabular-nums text-[11px] text-muted">
                  {formatDateTime(entry.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
