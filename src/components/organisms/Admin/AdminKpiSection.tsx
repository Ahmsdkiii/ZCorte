import type { FC } from "react";
import type { AdminKpiDTO } from "@/models/types/admin";
import { formatIDR } from "@/lib/utils";

interface AdminKpiSectionProps {
  kpi: AdminKpiDTO;
}

export const AdminKpiSection: FC<AdminKpiSectionProps> = ({ kpi }) => {
  const cards = [
    {
      title: "TOTAL REVENUE",
      value: formatIDR(kpi.totalRevenue),
      subtitle: "Verified paid orders",
      highlight: true,
    },
    {
      title: "PAID ORDERS",
      value: kpi.paidOrdersCount.toString(),
      subtitle: "Successfully settled transactions",
    },
    {
      title: "PENDING SETTLEMENT",
      value: kpi.pendingOrdersCount.toString(),
      subtitle: "Awaiting customer payment",
    },
    {
      title: "AVERAGE ORDER VALUE",
      value: formatIDR(kpi.averageOrderValue),
      subtitle: "Mean acquisition basket",
    },
  ];

  return (
    <section
      aria-labelledby="kpi-heading"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <h2 id="kpi-heading" className="sr-only">
        Key Performance Indicators
      </h2>
      {cards.map((card) => (
        <div
          key={card.title}
          className={`flex flex-col justify-between border p-5 transition-colors ${
            card.highlight
              ? "border-black bg-black text-white"
              : "border-line bg-surface text-black"
          }`}
        >
          <span
            className={`text-[9px] font-bold tracking-[0.16em] uppercase ${
              card.highlight ? "text-white/70" : "text-muted"
            }`}
          >
            {card.title}
          </span>
          <div className="my-3">
            <span className="font-display text-2xl font-bold tracking-tight">{card.value}</span>
          </div>
          <span className={`text-[10px] ${card.highlight ? "text-white/60" : "text-muted"}`}>
            {card.subtitle}
          </span>
        </div>
      ))}
    </section>
  );
};
