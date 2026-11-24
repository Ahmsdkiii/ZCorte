import type { FC } from "react";
import Image from "next/image";
import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import type { AdminOrderDTO, AdminProductDTO } from "@/models/types/admin";
import type { AdminTab, OrderStatusMetric } from "@/hooks/useAdminViewModel";
import { formatIDR } from "@/lib/utils";

interface AdminOverviewPanelProps {
  recentOrders: AdminOrderDTO[];
  lowStockProducts: AdminProductDTO[];
  allProducts: AdminProductDTO[];
  orderStatusSummary: OrderStatusMetric[];
  onNavigateTab: (tab: AdminTab) => void;
}

const BAR_TONES: Record<string, string> = {
  PENDING_PAYMENT: "bg-amber-700",
  PAID: "bg-accent-tactix",
  PROCESSING: "bg-accent-outdoor",
  SHIPPED: "bg-accent-apextive",
  COMPLETED: "bg-ink",
};

export const AdminOverviewPanel: FC<AdminOverviewPanelProps> = ({
  recentOrders,
  lowStockProducts,
  allProducts,
  orderStatusSummary,
  onNavigateTab,
}) => {
  const watchlist =
    lowStockProducts.length > 0
      ? lowStockProducts.slice(0, 5)
      : [...allProducts].sort((a, b) => a.totalStock - b.totalStock).slice(0, 5);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* LEFT COLUMN: PIPELINE & RECENT ORDERS */}
      <div className="space-y-6 lg:col-span-7">
        {/* ORDER FULFILLMENT PIPELINE */}
        <section
          aria-labelledby="pipeline-heading"
          className="border border-line bg-surface-raised p-6"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="eyebrow text-muted">OPERATIONAL PULSE</p>
              <h2 id="pipeline-heading" className="mt-1 text-lg font-bold tracking-tight text-ink">
                Order Fulfillment Pipeline
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab("orders")}
              className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-[0.12em] uppercase text-muted hover:text-ink"
            >
              <span>Manage Orders</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="space-y-3.5">
            {orderStatusSummary.map((item) => (
              <div key={item.status} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-ink">{item.label}</span>
                  <span className="tabular-nums text-[11px] text-muted">
                    <strong className="text-ink">{item.count}</strong> ({item.percentage}%)
                  </span>
                </div>
                <div className="h-1.5 w-full bg-surface">
                  <div
                    className={`h-full transition-all duration-500 ${
                      BAR_TONES[item.status] || "bg-ink"
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RECENT ORDERS SNAPSHOT */}
        <section
          aria-labelledby="recent-orders-heading"
          className="border border-line bg-surface-raised p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="eyebrow text-muted">LATEST ACTIVITY</p>
              <h2
                id="recent-orders-heading"
                className="mt-1 text-lg font-bold tracking-tight text-ink"
              >
                Recent Orders
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab("orders")}
              className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-[0.12em] uppercase text-muted hover:text-ink"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <p className="border border-dashed border-line bg-surface/60 px-4 py-8 text-center text-xs text-muted">
              No incoming orders recorded yet.
            </p>
          ) : (
            <div className="divide-y divide-line">
              {recentOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-ink">{order.orderNumber}</p>
                    <p className="truncate text-[11px] text-muted">
                      {order.customerName} · {order.itemCount} item(s)
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="tabular-nums text-xs font-semibold text-ink">
                      {formatIDR(order.total)}
                    </p>
                    <p className="text-[9px] font-bold tracking-widest uppercase text-muted">
                      {order.status.replace("_", " ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* RIGHT COLUMN: INVENTORY HEALTH & LOW STOCK WATCHLIST */}
      <div className="lg:col-span-5">
        <section
          aria-labelledby="inventory-watchlist-heading"
          className="flex h-full flex-col justify-between border border-line bg-surface-raised p-6"
        >
          <div>
            <div className="mb-5 flex items-start justify-between gap-2">
              <div>
                <p className="eyebrow text-muted">INVENTORY HEALTH</p>
                <h2
                  id="inventory-watchlist-heading"
                  className="mt-1 text-lg font-bold tracking-tight text-ink"
                >
                  {lowStockProducts.length > 0 ? "Low-Stock Watchlist" : "Stock Level Snapshot"}
                </h2>
              </div>
              {lowStockProducts.length > 0 ? (
                <span className="inline-flex items-center gap-1 border border-status-error/30 bg-red-50 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase text-status-error">
                  <AlertTriangle size={11} />
                  <span>{lowStockProducts.length} Alert</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 border border-status-success/30 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase text-status-success">
                  <CheckCircle2 size={11} />
                  <span>Healthy</span>
                </span>
              )}
            </div>

            <div className="divide-y divide-line">
              {watchlist.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-3 py-3 first:pt-0"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative h-11 w-9 shrink-0 overflow-hidden border border-line bg-surface">
                      {product.image && (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-ink">{product.name}</p>
                      <p className="truncate text-[10px] text-muted">
                        {product.collectionName} · {product.categoryName}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 px-2 py-0.5 text-[10px] font-bold tabular-nums ${
                      product.totalStock <= 5
                        ? "bg-red-100 text-status-error"
                        : "bg-surface text-ink"
                    }`}
                  >
                    {product.totalStock} left
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab("products")}
            className="mt-6 flex w-full items-center justify-center gap-2 border border-ink bg-surface px-4 py-2.5 text-[10px] font-semibold tracking-[0.14em] uppercase text-ink transition-colors hover:bg-ink hover:text-surface-raised"
          >
            <span>Open Full Catalog ({allProducts.length})</span>
            <ArrowRight size={13} />
          </button>
        </section>
      </div>
    </div>
  );
};
