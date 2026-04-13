import Link from "next/link";
import { getAxes, getPostYears, getSeriesList } from "@/lib/sanity-data";
import { axisHref, seriesHref, yearHref } from "@/lib/types";
import { axisColors, axisColorByNumber } from "./AxisBadge";
import SocialLinks from "./SocialLinks";

const QUICK_LINKS: { href: string; label: string }[] = [
  { href: "/", label: "الرئيسية" },
  { href: "/blog", label: "جميع المقالات" },
  { href: "/books", label: "الكتب والدراسات" },
  { href: "/podcast", label: "بودكاست" },
  { href: "/videos", label: "فيديوهات" },
  { href: "/waqf-alqalam", label: "وقف القلم" },
  { href: "/civilizational-school", label: "المدرسة الحضارية" },
  { href: "/about", label: "عن الدكتور" },
  { href: "/contact", label: "تواصل معنا" },
];

/**
 * 5-column footer on lg+: brand · axes · series · quick links · years.
 * Stacks gracefully on smaller screens (md = 2 cols, base = 1).
 * Every column heading wears a short emerald rule for visual rhythm.
 */
export default async function Footer() {
  const [axes, series, years] = await Promise.all([
    getAxes(),
    getSeriesList(),
    getPostYears(),
  ]);

  const seriesSorted = [...series].sort((a, b) => b.postCount - a.postCount);

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1.4fr_1.4fr_1fr_1.3fr] gap-10 lg:gap-12">
          {/* Col 1 — Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-xl font-display leading-none">
                  س
                </span>
              </div>
              <div className="leading-tight">
                <h2 className="text-[1.05rem] font-bold text-white">
                  أ.د. سيف الدين عبد الفتاح
                </h2>
                <p className="text-[0.72rem] text-gray-500 tracking-wide">
                  كتابات و مقالات
                </p>
              </div>
            </div>
            <p className="text-[0.85rem] text-gray-400 leading-[1.7] mb-6 max-w-md">
              الموقع الرسمي للأستاذ الدكتور سيف الدين عبد الفتاح إسماعيل —
              في الفكر الحضاري الإسلامي و العلوم السياسية.
            </p>
            <SocialLinks
              className="gap-3"
              iconClassName="w-10! h-10! rounded-lg! border-transparent! bg-white/[0.08] hover:bg-white/[0.18]! text-gray-300 hover:text-white hover:scale-110! transition-all"
            />
          </div>

          {/* Col 2 — Articles, grouped by axis */}
          <div>
            <ColumnTitle>المقالات</ColumnTitle>
            <ul className="space-y-[0.35rem]">
              {axes.map((a) => {
                const c = a.color
                  ? axisColors(a.color)
                  : axisColorByNumber(a.axisNumber);
                return (
                  <li key={a._id}>
                    <Link
                      href={axisHref(a.slug)}
                      className="group inline-flex items-center gap-2.5 text-[0.8rem] text-gray-400 hover:text-white leading-[2.2] transition-colors"
                    >
                      <span
                        className={`shrink-0 w-[7px] h-[7px] rounded-full ${c.dot}`}
                        aria-hidden
                      />
                      <span className="truncate">{a.shortName || a.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Col 3 — Series */}
          <div>
            <ColumnTitle>السلاسل المقاليّة</ColumnTitle>
            <ul className="space-y-[0.35rem]">
              {seriesSorted.map((s) => (
                <li key={s._id}>
                  <Link
                    href={seriesHref(s.slug)}
                    className="group inline-flex items-baseline gap-2 text-[0.8rem] text-gray-400 hover:text-white leading-[2.2] transition-colors"
                  >
                    <span className="truncate">{s.name}</span>
                    <span className="text-[0.65rem] text-gray-600 tabular-nums shrink-0">
                      {s.postCount}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Quick links */}
          <div>
            <ColumnTitle>روابط سريعة</ColumnTitle>
            <ul className="space-y-[0.35rem]">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.8rem] text-gray-400 hover:text-white leading-[2.2] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5 — Year archive */}
          <div>
            <ColumnTitle>تصفّح بالسنة</ColumnTitle>
            <ul className="grid grid-cols-2 gap-1.5">
              {years.map((y) => (
                <li key={y.year}>
                  <Link
                    href={yearHref(y.year)}
                    className="group block text-center py-2 px-2 rounded-md bg-white/[0.05] hover:bg-white/[0.12] hover:scale-105 transition-all duration-200"
                  >
                    <div className="text-[0.82rem] font-semibold text-gray-300 group-hover:text-white tabular-nums">
                      {y.year}
                    </div>
                    <div className="text-[0.65rem] text-gray-500 tabular-nums mt-0.5">
                      {y.count}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-white/[0.08] text-center">
          <p className="text-[0.75rem] text-gray-500">
            © {new Date().getFullYear()} أ.د. سيف الدين عبد الفتاح. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="text-[0.85rem] font-semibold text-white mb-3">
        {children}
      </h3>
      <span
        aria-hidden
        className="block w-10 h-[2px] bg-gradient-to-l from-emerald-500 to-emerald-700 rounded-full"
      />
    </div>
  );
}
