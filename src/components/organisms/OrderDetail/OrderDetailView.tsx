"use client";

import type { FC } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, Printer, XCircle } from "lucide-react";
import type { OrderDetailDTO } from "@/models/types/order-detail";
import { useOrderDetailViewModel } from "@/hooks/useOrderDetailViewModel";
import { OrderTrackingTimeline } from "@/components/organisms/OrderDetail/OrderTrackingTimeline";
import { OrderDigitalInvoice } from "@/components/organisms/OrderDetail/OrderDigitalInvoice";
import { OrderCancelPanel } from "@/components/organisms/OrderDetail/OrderCancelPanel";

interface OrderDetailViewProps {
  order: OrderDetailDTO;
}

export const OrderDetailView: FC<OrderDetailViewProps> = ({ order }) => {
  const {
    isPending,
    isCancelOpen,
    setIsCancelOpen,
    cancelReason,
    setCancelReason,
    customReason,
    setCustomReason,
    copiedAwb,
    message,
    error,
    handleCancelOrder,
    handleSimulatePayment,
    handleCopyTracking,
    handlePrintInvoice,
  } = useOrderDetailViewModel(order.orderNumber);

  const isPendingPayment = order.status === "PENDING_PAYMENT";

  return (
    <div className="space-y-6">
      {/* TOP BAR & BREADCRUMB */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.14em] uppercase text-muted hover:text-ink"
          >
            <ArrowLeft size={13} />
            <span>Back to Account Orders</span>
          </Link>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Order #{order.orderNumber}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrintInvoice}
            className="inline-flex items-center gap-1.5 border border-control bg-surface-raised px-3.5 py-2 text-[10px] font-semibold tracking-[0.12em] uppercase text-ink hover:border-ink"
          >
            <Printer size={13} />
            <span>Print / Save PDF</span>
          </button>

          {isPendingPayment && (
            <>
              <button
                type="button"
                disabled={isPending}
                onClick={handleSimulatePayment}
                className="inline-flex items-center gap-1.5 border border-button bg-button px-4 py-2 text-[10px] font-semibold tracking-[0.14em] uppercase text-button-text hover:bg-button-hover disabled:opacity-50"
              >
                <CreditCard size={13} />
                <span>{isPending ? "Processing..." : "Simulate Pay (Demo)"}</span>
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={() => setIsCancelOpen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 border border-status-error bg-surface-raised px-3.5 py-2 text-[10px] font-semibold tracking-[0.12em] uppercase text-status-error hover:bg-red-50 disabled:opacity-50"
              >
                <XCircle size={13} />
                <span>Cancel Order</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* LIVE FEEDBACK */}
      {message && (
        <div
          role="status"
          aria-live="polite"
          className="border border-status-success/40 bg-emerald-50 px-4 py-3 text-xs text-status-success print:hidden"
        >
          {message}
        </div>
      )}

      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="border border-status-error/40 bg-red-50 px-4 py-3 text-xs text-status-error print:hidden"
        >
          {error}
        </div>
      )}

      {/* CANCEL ORDER CONFIRMATION PANEL */}
      {isPendingPayment && isCancelOpen && (
        <OrderCancelPanel
          orderNumber={order.orderNumber}
          cancelReason={cancelReason}
          setCancelReason={setCancelReason}
          customReason={customReason}
          setCustomReason={setCustomReason}
          onConfirmCancel={handleCancelOrder}
          onClose={() => setIsCancelOpen(false)}
          isPending={isPending}
        />
      )}

      {/* EXPEDITION TRACKING TIMELINE */}
      <OrderTrackingTimeline
        order={order}
        copiedAwb={copiedAwb}
        onCopyTracking={handleCopyTracking}
      />

      {/* DIGITAL INVOICE */}
      <OrderDigitalInvoice order={order} />
    </div>
  );
};
