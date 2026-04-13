import Link from "next/link";
import type { AxisSummary } from "@/lib/types";
import { axisHref } from "@/lib/types";
import { axisColors, axisColorByNumber } from "./AxisBadge";

interface Props {
  axes: AxisSummary[];
}

/**
 * The seven thematic axes that organise the project. Rendered in a
 * 4 + 3 editorial layout on large screens — second row is width-capped
 * and centered so every card keeps the same width as row one without
 * leaving an empty cell. Stacks to 2×2×2×1 on tablets, single column
 * on phones.
 */
export default function AxesShowcase({ axes }: Props) {
  const firstRow = axes.slice(0, 4);
  const secondRow = axes.slice(4, 7);

  return (
    <section className="relative bg-white">
      <div className="h-px bg-gradient-to-l from-transparent via-stone-200 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-24">
        {/* Section header */}
        <div className="max-w-3xl mb-14 md:mb-16">
          <div className="flex items-center gap-3 mb-5 text-emerald-800">
            <span className="font-display text-sm tabular-nums">٠٢</span>
            <span className="h-px w-12 bg-emerald-700/30" />
            <span className="text-[11px] tracking-[0.35em] uppercase">
              المحاور الفكريّة
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 leading-[1.05] mb-5">
            المشروع الفكري
          </h2>
          <p className="text-base md:text-lg text-stone-600 leading-[2] max-w-2xl">
            سبعة محاور تتقاطع و تتكامل — من التأسيس المنهجي إلى المقاومة
            الحضارية — لتُشكّل رؤية واحدة تقرأ الواقع العربي و الإسلامي
            من منظور حضاري.
          </p>
        </div>

        {/* Row 1 — first four axes */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {firstRow.map((a) => (
            <li key={a._id}>
              <AxisCard axis={a} />
            </li>
          ))}
        </ul>

        {/* Row 2 — remaining three, same card width as row one
            (3-col grid at 75% of the container). Falls back to 2/1
            columns on smaller viewports. */}
        {secondRow.length > 0 && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:w-3/4 lg:mx-auto mt-5">
            {secondRow.map((a) => (
              <li key={a._id}>
                <AxisCard axis={a} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function AxisCard({ axis }: { axis: AxisSummary }) {
  const c = axis.color
    ? axisColors(axis.color)
    : axisColorByNumber(axis.axisNumber);

  return (
    <Link
      href={axisHref(axis.slug)}
      className={`group relative flex flex-col h-full rounded-2xl border ${c.border} bg-white p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
    >
      <div
        className={`absolute inset-y-0 right-0 w-1.5 bg-gradient-to-b ${c.gradient}`}
        aria-hidden
      />

      <div className="flex items-baseline gap-3 mb-4">
        <span
          className={`font-display font-bold text-5xl leading-none tabular-nums ${c.text}`}
        >
          {axis.axisNumber}
        </span>
        <span className="text-[10px] tracking-[0.35em] uppercase text-stone-400">
          محور
        </span>
      </div>

      <h3 className="font-display font-bold text-xl text-stone-900 leading-snug mb-2 group-hover:text-emerald-800 transition-colors">
        {axis.name}
      </h3>
      {axis.tagline && (
        <p className="text-sm text-stone-600 leading-relaxed mb-5 line-clamp-2">
          {axis.tagline}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between pt-4 border-t border-stone-100">
        <span className={`text-xs font-semibold tabular-nums ${c.text}`}>
          {axis.postCount.toLocaleString("ar-EG")} مقال
        </span>
        <span
          className={`flex items-center gap-1 text-xs font-medium ${c.text} translate-x-0 group-hover:-translate-x-1 transition-transform`}
        >
          استعرض
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
