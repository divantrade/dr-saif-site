import Link from "next/link";
import { getAxes, getSeriesList, getPostYears } from "@/lib/sanity-data";
import { axisHref, seriesHref, yearHref } from "@/lib/types";
import { axisColors } from "./AxisBadge";
import SocialLinks from "./SocialLinks";

export default async function Footer() {
  const [axes, series, years] = await Promise.all([
    getAxes(),
    getSeriesList(),
    getPostYears(),
  ]);

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand + tagline */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-xl">س</span>
              </div>
              <div>
                <h2 className="text-base font-bold text-white leading-tight">
                  أ.د. سيف الدين عبد الفتاح
                </h2>
                <p className="text-xs text-gray-400">كتابات و مقالات</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              الموقع الرسمي للأستاذ الدكتور سيف الدين عبد الفتاح إسماعيل —
              في الفكر الحضاري الإسلامي و العلوم السياسية.
            </p>
            <SocialLinks iconClassName="border-gray-700 text-gray-400 hover:text-emerald-400 hover:border-emerald-500 hover:bg-gray-800" />
          </div>

          {/* المشروع الفكري — 7 axes */}
          <div className="lg:col-span-5">
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">
                المشروع الفكري
              </h3>
              <Link
                href="/axis"
                className="text-xs text-gray-500 hover:text-emerald-400 transition-colors"
              >
                المحاور السبعة ←
              </Link>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {axes.map((a) => {
                const c = axisColors(a.color);
                return (
                  <li key={a._id}>
                    <Link
                      href={axisHref(a.slug)}
                      className="group flex items-center gap-2 py-1 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      <span
                        className={`shrink-0 w-1.5 h-5 rounded-full bg-gradient-to-b ${c.gradient}`}
                      />
                      <span className="truncate">
                        {a.shortName || a.name}
                      </span>
                      <span className="text-[10px] text-gray-600 tabular-nums shrink-0">
                        {a.postCount}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Featured series */}
            {series.length > 0 && (
              <>
                <div className="flex items-baseline justify-between mt-8 mb-3">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    سلاسل بارزة
                  </h4>
                  <Link
                    href="/series"
                    className="text-xs text-gray-500 hover:text-emerald-400 transition-colors"
                  >
                    كل السلاسل ←
                  </Link>
                </div>
                <ul className="flex flex-wrap gap-1.5">
                  {series
                    .filter((s) => s.featured)
                    .slice(0, 6)
                    .map((s) => (
                      <li key={s._id}>
                        <Link
                          href={seriesHref(s.slug)}
                          className="text-xs px-2.5 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-300 hover:bg-emerald-900/40 hover:border-emerald-700 hover:text-emerald-300 transition-colors"
                        >
                          {s.name}
                          <span className="opacity-50 mr-1.5 tabular-nums">
                            {s.postCount}
                          </span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </>
            )}
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white mb-4">روابط</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  جميع المقالات
                </Link>
              </li>
              <li>
                <Link
                  href="/archive"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  الأرشيف
                </Link>
              </li>
              <li>
                <Link
                  href="/books"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  الكتب
                </Link>
              </li>
              <li>
                <Link
                  href="/podcast"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  بودكاست
                </Link>
              </li>
              <li>
                <Link
                  href="/videos"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  فيديوهاتنا
                </Link>
              </li>
              <li>
                <Link
                  href="/waqf-alqalam"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  وقف القلم
                </Link>
              </li>
              <li>
                <Link
                  href="/civilizational-school"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  المدرسة الحضارية
                </Link>
              </li>
            </ul>
          </div>

          {/* Years archive */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white mb-4">
              حسب السنة
            </h3>
            <ul className="grid grid-cols-3 gap-1.5">
              {years.map((y) => (
                <li key={y.year}>
                  <Link
                    href={yearHref(y.year)}
                    className="block text-center py-1.5 rounded text-xs font-medium text-gray-400 bg-gray-800/60 hover:bg-emerald-900/40 hover:text-emerald-300 tabular-nums transition-colors"
                  >
                    {y.year}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/about"
              className="block mt-6 text-sm text-gray-400 hover:text-emerald-400 transition-colors"
            >
              عن الدكتور
            </Link>
            <Link
              href="/contact"
              className="block mt-2 text-sm text-gray-400 hover:text-emerald-400 transition-colors"
            >
              تواصل معنا
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} أ.د. سيف الدين عبد الفتاح. جميع
            الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
