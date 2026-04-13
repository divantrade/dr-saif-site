import Link from "next/link";
import Hero from "@/components/Hero";
import Quotes from "@/components/Quotes";
import SanityPostCard from "@/components/SanityPostCard";
import AxesShowcase from "@/components/AxesShowcase";
import FeaturedSeries from "@/components/FeaturedSeries";
import ArchiveShortcut from "@/components/ArchiveShortcut";
import {
  getAxes,
  getSeriesList,
  getPostYears,
  getPublishers,
  getHomeFeed,
  getPublishedPostCount,
} from "@/lib/sanity-data";

/**
 * Short epigraphs rotated through the hero with each render (via ISR).
 * Hand-picked to span different facets of the intellectual project.
 */
const HERO_EPIGRAPHS: { text: string; source: string }[] = [
  {
    text:
      "المنظور الحضاري ليس زاوية نظر فرعية، بل هو الإطار الكلّي الذي يُعيد " +
      "ترتيب السؤال قبل أن يجترح الجواب.",
    source: "في المنظور الحضاري الإسلامي",
  },
  {
    text: "إن هذه الأمة تحتاج إلى عقل استراتيجي يجمع بين الإرادة والإدارة.",
    source: "عقل استراتيجي والتغير القادم",
  },
  {
    text: "لا تنهض الأمم بالردّ على خصومها، بل بتجديد وعيها بذاتها.",
    source: "مشاتل التغيير",
  },
];

// Deterministic day-of-year index so the epigraph rotation is stable
// within a given ISR window.
function epigraphOfTheDay(): { text: string; source: string } {
  const utcDay = Math.floor(
    new Date().setUTCHours(0, 0, 0, 0) / (1000 * 60 * 60 * 24)
  );
  return HERO_EPIGRAPHS[utcDay % HERO_EPIGRAPHS.length];
}

const toArabic = (n: number) => n.toLocaleString("ar-EG");

export default async function HomePage() {
  const [axes, series, years, publishers, feed, totalPosts] = await Promise.all(
    [
      getAxes(),
      getSeriesList(),
      getPostYears(),
      getPublishers(),
      getHomeFeed(7), // 1 featured + 6 grid
      getPublishedPostCount(),
    ]
  );

  const [featured, ...latest] = feed;
  const yearRange =
    years.length > 0
      ? `${years[years.length - 1].year}–${years[0].year}`
      : "";

  const heroStats = [
    { value: toArabic(totalPosts), label: "مقالاً منشوراً" },
    { value: "٧", label: "محاور فكرية" },
    { value: toArabic(series.length), label: "سلاسل مقاليّة" },
    { value: yearRange || "+٤٠", label: "سنة من الإنتاج" },
  ];

  const epigraph = epigraphOfTheDay();

  return (
    <>
      <Hero
        stats={heroStats}
        epigraph={epigraph.text}
        epigraphSource={epigraph.source}
      />

      {/* ٠١ · المشروع الفكري — flagship section */}
      <AxesShowcase axes={axes} />

      {/* ٠٢ · المقال المميَّز */}
      {featured && (
        <section className="relative bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-24">
            <div className="flex items-end justify-between gap-6 mb-10">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4 text-emerald-800">
                  <span className="font-display text-sm tabular-nums">٠٢</span>
                  <span className="h-px w-12 bg-emerald-700/30" />
                  <span className="text-[11px] tracking-[0.35em] uppercase">
                    اقرأ اليوم
                  </span>
                </div>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-stone-900 leading-[1.05]">
                  المقال المميَّز
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-950 border-b border-emerald-700/30 hover:border-emerald-700 pb-0.5 transition-colors shrink-0"
              >
                كل المقالات
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
            <SanityPostCard post={featured} featured />

            {/* Latest grid — 6 recent posts directly below the featured */}
            {latest.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-10">
                {latest.map((post) => (
                  <SanityPostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ٠٣ · السلاسل المميَّزة */}
      <FeaturedSeries series={series} axes={axes} />

      {/* ٠٤ · شذرات — من كلامه */}
      <Quotes />

      {/* ٠٥ · الأرشيف */}
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
              تأخذ كتابات الدكتور طريقها إلى الإتاحة المفتوحة للقارئ والباحث،
              في عمل تراكمي يسعى لتوثيق المشروع الفكري ونشره دون حواجز.
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
