import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import { axisColors } from "@/components/AxisBadge";
import {
  getAxes,
  getAxisBySlug,
  getPaginatedPostsByAxisSlug,
  getSeriesList,
} from "@/lib/sanity-data";
import { axisHref, seriesHref, readableSlug } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const axes = await getAxes();
  return axes.map((a) => ({ slug: readableSlug(a.slug) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const axis = await getAxisBySlug(decodeURIComponent(slug));
  if (!axis) return { title: "محور غير موجود" };
  return {
    title: axis.name,
    description: axis.tagline || axis.description || `مقالات محور ${axis.name}`,
    alternates: { canonical: axisHref(axis.slug) },
  };
}

export default async function AxisPage({ params, searchParams }: PageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || "1", 10));

  const axis = await getAxisBySlug(slug);
  if (!axis) notFound();

  const perPage = 12;
  const [{ posts, totalPages, total }, allSeries] = await Promise.all([
    getPaginatedPostsByAxisSlug(slug, currentPage, perPage),
    getSeriesList(),
  ]);

  // Series anchored to this axis — surfaced as quick-jump chips.
  const axisSeries = allSeries.filter((s) => s.axisNumber === axis.axisNumber);
  const c = axisColors(axis.color);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6 flex-wrap">
        <Link href="/" className="hover:text-emerald-600 transition-colors">
          الرئيسية
        </Link>
        <span>/</span>
        <Link
          href="/axis"
          className="hover:text-emerald-600 transition-colors"
        >
          المشروع الفكري
        </Link>
        <span>/</span>
        <span className="text-gray-700">{axis.name}</span>
      </nav>

      {/* Hero — colour-tinted intro card */}
      <header
        className={`relative overflow-hidden rounded-3xl border ${c.border} ${c.soft} p-8 md:p-10 mb-10`}
      >
        <div
          className={`absolute inset-y-0 right-0 w-1.5 bg-gradient-to-b ${c.gradient}`}
          aria-hidden
        />
        <div className="flex items-baseline gap-3 mb-3">
          <span
            className={`text-xs font-bold tracking-widest uppercase ${c.text}`}
          >
            المحور {axis.axisNumber} من ٧
          </span>
          {total > 0 && (
            <span className="text-xs text-gray-500 tabular-nums">
              · {total} مقال
            </span>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
          {axis.name}
        </h1>
        {axis.tagline && (
          <p className="text-lg md:text-xl text-gray-700 mb-4 font-display leading-relaxed">
            {axis.tagline}
          </p>
        )}
        {axis.description && (
          <p className="text-base text-gray-600 leading-relaxed max-w-3xl">
            {axis.description}
          </p>
        )}

        {/* Series quick-jumps */}
        {axisSeries.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="text-xs text-gray-500 self-center ml-1">
              السلاسل المرتبطة:
            </span>
            {axisSeries.map((s) => (
              <Link
                key={s._id}
                href={seriesHref(s.slug)}
                className={`text-xs font-medium px-3 py-1 rounded-full bg-white/70 ${c.text} ${c.border} border hover:bg-white transition-colors`}
              >
                {s.name}
                <span className="opacity-60 mr-1.5 tabular-nums">
                  ({s.postCount})
                </span>
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Posts */}
      {posts.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={axisHref(axis.slug)}
          />
        </>
      ) : (
        <div className="py-16 text-center">
          <p className="text-gray-400 text-lg">
            لا توجد مقالات في هذا المحور بعد.
          </p>
        </div>
      )}
    </div>
  );
}
