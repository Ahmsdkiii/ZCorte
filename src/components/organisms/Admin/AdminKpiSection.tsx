import type { FC } from "react";
import { Banknote, CheckCircle2, Clock3, TrendingUp } from "lucide-react";
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
      subtitle: "Verified paid & completed orders",
      icon: Banknote,
      highlight: true,
    },
    {
      title: "PAID ORDERS",
      value: kpi.paidOrdersCount.toString(),
      subtitle: "Successfully settled transactions",
      icon: CheckCircle2,
      highlight: false,
    },
    {
      title: "PENDING SETTLEMENT",
      value: kpi.pendingOrdersCount.toString(),
      subtitle: "Awaiting customer payment",
      icon: Clock3,
      highlight: false,
    },
    {
      title: "AVERAGE ORDER VALUE",
      value: formatIDR(kpi.averageOrderValue),
      subtitle: "Mean acquisition basket",
      icon: TrendingUp,
      highlight: false,
    },
  ];

  return (
    <section
      aria-labelledby="kpi-heading"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <h2 id="kpi-heading" className="sr-only">
        Key Performance Indicators
      </h2>
      {cards.map((card) => {
        const CardIcon = card.icon;
        return (
          <div
            key={card.title}
            className={`flex flex-col justify-between border p-5 transition-colors ${
              card.highlight
                ? "border-cinematic-bg bg-cinematic-bg text-cinematic-text"
                : "border-line bg-surface-raised text-ink"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className={`text-[9px] font-bold tracking-[0.16em] uppercase ${
                  card.highlight ? "text-cinematic-muted/80" : "text-muted"
                }`}
              >
                {card.title}
              </span>
              <CardIcon
                size={15}
                className={card.highlight ? "text-cinematic-muted/70" : "text-muted"}
              />
            </div>
            <div className="my-3.5">
              <span className="font-display text-2xl font-bold tracking-tight tabular-nums">
                {card.value}
              </span>
            </div>
            <span
              className={`text-[11px] ${card.highlight ? "text-cinematic-muted/70" : "text-muted"}`}
            >
              {card.subtitle}
            </span>
          </div>
        );
      })}
    </section>
  );
};
