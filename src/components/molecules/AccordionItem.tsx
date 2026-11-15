"use client";

import React, { useState } from "react";
import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/utils";

export interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  className,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <details
      open={isOpen}
      onToggle={(e) => setIsOpen(e.currentTarget.open)}
      className={cn("border-t border-line group py-4", className)}
    >
      <summary className="flex min-h-11 items-center justify-between cursor-pointer list-none text-xs font-semibold uppercase tracking-[0.1em] text-ink select-none">
        <span>{title}</span>
        <span className="text-muted transition-transform duration-200">
          <Icon name={isOpen ? "minus" : "plus"} size={14} />
        </span>
      </summary>
      <div className="pt-3 text-xs leading-relaxed text-muted">{children}</div>
    </details>
  );
}
