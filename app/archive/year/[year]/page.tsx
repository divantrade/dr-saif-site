import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SanityPostCard from "@/components/SanityPostCard";
import Pagination from "@/components/Pagination";
import { getPaginatedPostsByYear, getPostYears } from "@/lib/sanity-data";
import { yearHref } from "@/lib/types";

interface PageProps {
  params: Promise<{ year: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const years = await getPostYears();
  return years.map((y) => ({ year: String(y.year) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year } = await params;
  return {
    title: `أرشيف ${year}`,
    description: `جميع مقالات د. سيف الدين عبد الفتاح المنشورة عام ${year}.`,
    alternates: { canonical: yearHref(Number(year)) },
  };
}

export default async function YearArchivePage({
  params,
  searchParams,
}: PageProps) {
  const { year: yearParam } = await params;
  const year = parseInt(yearParam, 10);
  if (!Number.isFinite(year) || year < 2000 || year > 2100) notFound();

  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || "1", 10));
  const perPage = 12;

  const { posts, totalPages, total } = await getPaginatedPostsByYear(
    year,
    currentPage,
    perPage
  );

  if (total === 0 && currentPage === 1) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6 flex-wrap">
        <Link href="/" className="hover:text-emerald-600 transition-colors">
          الرئيسية
        </Link>
        <span>/</span>
        <Link href="/archive" className="hover:text-emerald-600 transition-colors">
          الأرشيف
        </Link>
        <span>/</span>
        <span className="text-gray-700 tabular-nums">{year}</span>
      </nav>

      {/* Header */}
      <header className="mb-10 pb-6 border-b border-gray-100">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-700 mb-1">
          أرشيف السنة
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tabular-nums">
          {year}
        </h1>
        <p className="text-gray-500">
          {total} مقال — صفحة {currentPage} من {totalPages}
        </p>
      </header>

      {posts.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {posts.map((post) => (
              <SanityPostCard key={post._id} post={post} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={yearHref(year)}
          />
        </>
      ) : (
        <div className="py-16 text-center">
          <p className="text-gray-400 text-lg">لا توجد مقالات لهذه السنة.</p>
        </div>
      )}
    </div>
  );
}
