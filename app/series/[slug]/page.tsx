import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAxes,
  getSeriesBySlug,
  getSeriesList,
  getPostsBySeriesSlug,
} from "@/lib/sanity-data";
import {
  axisHref,
  seriesHref,
  readableSlug,
  formatDate,
  stripHtml,
} from "@/lib/types";
import { axisColors } from "@/components/AxisBadge";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const list = await getSeriesList();
  return list.map((s) => ({ slug: readableSlug(s.slug) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = await getSeriesBySlug(decodeURIComponent(slug));
  if (!s) return { title: "سلسلة غير موجودة" };
  return {
    title: s.name,
    description:
      s.tagline || s.description || `حلقات سلسلة ${s.name} لـ د. سيف الدين عبد الفتاح`,
    alternates: { canonical: seriesHref(s.slug) },
  };
}

export default async function SeriesPage({ params }: PageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  const series = await getSeriesBySlug(slug);
  if (!series) notFound();
  const [posts, allAxes] = await Promise.all([
    getPostsBySeriesSlug(slug),
    getAxes(),
  ]);
  const axis = allAxes.find((a) => a.axisNumber === series.axisNumber);
  const colors = axisColors(axis?.color ?? null);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6 flex-wrap">
        <Link href="/" className="hover:text-emerald-600 transition-colors">
          الرئيسية
        </Link>
        <span>/</span>
        <Link href="/series" className="hover:text-emerald-600 transition-colors">
          السلاسل
        </Link>
        <span>/</span>
        <span className="text-gray-700">{series.name}</span>
      </nav>

      {/* Hero */}
      <header
        className={`rounded-3xl border ${colors.border} ${colors.soft} p-8 md:p-10 mb-10 relative overflow-hidden`}
      >
        <div
          className={`absolute inset-y-0 right-0 w-1.5 bg-gradient-to-b ${colors.gradient}`}
          aria-hidden
        />
        <div className="flex items-baseline gap-3 mb-3 flex-wrap">
          <span className={`text-xs font-bold tracking-widest uppercase ${colors.text}`}>
            سلسلة
          </span>
          {axis && (
            <Link
              href={axisHref(axis.slug)}
              className={`text-xs font-medium ${colors.text} hover:underline`}
            >
              في محور: {axis.shortName || axis.name}
            </Link>
          )}
          <span className="text-xs text-gray-500 tabular-nums">
            · {posts.length} حلقة
          </span>
          {series.featured && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              مميّزة
            </span>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
          {series.name}
        </h1>
        {series.tagline && (
          <p className="text-lg md:text-xl text-gray-700 mb-3 font-display leading-relaxed">
            {series.tagline}
          </p>
        )}
        {series.description && (
          <p className="text-base text-gray-600 leading-relaxed max-w-3xl">
            {series.description}
          </p>
        )}
      </header>

      {/* Episode list — narrative timeline rather than card grid, since
          series episodes are read in order. */}
      {posts.length > 0 ? (
        <ol className={`relative border-r-2 ${colors.border} pr-6 md:pr-10 space-y-6`}>
          {posts.map((post) => {
            const p = post as typeof post & { seriesNumber?: number | null };
            const num = p.seriesNumber ?? null;
            const excerpt = stripHtml(post.excerpt.rendered).slice(0, 220);
            return (
              <li key={post.id} className="relative group">
                {/* Episode number bullet */}
                <span
                  className={`absolute right-[calc(theme(spacing.6)*-1-theme(spacing.5))] md:right-[calc(theme(spacing.10)*-1-theme(spacing.5))] top-1 w-10 h-10 rounded-full ${colors.accent} text-xs font-bold flex items-center justify-center tabular-nums shadow-sm`}
                >
                  {num ?? "—"}
                </span>
                <article className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                  <h2 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                    <Link
                      href={`/blog/${encodeURIComponent(readableSlug(post.slug))}`}
                      className="hover:text-emerald-700 transition-colors"
                    >
                      {stripHtml(post.title.rendered)}
                    </Link>
                  </h2>
                  {excerpt && (
                    <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">
                      {excerpt}
                    </p>
                  )}
                  <time
                    dateTime={post.date}
                    className="text-xs text-gray-400 tabular-nums"
                  >
                    {formatDate(post.date)}
                  </time>
                </article>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="py-16 text-center">
          <p className="text-gray-400 text-lg">لا توجد حلقات منشورة بعد.</p>
        </div>
      )}
    </div>
  );
}
