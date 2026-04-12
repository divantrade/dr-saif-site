import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import {
  loadTags,
  getTagBySlug,
  getPaginatedPostsByTagId,
  readableSlug,
} from "@/lib/data";

interface TagPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const tags = await loadTags();
  // Only prerender tags that actually have posts in our dataset.
  return tags
    .filter((t) => t.count > 0)
    .map((t) => ({ slug: readableSlug(t.slug) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) return { title: "وسم غير موجود" };
  return {
    title: `#${tag.name}`,
    description: `المقالات المرتبطة بوسم ${tag.name}`,
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;

  const tag = await getTagBySlug(slug);
  if (!tag) notFound();

  const currentPage = Math.max(1, parseInt(pageParam || "1", 10));
  const { posts, totalPages, total } = await getPaginatedPostsByTagId(
    tag.id,
    currentPage,
    12
  );

  const basePath = `/tag/${encodeURIComponent(readableSlug(tag.slug))}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-emerald-600 transition-colors">
          الرئيسية
        </Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-emerald-600 transition-colors">
          المدونة
        </Link>
        <span>/</span>
        <span className="text-gray-700">#{tag.name}</span>
      </nav>

      <header className="mb-8 pb-6 border-b border-gray-100">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 font-medium px-3 py-1 rounded-full mb-3 text-sm">
          وسم
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          #{tag.name}
        </h1>
        <p className="text-gray-500">
          {total > 0
            ? `${total} مقال — صفحة ${currentPage} من ${totalPages}`
            : "لا توجد مقالات بهذا الوسم بعد"}
        </p>
      </header>

      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-gray-400 text-lg">لا توجد مقالات متاحة</p>
        </div>
      )}

      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 flex-wrap" aria-label="التنقل بين الصفحات">
          {currentPage > 1 && (
            <Link
              href={currentPage - 1 === 1 ? basePath : `${basePath}?page=${currentPage - 1}`}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              السابق
            </Link>
          )}
          <span className="px-4 py-2 text-sm font-medium text-gray-700">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={`${basePath}?page=${currentPage + 1}`}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              التالي
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
