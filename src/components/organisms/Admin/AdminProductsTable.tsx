import type { FC } from "react";
import Image from "next/image";
import type { AdminProductDTO, AdminProductStatus } from "@/models/types/admin";
import { formatIDR } from "@/lib/utils";

interface AdminProductsTableProps {
  products: AdminProductDTO[];
  onOpenCreateModal: () => void;
  onUpdateStatus: (id: string, status: AdminProductStatus) => void;
  isPending: boolean;
}

export const AdminProductsTable: FC<AdminProductsTableProps> = ({
  products,
  onOpenCreateModal,
  onUpdateStatus,
  isPending,
}) => {
  return (
    <section aria-labelledby="products-table-heading" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id="products-table-heading" className="text-lg font-bold tracking-tight">
            Katalog Produk & Inventori
          </h2>
          <p className="text-xs text-muted">
            Manage storefront catalogue listings, pricing, and live operational status.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="border border-black bg-black px-4 py-2 text-[10px] font-semibold tracking-[0.14em] uppercase text-white hover:opacity-85"
        >
          + ADD NEW PRODUCT
        </button>
      </div>

      <div className="overflow-x-auto border border-line bg-surface">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-line bg-surface-raised text-[10px] uppercase tracking-wider text-muted font-semibold">
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
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-surface-raised/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.image ? (
                      <div className="relative h-10 w-8 bg-surface-raised overflow-hidden shrink-0">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-8 bg-surface-raised border border-line shrink-0" />
                    )}
                    <div>
                      <p className="font-semibold text-black">{p.name}</p>
                      <p className="text-[10px] text-muted">/{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">{p.collectionName}</td>
                <td className="px-4 py-3 text-muted">{p.categoryName}</td>
                <td className="px-4 py-3 text-right font-medium text-black">
                  {formatIDR(p.price)}
                </td>
                <td className="px-4 py-3 text-center font-medium">
                  <span
                    className={`inline-block px-2 py-0.5 text-[9px] font-bold ${
                      p.totalStock <= 5 ? "bg-red-100 text-red-800" : "bg-surface-raised text-black"
                    }`}
                  >
                    {p.totalStock} units
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block border px-2 py-0.5 text-[8px] font-bold uppercase ${
                      p.status === "ACTIVE"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-neutral-400 bg-neutral-100 text-neutral-800"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => onUpdateStatus(p.id, p.status === "ACTIVE" ? "DRAFT" : "ACTIVE")}
                    className="text-[10px] uppercase font-semibold text-muted hover:text-black underline underline-offset-4"
                  >
                    Toggle {p.status === "ACTIVE" ? "Draft" : "Active"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
