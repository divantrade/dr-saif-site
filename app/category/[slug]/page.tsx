import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import {
  loadCategories,
  getCategoryBySlug,
  getChildCategories,
  getPaginatedPostsByCategoryId,
  readableSlug,
  categoryHref,
} from "@/lib/data";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const cats = await loadCategories();
  return cats.map((c) => ({ slug: readableSlug(c.slug) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return { title: "تصنيف غير موجود" };
  return {
    title: cat.name,
    description: `جميع المقالات في تصنيف ${cat.name}`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const currentPage = Math.max(1, parseInt(pageParam || "1", 10));
  const perPage = 12;
  const { posts, totalPages, total } = await getPaginatedPostsByCategoryId(
    category.id,
    currentPage,
    perPage
  );

  const subCategories = await getChildCategories(category.id);
  const parent = category.parent
    ? (await loadCategories()).find((c) => c.id === category.parent)
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6 flex-wrap">
        <Link href="/" className="hover:text-emerald-600 transition-colors">
          الرئيسية
        </Link>
        <span>/</span>
        {parent && (
          <>
            <Link
              href={categoryHref(parent.slug)}
              className="hover:text-emerald-600 transition-colors"
            >
              {parent.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-700">{category.name}</span>
      </nav>

      {/* Header */}
      <header className="mb-8 pb-6 border-b border-gray-100">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {category.name}
        </h1>
        <p className="text-gray-500">
          {total > 0
            ? `${total} مقال${total > 1 ? "اً" : ""} — صفحة ${currentPage} من ${totalPages}`
            : "لا توجد مقالات في هذا التصنيف بعد"}
        </p>
      </header>

      {/* Sub-categories chips */}
      {subCategories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {subCategories.map((sub) => (
            <Link
              key={sub.id}
              href={categoryHref(sub.slug)}
              className="text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-full transition-colors"
            >
              {sub.name}
              <span className="mr-2 text-xs text-emerald-500">({sub.count})</span>
            </Link>
          ))}
        </div>
      )}

      {/* Posts grid */}
      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-gray-400 text-lg">لا توجد مقالات متاحة حالياً</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={categoryHref(category.slug)}
        />
      )}
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  basePath,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
}) {
  const pageLink = (p: number) => (p === 1 ? basePath : `${basePath}?page=${p}`);
  return (
    <nav
      className="flex items-center justify-center gap-2 flex-wrap"
      aria-label="التنقل بين الصفحات"
    >
      {currentPage > 1 ? (
        <Link
          href={pageLink(currentPage - 1)}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          السابق
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-50 border border-gray-100 rounded-lg cursor-not-allowed">
          السابق
        </span>
      )}

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => {
            // Show first, last, current, and neighbors
            if (p === 1 || p === totalPages) return true;
            if (Math.abs(p - currentPage) <= 1) return true;
            return false;
          })
          .reduce<(number | "…")[]>((acc, p) => {
            const prev = acc[acc.length - 1];
            if (typeof prev === "number" && p - prev > 1) acc.push("…");
            acc.push(p);
            return acc;
          }, [])
          .map((p, i) =>
            p === "…" ? (
              <span key={`ellipsis-${i}`} className="px-2 text-gray-400">
                …
              </span>
            ) : (
              <Link
                key={p}
                href={pageLink(p)}
                className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-colors ${
                  p === currentPage
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-gray-600 bg-white border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {p}
              </Link>
            )
          )}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={pageLink(currentPage + 1)}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          التالي
          <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-50 border border-gray-100 rounded-lg cursor-not-allowed">
          التالي
        </span>
      )}
    </nav>
  );
}
