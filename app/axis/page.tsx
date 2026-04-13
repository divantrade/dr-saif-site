import Link from "next/link";
import type { Metadata } from "next";
import { getAxes } from "@/lib/sanity-data";
import { axisHref } from "@/lib/types";
import { axisColors } from "@/components/AxisBadge";

export const metadata: Metadata = {
  title: "المشروع الفكري — المحاور السبعة",
  description:
    "المحاور السبعة لمشروع أ.د. سيف الدين عبد الفتاح الفكري: التأسيس الحضاري، التراث، النهوض، الاستبداد، المواطنة، الثورات، المقاومة.",
  alternates: { canonical: "/axis" },
};

export default async function AxisIndexPage() {
  const axes = await getAxes();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-12 text-center">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-700 mb-2">
          المشروع الفكري
        </p>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 font-display">
          سبعة محاور — قراءة واحدة
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          كتابات د. سيف الدين عبد الفتاح موزّعة على سبعة محاور تعكس وحدة
          المشروع الحضاري، من المنهج إلى المقاومة.
        </p>
      </header>

      <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {axes.map((axis) => {
          const c = axisColors(axis.color);
          return (
            <li key={axis._id}>
              <Link
                href={axisHref(axis.slug)}
                className={`group block h-full rounded-2xl border ${c.border} ${c.soft} p-6 transition-all hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className="flex items-baseline justify-between mb-3">
                  <span
                    className={`text-xs font-bold tracking-widest uppercase ${c.text}`}
                  >
                    محور {axis.axisNumber}
                  </span>
                  <span className="text-xs text-gray-500 tabular-nums">
                    {axis.postCount} مقال
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2 leading-snug group-hover:text-emerald-800 transition-colors">
                  {axis.name}
                </h2>
                {axis.tagline && (
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    {axis.tagline}
                  </p>
                )}
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium ${c.text} mt-2 opacity-0 group-hover:opacity-100 transition-opacity`}
                >
                  استعراض المقالات
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
