import type { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import type { OrderDetailDTO } from "@/models/types/order-detail";
import { formatIDR } from "@/lib/utils";

interface OrderDigitalInvoiceProps {
  order: OrderDetailDTO;
}

export const OrderDigitalInvoice: FC<OrderDigitalInvoiceProps> = ({ order }) => {
  const placedDate = new Date(order.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const paidDate = order.paidAt
    ? new Date(order.paidAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <section
      aria-labelledby="digital-invoice-heading"
      className="border border-line bg-surface-raised p-6 sm:p-10 print:border-none print:p-0"
    >
      {/* INVOICE HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-6 border-b border-line pb-7">
        <div>
          <span className="eyebrow inline-block border-l-3 border-l-ink pl-2 text-ink">
            ZCORTÉ / OFFICIAL DIGITAL INVOICE
          </span>
          <h2
            id="digital-invoice-heading"
            className="mt-3 font-display text-2xl font-bold tracking-[-0.04em] text-ink uppercase sm:text-3xl"
          >
            Invoice #{order.orderNumber}
          </h2>
          <p className="mt-1.5 text-xs text-muted">
            Issued on {placedDate}
            {paidDate ? ` · Settled on ${paidDate}` : ""}
          </p>
        </div>

        <div className="border border-line bg-surface px-4 py-3 text-left sm:text-right">
          <span className="eyebrow block text-[8px] text-muted">PAYMENT STATUS</span>
          <strong className="mt-1 block text-xs tracking-[0.12em] uppercase text-ink">
            {order.payment?.status || order.status.replace("_", " ")}
          </strong>
          {order.payment && (
            <span className="mt-0.5 block text-[11px] text-muted">
              {order.payment.method} · {order.payment.provider}
            </span>
          )}
        </div>
      </div>

      {/* RECIPIENT, DISPATCH & ACCOUNT GRID */}
      <div className="grid grid-cols-1 gap-6 border-b border-line py-7 text-xs sm:grid-cols-3">
        <div>
          <span className="eyebrow block text-[8px] text-muted">RECIPIENT & DESTINATION</span>
          <p className="mt-2 font-semibold text-ink">{order.shippingAddress.recipientName}</p>
          <p className="mt-1 text-muted">{order.shippingAddress.street}</p>
          {order.shippingAddress.apartment && (
            <p className="text-muted">{order.shippingAddress.apartment}</p>
          )}
          <p className="text-muted">
            {order.shippingAddress.city}
            {order.shippingAddress.province ? `, ${order.shippingAddress.province}` : ""}{" "}
            {order.shippingAddress.postalCode}
          </p>
          {order.shippingAddress.phone && (
            <p className="mt-1 text-muted">{order.shippingAddress.phone}</p>
          )}
        </div>

        <div>
          <span className="eyebrow block text-[8px] text-muted">DISPATCH METHOD</span>
          <p className="mt-2 font-semibold uppercase text-ink">{order.shippingMethod} Tier</p>
          <p className="mt-1 text-muted">
            {order.shippingCourier
              ? `Assigned Courier: ${order.shippingCourier}`
              : "Studio Fulfilled Dispatch"}
          </p>
          {order.trackingNumber && (
            <p className="mt-1 font-mono text-[11px] text-ink">AWB: {order.trackingNumber}</p>
          )}
        </div>

        <div>
          <span className="eyebrow block text-[8px] text-muted">BILLED ACCOUNT</span>
          <p className="mt-2 font-semibold text-ink">{order.customerName}</p>
          <p className="mt-1 text-muted">{order.customerEmail}</p>
          {order.status === "PENDING_PAYMENT" && (
            <p className="mt-1.5 text-[11px] font-medium text-amber-800">
              Payment expires:{" "}
              {new Date(order.expiresAt).toLocaleString("id-ID", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
      </div>

      {/* ITEMIZED MANIFEST */}
      <div className="divide-y divide-line py-2" role="list" aria-label="Invoice line items">
        {order.items.map((item) => (
          <div
            key={item.id}
            role="listitem"
            className="flex items-center justify-between gap-4 py-4"
          >
            <div className="flex min-w-0 items-center gap-4">
              <div className="relative h-16 w-12 shrink-0 overflow-hidden border border-line bg-surface">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.productName}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0">
                {item.productSlug ? (
                  <Link
                    href={`/shop/${item.productSlug}`}
                    className="block truncate text-xs font-bold tracking-tight uppercase text-ink hover:underline"
                  >
                    {item.productName}
                  </Link>
                ) : (
                  <p className="truncate text-xs font-bold tracking-tight uppercase text-ink">
                    {item.productName}
                  </p>
                )}
                <p className="mt-0.5 text-[11px] text-muted">
                  Color: {item.colorName} · {item.size ? `Size ${item.size}` : "One Size"} · Qty{" "}
                  {item.quantity}
                </p>
                <p className="mt-0.5 text-[11px] tabular-nums text-muted">
                  {formatIDR(item.unitPrice)} / unit
                </p>
              </div>
            </div>
            <span className="shrink-0 text-xs font-semibold tabular-nums text-ink">
              {formatIDR(item.subtotal)}
            </span>
          </div>
        ))}
      </div>

      {/* FINANCIAL SUMMARY */}
      <div className="space-y-2 border-t border-line pt-5 text-xs">
        <div className="flex justify-between text-muted">
          <span>SUBTOTAL</span>
          <span className="font-medium tabular-nums text-ink">{formatIDR(order.subtotal)}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-emerald-800">
            <span>DISCOUNT</span>
            <span className="font-medium tabular-nums">-{formatIDR(order.discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-muted">
          <span>SHIPPING</span>
          <span className="font-medium tabular-nums text-ink">
            {order.shippingCost === 0 ? "COMPLIMENTARY" : formatIDR(order.shippingCost)}
          </span>
        </div>
        <div className="flex justify-between border-t border-ink/30 pt-3 font-display text-base font-bold text-ink">
          <span>TOTAL</span>
          <span className="tabular-nums">{formatIDR(order.total)}</span>
        </div>
      </div>
    </section>
  );
};
