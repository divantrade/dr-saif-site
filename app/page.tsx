import Link from "next/link";
import Hero from "@/components/Hero";
import Quotes from "@/components/Quotes";
import StatsStrip from "@/components/StatsStrip";
import SanityPostCard from "@/components/SanityPostCard";
import AxesShowcase from "@/components/AxesShowcase";
import BooksShowcase from "@/components/BooksShowcase";
import FeaturedSeries from "@/components/FeaturedSeries";
import ArchiveShortcut from "@/components/ArchiveShortcut";
import {
  getAxes,
  getSeriesList,
  getPostYears,
  getPublishers,
  getLatestPostPerAxis,
  getPublishedPostCount,
  getArchiveCredits,
  getFeaturedBooks,
} from "@/lib/sanity-data";

export default async function HomePage() {
  const [
    axes,
    series,
    years,
    publishers,
    feedByAxis,
    totalPosts,
    credits,
    books,
  ] = await Promise.all([
    getAxes(),
    getSeriesList(),
    getPostYears(),
    getPublishers(),
    getLatestPostPerAxis(),
    getPublishedPostCount(),
    getArchiveCredits(),
    getFeaturedBooks(),
  ]);

  // One recent post per axis — filter out axes without any posts yet.
  const axisPosts = feedByAxis
    .filter((x) => x.post)
    .map((x) => x.post!) // non-null asserted after filter
    .slice(0, 7);

  // Five editorial credits — mirrors the legacy site's stat row but
  // sourced live from Sanity. Latin digits for instantly-legible scale.
  const stats = [
    { value: String(totalPosts), label: "مقالاً منشوراً" },
    { value: String(credits.studies), label: "دراسة" },
    { value: String(credits.books), label: "كتاباً" },
    { value: "7", label: "محاور فكرية" },
    { value: String(series.length), label: "سلاسل مقاليّة" },
  ];

  return (
    <>
      <Hero />

      {/* ─── Stats strip — placed right after the hero so the scale of the
          archive lands before the reader enters the "المشروع في كتب"
          section. */}
      <StatsStrip stats={stats} />

      {/* ٠١ · المشروع في كتب — foundational books of the project */}
      <BooksShowcase books={books} />

      {/* ٠٢ · المشروع الفكري */}
      <AxesShowcase axes={axes} />

      {/* ٠٣ · مختارات — مقال حديث من كل محور */}
      {axisPosts.length > 0 && (
        <section className="relative bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-24">
            <div className="flex items-end justify-between gap-6 mb-10">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4 text-emerald-800">
                  <span className="font-display text-sm tabular-nums">٠٣</span>
                  <span className="h-px w-12 bg-emerald-700/30" />
                  <span className="text-[11px] tracking-[0.35em] uppercase">
                    مختارات
                  </span>
                </div>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-stone-900 leading-[1.05] mb-4">
                  من أحدث ما كُتب
                </h2>
                <p className="text-base md:text-lg text-stone-600 leading-[2]">
                  كتابة حديثة من كلّ محور — بوّابة للدخول إلى المشروع
                  الفكري من الزاوية التي تناسب سؤالك.
                </p>
              </div>
              <Link
                href="/blog"
                className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-950 border-b border-emerald-700/30 hover:border-emerald-700 pb-0.5 transition-colors shrink-0"
              >
                كل الكتابات
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

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {axisPosts.map((post) => (
                <SanityPostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Mobile-only "all articles" link */}
            <div className="mt-10 md:hidden flex justify-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-950 border-b border-emerald-700/30 hover:border-emerald-700 pb-0.5 transition-colors"
              >
                كل الكتابات
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
          </div>
        </section>
      )}

      {/* ٠٤ · السلاسل المقاليّة */}
      <FeaturedSeries series={series} axes={axes} />

      {/* ٠٥ · من كلامه */}
      <Quotes />

      {/* ٠٦ · الأرشيف */}
      <ArchiveShortcut years={years} publishers={publishers} />

      {/* Waqf al-Qalam CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="relative bg-gradient-to-br from-amber-900 via-orange-800 to-amber-900 text-white rounded-3xl p-10 md:p-16 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l10 20 20 10-20 10-10 20-10-20L0 30l20-10z' fill='%23ffffff'/%3E%3C/svg%3E\")",
            }}
          />

          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full text-xs font-semibold mb-5 tracking-wider">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
                />
              </svg>
              مشروع وقف القلم
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-5 leading-tight">
              الأعمال الكاملة — وقفاً لوجه الله
            </h2>
            <p className="text-amber-50/90 text-lg leading-[2] max-w-2xl mb-8">
              تأخذ كتابات الدكتور طريقها إلى الإتاحة المفتوحة للقارئ
              والباحث، في عمل تراكمي يسعى لتوثيق المشروع الفكري و نشره
              دون حواجز.
            </p>
            <Link
              href="/waqf-alqalam"
              className="inline-flex items-center gap-2 bg-white text-amber-900 hover:bg-amber-50 font-bold px-8 py-4 rounded-xl transition-colors shadow-lg"
            >
              تعرّف على المشروع
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
