import Link from "next/link";
import type { SeriesSummary, AxisSummary } from "@/lib/types";
import { seriesHref } from "@/lib/types";
import { axisColors, axisColorByNumber } from "./AxisBadge";

interface Props {
  series: SeriesSummary[];
  axes: AxisSummary[];
}

/**
 * Featured series spotlight — shows the 4 series flagged as `featured`
 * in Sanity, each wearing the colour of its parent axis. Sits between
 * the latest-posts grid and the quote wall on the homepage.
 */
export default function FeaturedSeries({ series, axes }: Props) {
  const featured = series.filter((s) => s.featured);
  if (featured.length === 0) return null;

  const axesByNumber = new Map(axes.map((a) => [a.axisNumber, a]));

  return (
    <section className="relative bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-24">
        {/* Section header */}
        <div className="flex items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4 text-emerald-800">
              <span className="font-display text-sm tabular-nums">٠٣</span>
              <span className="h-px w-12 bg-emerald-700/30" />
              <span className="text-[11px] tracking-[0.35em] uppercase">
                السلاسل
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-stone-900 leading-[1.05] mb-4">
              الكتابات في حلقات
            </h2>
            <p className="text-base md:text-lg text-stone-600 leading-[2]">
              أعمدة أسبوعية و مشاريع مقاليّة مرقَّمة، تتراكم حلقة بعد حلقة
              لتُحكم بناء أطروحة متكاملة حول قضية واحدة.
            </p>
          </div>
          <Link
            href="/series"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-950 border-b border-emerald-700/30 hover:border-emerald-700 pb-0.5 transition-colors shrink-0"
          >
            كل السلاسل
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
          </Link>
        </div>

        {/* Grid */}
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((s) => {
            const ax = axesByNumber.get(s.axisNumber);
            const c = ax?.color
              ? axisColors(ax.color)
              : axisColorByNumber(s.axisNumber);

            return (
              <li key={s._id}>
                <Link
                  href={seriesHref(s.slug)}
                  className="group relative flex flex-col h-full rounded-2xl border border-stone-200 bg-white p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Coloured edge */}
                  <div
                    className={`absolute inset-y-0 right-0 w-1 bg-gradient-to-b ${c.gradient}`}
                    aria-hidden
                  />

                  {/* Episode count as editorial figure */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span
                      className={`font-display font-bold text-4xl leading-none tabular-nums ${c.text}`}
                    >
                      {s.postCount.toLocaleString("ar-EG")}
                    </span>
                    <span className="text-[10px] tracking-[0.3em] uppercase text-stone-400">
                      حلقة
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-stone-900 leading-snug mb-2 group-hover:text-emerald-800 transition-colors">
                    {s.name}
                  </h3>
                  {s.tagline && (
                    <p className="text-sm text-stone-600 leading-relaxed line-clamp-2 mb-4">
                      {s.tagline}
                    </p>
                  )}

                  {ax && (
                    <div className="mt-auto pt-3 border-t border-stone-100 text-xs text-stone-500">
                      في محور:{" "}
                      <span className={`font-semibold ${c.text}`}>
                        {ax.shortName || ax.name}
                      </span>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
