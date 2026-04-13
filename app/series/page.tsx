import Link from "next/link";
import type { Metadata } from "next";
import { getSeriesList, getAxes } from "@/lib/sanity-data";
import { seriesHref } from "@/lib/types";
import { axisColors } from "@/components/AxisBadge";

export const metadata: Metadata = {
  title: "السلاسل",
  description:
    "السلاسل الفكرية لـ د. سيف الدين عبد الفتاح: قاموس المقاومة، المواطنة من جديد، النقد الذاتي، مفاهيم ملتبسة، أحداث كاشفة، مشاتل التغيير.",
  alternates: { canonical: "/series" },
};

export default async function SeriesIndexPage() {
  const [list, axes] = await Promise.all([getSeriesList(), getAxes()]);
  const axesByNumber = new Map(axes.map((a) => [a.axisNumber, a]));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-12 text-center">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-700 mb-2">
          سلاسل
        </p>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 font-display">
          الكتابات في حلقات
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          أعمدة و سلاسل مرقّمة كتبها د. سيف الدين عبد الفتاح، تتراكم
          أسبوعاً بأسبوع لتبني أطروحات متكاملة.
        </p>
      </header>

      <ol className="grid gap-6 md:grid-cols-2">
        {list.map((s) => {
          const ax = axesByNumber.get(s.axisNumber);
          const c = axisColors(ax?.color ?? null);
          return (
            <li key={s._id}>
              <Link
                href={seriesHref(s.slug)}
                className={`group relative block h-full rounded-2xl border ${c.border} bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg overflow-hidden`}
              >
                <div
                  className={`absolute inset-y-0 right-0 w-1.5 bg-gradient-to-b ${c.gradient}`}
                  aria-hidden
                />
                <div className="flex items-baseline justify-between mb-3">
                  <span className={`text-xs font-bold tracking-widest uppercase ${c.text}`}>
                    سلسلة
                  </span>
                  <span className="text-xs text-gray-500 tabular-nums">
                    {s.postCount} حلقة
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2 leading-snug group-hover:text-emerald-800 transition-colors">
                  {s.name}
                  {s.featured && (
                    <span className="mr-2 align-middle text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      مميّزة
                    </span>
                  )}
                </h2>
                {s.tagline && (
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    {s.tagline}
                  </p>
                )}
                {ax && (
                  <p className={`text-xs ${c.text}`}>
                    في محور: {ax.shortName || ax.name}
                  </p>
                )}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
