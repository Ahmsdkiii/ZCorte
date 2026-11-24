import type { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import type { OrderSummaryDTO, AccountOrderStatus } from "@/models/types/account";
import { formatIDR } from "@/lib/utils";

interface AccountOrdersSectionProps {
  orders: OrderSummaryDTO[];
}

function getStatusBadgeClass(status: AccountOrderStatus): string {
  switch (status) {
    case "PAID":
    case "COMPLETED":
      return "border-emerald-600 bg-emerald-50 text-emerald-800";
    case "PROCESSING":
    case "SHIPPED":
      return "border-blue-600 bg-blue-50 text-blue-800";
    case "PENDING_PAYMENT":
      return "border-amber-600 bg-amber-50 text-amber-800";
    case "CANCELLED":
    case "EXPIRED":
      return "border-red-600 bg-red-50 text-red-800";
    default:
      return "border-neutral-400 bg-neutral-100 text-neutral-800";
  }
}

export const AccountOrdersSection: FC<AccountOrdersSectionProps> = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <section aria-labelledby="orders-heading">
        <h2 id="orders-heading" className="text-xl font-medium tracking-tight mb-2">
          Order History
        </h2>
        <div className="border border-dashed border-line p-10 text-center">
          <p className="text-sm font-medium text-black">No orders placed yet</p>
          <p className="mt-1 text-xs text-muted">
            Explore our latest collections and acquire timeless garments.
          </p>
          <Link
            href="/shop"
            className="mt-5 inline-block border border-black bg-black px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white hover:opacity-85"
          >
            DISCOVER CATALOG
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="orders-heading">
      <div className="mb-6">
        <h2 id="orders-heading" className="text-xl font-medium tracking-tight">
          Order History
        </h2>
        <p className="mt-1 text-xs text-muted">
          Review your previous acquisitions, current status, and fulfillment updates.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const formattedDate = new Date(order.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          return (
            <div
              key={order.id}
              className="border border-line bg-surface p-5 sm:p-6 transition-colors hover:border-black/40"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <Link
                      href={`/account/orders/${order.orderNumber}`}
                      className="text-xs font-bold tracking-widest text-black underline-offset-4 hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                    <span
                      className={`inline-block border px-2 py-0.5 text-[8px] font-bold tracking-widest uppercase ${getStatusBadgeClass(
                        order.status
                      )}`}
                    >
                      {order.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted">Placed on {formattedDate}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted block">
                    Total
                  </span>
                  <span className="text-sm font-bold text-black">{formatIDR(order.total)}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-4 space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    {item.image ? (
                      <div className="relative h-14 w-12 shrink-0 bg-surface-raised overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.productName}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-14 w-12 shrink-0 bg-surface-raised border border-line" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-black truncate">{item.productName}</p>
                      <p className="text-[11px] text-muted">
                        Color: {item.colorName} {item.size ? `· Size: ${item.size}` : ""} · Qty:{" "}
                        {item.quantity}
                      </p>
                    </div>
                    <div className="text-right text-xs font-medium text-black">
                      {formatIDR(item.subtotal)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer & Actions */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-4">
                <div className="text-xs text-muted">
                  {order.courierName ? (
                    <span>
                      Courier: <strong className="text-black">{order.courierName}</strong>
                      {order.trackingNumber ? ` (${order.trackingNumber})` : ""}
                    </span>
                  ) : (
                    <span>Standard Studio Dispatch</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <Link
                    href={`/account/orders/${order.orderNumber}`}
                    className="border border-control bg-surface-raised px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-ink hover:border-ink"
                  >
                    VIEW INVOICE &amp; TRACK ↗
                  </Link>
                  {order.status === "PENDING_PAYMENT" && (
                    <Link
                      href={`/account/orders/${order.orderNumber}`}
                      className="border border-black bg-black px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-white hover:opacity-85"
                    >
                      PAY OR CANCEL
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
