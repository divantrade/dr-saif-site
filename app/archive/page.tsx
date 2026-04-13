import Link from "next/link";
import type { Metadata } from "next";
import { getPostYears, getPublishers } from "@/lib/sanity-data";
import { yearHref, categoryHref } from "@/lib/types";

export const metadata: Metadata = {
  title: "الأرشيف",
  description:
    "أرشيف مقالات د. سيف الدين عبد الفتاح حسب السنة و حسب منصة النشر.",
  alternates: { canonical: "/archive" },
};

export default async function ArchiveIndexPage() {
  const [years, publishers] = await Promise.all([
    getPostYears(),
    getPublishers(),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-10">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-700 mb-2">
          أرشيف
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          استعراض المقالات
        </h1>
        <p className="text-base text-gray-600 max-w-2xl">
          تصفّح أرشيف المقالات حسب السنة، أو حسب المنصّة التي نُشرت فيها أصلاً.
        </p>
      </header>

      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">حسب السنة</h2>
          <span className="text-xs text-gray-400 tabular-nums">
            {years.reduce((s, y) => s + y.count, 0)} مقال إجمالاً
          </span>
        </div>
        <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {years.map((y) => (
            <li key={y.year}>
              <Link
                href={yearHref(y.year)}
                className="block bg-white rounded-xl border border-gray-100 p-4 text-center hover:border-emerald-300 hover:shadow-sm transition-all group"
              >
                <div className="text-xl font-bold text-gray-900 tabular-nums group-hover:text-emerald-700">
                  {y.year}
                </div>
                <div className="text-xs text-gray-500 mt-1 tabular-nums">
                  {y.count} مقال
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-5">
          حسب منصّة النشر
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {publishers.map((p) => (
            <li key={p.slug}>
              <Link
                href={categoryHref(p.slug)}
                className="flex items-baseline justify-between bg-white rounded-xl border border-gray-100 px-5 py-4 hover:border-emerald-300 hover:shadow-sm transition-all group"
              >
                <span className="font-medium text-gray-900 group-hover:text-emerald-700 transition-colors">
                  {p.name}
                </span>
                <span className="text-xs text-gray-500 tabular-nums">
                  {p.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
