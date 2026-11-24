import type { FC } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, Plus } from "lucide-react";
import type { AdminTab } from "@/hooks/useAdminViewModel";

interface AdminHeaderProps {
  activeTab: AdminTab;
  onOpenSidebar: () => void;
  onOpenCreateProduct: () => void;
}

const TAB_LABELS: Record<AdminTab, { crumb: string; title: string }> = {
  overview: { crumb: "Overview", title: "Command Center" },
  orders: { crumb: "Orders", title: "Incoming Orders" },
  products: { crumb: "Products & Stock", title: "Catalog & Inventory" },
};

export const AdminHeader: FC<AdminHeaderProps> = ({
  activeTab,
  onOpenSidebar,
  onOpenCreateProduct,
}) => {
  const meta = TAB_LABELS[activeTab];

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-surface-raised/90 px-4 backdrop-blur-sm sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open navigation sidebar"
          className="flex h-9 w-9 items-center justify-center border border-line bg-surface text-ink hover:border-ink lg:hidden"
        >
          <Menu size={17} />
        </button>

        <div>
          <p className="eyebrow text-muted">
            ZCORTÉ HQ <span className="mx-1 text-control">/</span> {meta.crumb}
          </p>
          <p className="font-display text-sm font-bold tracking-tight text-ink sm:text-base">
            {meta.title}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="hidden items-center gap-1.5 border border-line bg-surface px-3 py-2 text-[10px] font-semibold tracking-[0.12em] uppercase text-ink transition-colors hover:border-ink sm:inline-flex"
        >
          <span>Storefront</span>
          <ArrowUpRight size={13} />
        </Link>

        <button
          type="button"
          onClick={onOpenCreateProduct}
          className="inline-flex items-center gap-1.5 border border-button bg-button px-3.5 py-2 text-[10px] font-semibold tracking-[0.14em] uppercase text-button-text transition-colors hover:bg-button-hover"
        >
          <Plus size={13} />
          <span>New Product</span>
        </button>
      </div>
    </header>
  );
};
