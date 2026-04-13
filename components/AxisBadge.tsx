import Link from "next/link";
import { axisHref } from "@/lib/types";

export interface AxisColorClasses {
  /** Filled accent (background + contrast text) */
  accent: string;
  /** Soft tinted background */
  soft: string;
  /** Border color */
  border: string;
  /** Text-only emphasis */
  text: string;
  /** Gradient pair (`from-x to-y`) */
  gradient: string;
  /** Solid dot / bullet background */
  dot: string;
  /** Raw hex — for inline styles where Tailwind JIT might not see dynamic strings */
  dotHex: string;
}

/**
 * Centralised axis palette. Editing a colour here updates it everywhere —
 * MegaMenu dots, axis page hero, footer pills, post cards.
 *
 * The 7-colour palette matches the spec:
 *   axis 1 التأسيس  → emerald  (#059669)
 *   axis 2 التراث  → sky       (#0284c7)
 *   axis 3 النهوض  → violet    (#7c3aed)
 *   axis 4 الاستبداد → red     (#dc2626)
 *   axis 5 المواطنة → amber    (#d97706)
 *   axis 6 الثورات  → orange   (#ea580c)
 *   axis 7 المقاومة → lime     (#65a30d)
 *
 * The legacy colour keys (indigo / rose / teal) remain here as a safety net
 * in case an older `apply:axes` run still has those values in Sanity.
 */
const COLOR_MAP: Record<string, AxisColorClasses> = {
  emerald: {
    accent: "bg-emerald-600 text-white",
    soft: "bg-emerald-50 text-emerald-900",
    border: "border-emerald-200",
    text: "text-emerald-700",
    gradient: "from-emerald-500 to-teal-600",
    dot: "bg-emerald-600",
    dotHex: "#059669",
  },
  sky: {
    accent: "bg-sky-600 text-white",
    soft: "bg-sky-50 text-sky-900",
    border: "border-sky-200",
    text: "text-sky-700",
    gradient: "from-sky-500 to-blue-600",
    dot: "bg-sky-600",
    dotHex: "#0284c7",
  },
  violet: {
    accent: "bg-violet-600 text-white",
    soft: "bg-violet-50 text-violet-900",
    border: "border-violet-200",
    text: "text-violet-700",
    gradient: "from-violet-500 to-purple-600",
    dot: "bg-violet-600",
    dotHex: "#7c3aed",
  },
  red: {
    accent: "bg-red-600 text-white",
    soft: "bg-red-50 text-red-900",
    border: "border-red-200",
    text: "text-red-700",
    gradient: "from-red-500 to-rose-600",
    dot: "bg-red-600",
    dotHex: "#dc2626",
  },
  amber: {
    accent: "bg-amber-600 text-white",
    soft: "bg-amber-50 text-amber-900",
    border: "border-amber-200",
    text: "text-amber-700",
    gradient: "from-amber-500 to-orange-600",
    dot: "bg-amber-600",
    dotHex: "#d97706",
  },
  orange: {
    accent: "bg-orange-600 text-white",
    soft: "bg-orange-50 text-orange-900",
    border: "border-orange-200",
    text: "text-orange-700",
    gradient: "from-orange-500 to-red-600",
    dot: "bg-orange-600",
    dotHex: "#ea580c",
  },
  lime: {
    accent: "bg-lime-600 text-white",
    soft: "bg-lime-50 text-lime-900",
    border: "border-lime-200",
    text: "text-lime-700",
    gradient: "from-lime-500 to-green-600",
    dot: "bg-lime-600",
    dotHex: "#65a30d",
  },
  // ─── Legacy fallbacks — keep so old Sanity values still render. ─────────
  indigo: {
    accent: "bg-indigo-600 text-white",
    soft: "bg-indigo-50 text-indigo-900",
    border: "border-indigo-200",
    text: "text-indigo-700",
    gradient: "from-indigo-500 to-blue-600",
    dot: "bg-indigo-600",
    dotHex: "#4f46e5",
  },
  rose: {
    accent: "bg-rose-600 text-white",
    soft: "bg-rose-50 text-rose-900",
    border: "border-rose-200",
    text: "text-rose-700",
    gradient: "from-rose-500 to-pink-600",
    dot: "bg-rose-600",
    dotHex: "#e11d48",
  },
  teal: {
    accent: "bg-teal-600 text-white",
    soft: "bg-teal-50 text-teal-900",
    border: "border-teal-200",
    text: "text-teal-700",
    gradient: "from-teal-500 to-cyan-600",
    dot: "bg-teal-600",
    dotHex: "#0d9488",
  },
};

const FALLBACK: AxisColorClasses = {
  accent: "bg-gray-900 text-white",
  soft: "bg-gray-100 text-gray-900",
  border: "border-gray-200",
  text: "text-gray-700",
  gradient: "from-gray-500 to-gray-700",
  dot: "bg-gray-500",
  dotHex: "#6b7280",
};

export function axisColors(name: string | null | undefined): AxisColorClasses {
  if (!name) return FALLBACK;
  return COLOR_MAP[name] ?? FALLBACK;
}

/**
 * Deterministic fallback by axis number, for the rare case where an axis
 * document in Sanity hasn't been assigned a colour yet.
 */
export function axisColorByNumber(n: number | null | undefined): AxisColorClasses {
  const byNumber: Record<number, string> = {
    1: "emerald",
    2: "sky",
    3: "violet",
    4: "red",
    5: "amber",
    6: "orange",
    7: "lime",
  };
  if (n == null) return FALLBACK;
  return axisColors(byNumber[n]);
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
 * Pill component for rendering an axis inline (post cards, breadcrumbs).
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
