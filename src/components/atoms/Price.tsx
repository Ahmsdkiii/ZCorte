import React from "react";
import { formatIDR, cn } from "@/lib/utils";

export interface PriceProps extends React.HTMLAttributes<HTMLSpanElement> {
  amount: number;
}

export function Price({ amount, className, ...props }: PriceProps) {
  return (
    <span
      className={cn("text-xs sm:text-sm font-medium tracking-tight text-ink", className)}
      {...props}
    >
      {formatIDR(amount)}
    </span>
  );
}
