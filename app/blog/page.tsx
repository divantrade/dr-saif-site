import Link from "next/link";
import PostCard from "@/components/PostCard";
import { getPaginatedPosts } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المدونة",
  description: "جميع مقالات وكتابات د. سيف الدين عبد الفتاح",
};

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const { posts, totalPages } = await getPaginatedPosts(currentPage, 12);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Page title */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">المدونة</h1>
        <p className="text-gray-500">
          جميع المقالات والكتابات — صفحة {currentPage} من {totalPages}
        </p>
      </div>

      {/* Posts grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2" aria-label="التنقل بين الصفحات">
          {/* Previous */}
          {currentPage > 1 ? (
            <Link
              href={`/blog?page=${currentPage - 1}`}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              السابق
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-50 border border-gray-100 rounded-lg cursor-not-allowed">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              السابق
            </span>
          )}

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={`/blog?page=${page}`}
                className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-colors ${
                  page === currentPage
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-gray-600 bg-white border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {page}
              </Link>
            ))}
          </div>

          {/* Next */}
          {currentPage < totalPages ? (
            <Link
              href={`/blog?page=${currentPage + 1}`}
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
              <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          )}
        </nav>
      )}
    </div>
  );
}
