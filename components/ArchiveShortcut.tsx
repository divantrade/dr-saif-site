import Link from "next/link";
import type { YearSummary, PublisherSummary } from "@/lib/types";
import { yearHref, categoryHref } from "@/lib/types";

interface Props {
  years: YearSummary[];
  publishers: PublisherSummary[];
}

/**
 * Compact archive shortcut — two columns (years | publishers) with a
 * tightly-packed editorial feel. Offers the reader a second entry point
 * beside the thematic axes.
 */
export default function ArchiveShortcut({ years, publishers }: Props) {
  return (
    <section className="relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-24">
        {/* Section header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-3 mb-4 text-emerald-800">
            <span className="font-display text-sm tabular-nums">٠٥</span>
            <span className="h-px w-12 bg-emerald-700/30" />
            <span className="text-[11px] tracking-[0.35em] uppercase">
              الأرشيف
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-stone-900 leading-[1.05] mb-4">
            أو تصفّح من الأرشيف
          </h2>
          <p className="text-base md:text-lg text-stone-600 leading-[2]">
            كل ما نُشر — مُرتَّب بحسب السنة أو بحسب المنصّة التي خرجت فيها
            الكتابة أصلاً.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Years */}
          <div>
            <div className="flex items-baseline justify-between mb-5">
              <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-stone-500">
                حسب السنة
              </h3>
              <span className="text-xs text-stone-400 tabular-nums">
                {years.reduce((s, y) => s + y.count, 0).toLocaleString("ar-EG")}{" "}
                مقال إجمالاً
              </span>
            </div>
            <ul className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 gap-2.5">
              {years.map((y) => (
                <li key={y.year}>
                  <Link
                    href={yearHref(y.year)}
                    className="group flex flex-col items-center justify-center py-4 rounded-xl border border-stone-100 bg-stone-50/50 hover:bg-emerald-50 hover:border-emerald-200 transition-all"
                  >
                    <span className="font-display text-xl font-bold text-stone-900 tabular-nums group-hover:text-emerald-800">
                      {y.year}
                    </span>
                    <span className="text-[10px] tracking-wider text-stone-400 tabular-nums mt-1">
                      {y.count.toLocaleString("ar-EG")} مقال
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Publishers */}
          <div>
            <div className="flex items-baseline justify-between mb-5">
              <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-stone-500">
                حسب منصّة النشر
              </h3>
              <span className="text-xs text-stone-400 tabular-nums">
                {publishers.length.toLocaleString("ar-EG")} منصّة
              </span>
            </div>
            <ul className="space-y-2">
              {publishers.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={categoryHref(p.slug)}
                    className="group flex items-baseline justify-between gap-3 px-5 py-3.5 rounded-xl border border-stone-100 bg-stone-50/50 hover:bg-emerald-50 hover:border-emerald-200 transition-all"
                  >
                    <span className="font-medium text-stone-800 group-hover:text-emerald-800 transition-colors">
                      {p.name}
                    </span>
                    <span className="text-xs text-stone-400 tabular-nums group-hover:text-emerald-700">
                      {p.count.toLocaleString("ar-EG")} مقال
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
