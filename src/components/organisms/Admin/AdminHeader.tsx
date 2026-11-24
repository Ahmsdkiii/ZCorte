import type { FC } from "react";
import Link from "next/link";
import { Icon } from "@/components/atoms";

interface AdminHeaderProps {
  onLogout: () => void;
  isPending: boolean;
}

export const AdminHeader: FC<AdminHeaderProps> = ({ onLogout, isPending }) => {
  return (
    <header className="border-b border-line bg-surface px-gutter py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="font-display text-xl font-black tracking-[-0.04em] text-black"
          >
            ZCORTÉ{" "}
            <span className="text-xs font-semibold tracking-widest text-muted">/ OWNER HQ</span>
          </Link>
          <span className="hidden sm:inline-block border border-black bg-black px-2 py-0.5 text-[8px] font-bold tracking-widest uppercase text-white">
            ADMINISTRATOR
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.1em] uppercase text-muted hover:text-black"
          >
            <span>VIEW STOREFRONT</span>
            <Icon name="arrow-up-right" size={13} />
          </Link>
          <button
            type="button"
            onClick={onLogout}
            disabled={isPending}
            className="border border-control bg-surface-raised px-3 py-1.5 text-[10px] font-semibold tracking-[0.1em] uppercase text-black hover:border-black disabled:opacity-50"
          >
            {isPending ? "EXITING..." : "SIGN OUT"}
          </button>
        </div>
      </div>
    </header>
  );
};
