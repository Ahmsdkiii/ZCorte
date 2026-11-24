import React from "react";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowLeft,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Maximize2,
  User,
} from "lucide-react";

export type IconName =
  | "arrow-up-right"
  | "arrow-down"
  | "arrow-left"
  | "menu"
  | "close"
  | "chevron-left"
  | "chevron-right"
  | "plus"
  | "minus"
  | "expand"
  | "user";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 18, className, ...props }: IconProps) {
  switch (name) {
    case "arrow-up-right":
      return <ArrowUpRight size={size} className={className} {...props} />;
    case "arrow-down":
      return <ArrowDown size={size} className={className} {...props} />;
    case "arrow-left":
      return <ArrowLeft size={size} className={className} {...props} />;
    case "menu":
      return <Menu size={size} className={className} {...props} />;
    case "close":
      return <X size={size} className={className} {...props} />;
    case "chevron-left":
      return <ChevronLeft size={size} className={className} {...props} />;
    case "chevron-right":
      return <ChevronRight size={size} className={className} {...props} />;
    case "plus":
      return <Plus size={size} className={className} {...props} />;
    case "minus":
      return <Minus size={size} className={className} {...props} />;
    case "expand":
      return <Maximize2 size={size} className={className} {...props} />;
    case "user":
      return <User size={size} className={className} {...props} />;
    default:
      return null;
  }
}
