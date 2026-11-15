import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors uppercase tracking-[0.08em] disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const variants = {
      primary: "bg-button text-button-text hover:bg-button-hover",
      secondary: "bg-surface-raised text-ink border border-line hover:bg-surface-secondary",
      outline: "border border-control text-ink hover:bg-ink hover:text-surface",
      ghost: "text-ink hover:text-muted",
    };

    const sizes = {
      sm: "h-11 px-3 text-xs gap-1.5",
      md: "h-11 px-5 text-xs gap-2",
      lg: "h-14 px-8 text-sm gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
