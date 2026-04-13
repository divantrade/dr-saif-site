import Link from "next/link";
import { axisHref } from "@/lib/types";

export interface AxisColorClasses {
  /** Filled accent (background, dark text) */
  accent: string;
  /** Soft background tint */
  soft: string;
  /** Border color */
  border: string;
  /** Text-only emphasis */
  text: string;
  /** Gradient pair (`from-x to-y`) */
  gradient: string;
}

/**
 * Map axis color name → matching Tailwind utilities. Centralised so axis
 * pages, header chips and footer pills all share the same palette and any
 * future swap is a one-line change.
 */
const COLOR_MAP: Record<string, AxisColorClasses> = {
  emerald: {
    accent: "bg-emerald-600 text-white",
    soft: "bg-emerald-50 text-emerald-800",
    border: "border-emerald-200",
    text: "text-emerald-700",
    gradient: "from-emerald-500 to-teal-600",
  },
  indigo: {
    accent: "bg-indigo-600 text-white",
    soft: "bg-indigo-50 text-indigo-800",
    border: "border-indigo-200",
    text: "text-indigo-700",
    gradient: "from-indigo-500 to-blue-600",
  },
  amber: {
    accent: "bg-amber-600 text-white",
    soft: "bg-amber-50 text-amber-900",
    border: "border-amber-200",
    text: "text-amber-700",
    gradient: "from-amber-500 to-orange-600",
  },
  rose: {
    accent: "bg-rose-600 text-white",
    soft: "bg-rose-50 text-rose-800",
    border: "border-rose-200",
    text: "text-rose-700",
    gradient: "from-rose-500 to-pink-600",
  },
  teal: {
    accent: "bg-teal-600 text-white",
    soft: "bg-teal-50 text-teal-800",
    border: "border-teal-200",
    text: "text-teal-700",
    gradient: "from-teal-500 to-cyan-600",
  },
  violet: {
    accent: "bg-violet-600 text-white",
    soft: "bg-violet-50 text-violet-800",
    border: "border-violet-200",
    text: "text-violet-700",
    gradient: "from-violet-500 to-purple-600",
  },
  orange: {
    accent: "bg-orange-600 text-white",
    soft: "bg-orange-50 text-orange-900",
    border: "border-orange-200",
    text: "text-orange-700",
    gradient: "from-orange-500 to-red-600",
  },
};

const FALLBACK: AxisColorClasses = {
  accent: "bg-gray-900 text-white",
  soft: "bg-gray-100 text-gray-800",
  border: "border-gray-200",
  text: "text-gray-700",
  gradient: "from-gray-500 to-gray-700",
};

export function axisColors(name: string | null | undefined): AxisColorClasses {
  if (!name) return FALLBACK;
  return COLOR_MAP[name] ?? FALLBACK;
}

interface AxisBadgeProps {
  name: string;
  shortName?: string | null;
  slug: string;
  color: string | null;
  axisNumber?: number;
  size?: "sm" | "md";
  asLink?: boolean;
}

/**
 * Pill that shows an axis. Use `asLink` to wrap in a `<Link>` to the axis
 * page; otherwise renders a static `<span>` (cheap inside server cards).
 */
export default function AxisBadge({
  name,
  shortName,
  slug,
  color,
  axisNumber,
  size = "sm",
  asLink = true,
}: AxisBadgeProps) {
  const c = axisColors(color);
  const sizing =
    size === "sm" ? "text-xs px-2.5 py-0.5" : "text-sm px-3 py-1";
  const label = shortName || name;
  const content = (
    <>
      {axisNumber != null && (
        <span className="opacity-60 ml-1 tabular-nums">{axisNumber}.</span>
      )}
      <span>{label}</span>
    </>
  );
  const className = `inline-flex items-center gap-1 font-medium rounded-full ${c.soft} ${sizing}`;

  if (!asLink) return <span className={className}>{content}</span>;
  return (
    <Link
      href={axisHref(slug)}
      className={`${className} hover:underline`}
      title={name}
    >
      {content}
    </Link>
  );
}
