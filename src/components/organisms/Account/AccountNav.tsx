import type { FC } from "react";
import type { AccountTab } from "@/hooks/useAccountViewModel";

interface AccountNavProps {
  activeTab: AccountTab;
  onSelectTab: (tab: AccountTab) => void;
  orderCount: number;
  addressCount: number;
}

export const AccountNav: FC<AccountNavProps> = ({
  activeTab,
  onSelectTab,
  orderCount,
  addressCount,
}) => {
  const tabs: { key: AccountTab; label: string; count?: number }[] = [
    { key: "orders", label: "ORDERS", count: orderCount },
    { key: "addresses", label: "ADDRESSES", count: addressCount },
    { key: "profile", label: "PROFILE SETTINGS" },
  ];

  return (
    <nav aria-label="Account navigation" className="flex flex-wrap gap-2 border-b border-line pb-4">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onSelectTab(tab.key)}
            className={`flex items-center gap-2 border px-4 py-2.5 text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors ${
              isActive
                ? "border-black bg-black text-white"
                : "border-control bg-surface-raised text-muted hover:border-black hover:text-black"
            }`}
          >
            <span>{tab.label}</span>
            {typeof tab.count === "number" && (
              <span
                className={`inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1.5 text-[9px] ${
                  isActive ? "bg-white/20 text-white" : "bg-black/10 text-muted"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
