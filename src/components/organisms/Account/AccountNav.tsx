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
  const tabs: {
    key: AccountTab;
    label: string;
    sublabel: string;
    count?: number;
  }[] = [
    {
      key: "orders",
      label: "ORDERS",
      sublabel: "Order History",
      count: orderCount,
    },
    {
      key: "addresses",
      label: "ADDRESSES",
      sublabel: "Delivery Book",
      count: addressCount,
    },
    {
      key: "profile",
      label: "PROFILE",
      sublabel: "Account Details",
    },
  ];

  return (
    <nav
      aria-label="Account navigation tabs"
      className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-b border-line pb-6"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onSelectTab(tab.key)}
            className={`group relative flex flex-col items-start justify-center p-4 border transition-all duration-200 text-left ${
              isActive
                ? "border-black bg-black text-white shadow-sm"
                : "border-line bg-surface hover:border-black/60 hover:bg-surface-raised text-black"
            }`}
          >
            <div className="flex w-full items-center justify-between">
              <span className="text-xs font-bold tracking-[0.16em] uppercase">{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-2 text-[10px] font-bold ${
                    isActive
                      ? "bg-white text-black"
                      : "bg-black/10 text-muted group-hover:bg-black group-hover:text-white"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </div>
            <span
              className={`mt-1 text-[11px] font-normal ${
                isActive ? "text-white/70" : "text-muted"
              }`}
            >
              {tab.sublabel}
            </span>
            {isActive && (
              <span className="absolute -bottom-[25px] left-1/2 -translate-x-1/2 w-4 h-1 bg-black hidden sm:block" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
