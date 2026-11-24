import type { FC } from "react";
import Image from "next/image";
import type { AdminProductDTO, AdminProductStatus } from "@/models/types/admin";
import { formatIDR } from "@/lib/utils";

interface AdminProductsTableProps {
  products: AdminProductDTO[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCreateModal: () => void;
  onUpdateStatus: (id: string, status: AdminProductStatus) => void;
  isPending: boolean;
}

export const AdminProductsTable: FC<AdminProductsTableProps> = ({
  products,
  searchQuery,
  onSearchChange,
  onOpenCreateModal,
  onUpdateStatus,
  isPending,
}) => {
  return (
    <section aria-labelledby="products-table-heading" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-muted">STOREFRONT ASSORTMENT</p>
          <h2
            id="products-table-heading"
            className="mt-1 text-xl font-bold tracking-tight text-ink"
          >
            Product Catalog & Inventory
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Manage storefront listings, pricing, stock visibility, and live publication status.
          </p>
        </div>

        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <input
            type="search"
            aria-label="Search products"
            placeholder="Search product, collection, or category..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 border border-control bg-surface-raised px-3 py-2 text-xs text-ink focus:border-ink focus:outline-none sm:w-64 sm:flex-none"
          />
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="border border-button bg-button px-4 py-2 text-[10px] font-semibold tracking-[0.14em] uppercase text-button-text hover:bg-button-hover"
          >
            + Add Product
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-line bg-surface-raised">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-line bg-surface text-[10px] font-semibold tracking-wider uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Collection</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-center">Total Stock</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted">
                  No products matching your search.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-surface/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.image ? (
                        <div className="relative h-10 w-8 shrink-0 overflow-hidden border border-line bg-surface">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-8 shrink-0 border border-line bg-surface" />
                      )}
                      <div>
                        <p className="font-semibold text-ink">{p.name}</p>
                        <p className="text-[10px] text-muted">/{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{p.collectionName}</td>
                  <td className="px-4 py-3 text-muted">{p.categoryName}</td>
                  <td className="px-4 py-3 text-right font-medium tabular-nums text-ink">
                    {formatIDR(p.price)}
                  </td>
                  <td className="px-4 py-3 text-center font-medium tabular-nums">
                    <span
                      className={`inline-block px-2 py-0.5 text-[9px] font-bold ${
                        p.totalStock <= 5 ? "bg-red-100 text-status-error" : "bg-surface text-ink"
                      }`}
                    >
                      {p.totalStock} units
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block border px-2 py-0.5 text-[8px] font-bold tracking-widest uppercase ${
                        p.status === "ACTIVE"
                          ? "border-emerald-600/40 bg-emerald-50 text-emerald-800"
                          : "border-neutral-400/50 bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() =>
                        onUpdateStatus(p.id, p.status === "ACTIVE" ? "DRAFT" : "ACTIVE")
                      }
                      className="text-[10px] font-semibold tracking-wider uppercase text-muted underline underline-offset-4 hover:text-ink"
                    >
                      Set {p.status === "ACTIVE" ? "Draft" : "Active"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
