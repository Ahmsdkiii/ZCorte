import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  withDot?: boolean;
}

export function Badge({ className, withDot = true, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold tracking-[0.12em] uppercase text-ink",
        className
      )}
      {...props}
    >
      {withDot && (
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
      )}
      {children}
    </span>
  );
}
