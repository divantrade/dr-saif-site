import Link from "next/link";
import type { AxisSummary } from "@/lib/types";
import { axisHref } from "@/lib/types";
import { axisColors, axisColorByNumber } from "./AxisBadge";

interface Props {
  axes: AxisSummary[];
}

/**
 * Flagship section on the homepage — introduces the 7-axis thematic
 * framework that organises the site. Card-based, editorial, each axis
 * rendered with its own accent colour. An 8th "enter all axes" tile
 * rounds out the grid to a clean 2×4 on xl screens.
 */
export default function AxesShowcase({ axes }: Props) {
  return (
    <section className="relative bg-white">
      {/* subtle top separator */}
      <div className="h-px bg-gradient-to-l from-transparent via-stone-200 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-24">
        {/* Section header */}
        <div className="max-w-3xl mb-14 md:mb-16">
          <div className="flex items-center gap-3 mb-5 text-emerald-800">
            <span className="font-display text-sm tabular-nums">٠١</span>
            <span className="h-px w-12 bg-emerald-700/30" />
            <span className="text-[11px] tracking-[0.35em] uppercase">
              المشروع الفكري
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 leading-[1.05] mb-5">
            سبعة محاور — قراءة واحدة
          </h2>
          <p className="text-base md:text-lg text-stone-600 leading-[2] max-w-2xl">
            يُعاد توزيع كتابات الدكتور على سبعة محاور تعكس وحدة مشروعه
            الحضاري، بدل التصنيف التقليدي بحسب منصّة النشر. ادخل من البوّابة
            التي تناسب سؤالك.
          </p>
        </div>

        {/* 7 axes + 1 aggregate tile = clean 2×4 on xl */}
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {axes.map((a) => (
            <li key={a._id}>
              <AxisCard axis={a} />
            </li>
          ))}
          <li>
            <AllAxesTile />
          </li>
        </ol>
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
      {/* Coloured edge ribbon */}
      <div
        className={`absolute inset-y-0 right-0 w-1.5 bg-gradient-to-b ${c.gradient}`}
        aria-hidden
      />

      {/* Axis number — dominant editorial figure */}
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

      {/* Name + tagline */}
      <h3 className="font-display font-bold text-xl text-stone-900 leading-snug mb-2 group-hover:text-emerald-800 transition-colors">
        {axis.name}
      </h3>
      {axis.tagline && (
        <p className="text-sm text-stone-600 leading-relaxed mb-5 line-clamp-2">
          {axis.tagline}
        </p>
      )}

      {/* Footer: count + arrow */}
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

function AllAxesTile() {
  return (
    <Link
      href="/axis"
      className="group relative flex flex-col h-full rounded-2xl border border-stone-900/90 bg-stone-900 text-white p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0l15 35 35 15-35 15-15 35-15-35L0 50l35-15z' fill='%23fef3c7'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      <div className="relative flex items-baseline gap-3 mb-4">
        <span className="font-display font-bold text-5xl leading-none tabular-nums text-amber-300">
          ٧
        </span>
        <span className="text-[10px] tracking-[0.35em] uppercase text-amber-200/80">
          محاور
        </span>
      </div>
      <h3 className="relative font-display font-bold text-xl leading-snug mb-2">
        استعراض كل المحاور
      </h3>
      <p className="relative text-sm text-stone-300 leading-relaxed mb-5">
        انتقل إلى الصفحة الكاملة للمشروع الفكري و تعرّف على كل محور.
      </p>

      <div className="relative mt-auto flex items-center justify-between pt-4 border-t border-white/10">
        <span className="text-xs font-semibold text-amber-300">
          المشروع بأكمله
        </span>
        <span className="flex items-center gap-1 text-xs font-medium text-amber-200 translate-x-0 group-hover:-translate-x-1 transition-transform">
          ادخل
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
