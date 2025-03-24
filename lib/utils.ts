import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const bookStatuses = {
  available: {
    label: "Available",
    indicator: "bg-[#77ff9d]",
    className: "bg-[#77ff9d]/20 text-[#009a2b]",
  },
  borrowed: {
    label: "Borrowed",
    indicator: "bg-[#ff4d4d]",
    className: "bg-[#ff8181]/20 text-[#c22424]",
  },
  reserved: {
    label: "Reserved",
    indicator: "bg-[#d97921]",
    className: "bg-[#d97921]/20 text-[#d97921]",
  },
  overdue: {
    label: "Overdue",
    indicator: "bg-[#ff4d4d]",
    className: "bg-[#ff8181]/20 text-[#c22424]",
  },
  returned: {
    label: "Returned",
    indicator: "bg-[#e1e1e1]",
    className: "bg-[#e1e1e1]/20 text-[#9a9a9a]",
  },
}

