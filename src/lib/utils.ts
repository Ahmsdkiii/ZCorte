import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatIDR(amount: number): string {
  return `Rp\u00A0${amount.toLocaleString("id-ID")}`;
}
