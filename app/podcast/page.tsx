import type { Metadata } from "next";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import { getPostsByCategoryId, getCategoryById } from "@/lib/data";

// The "بودكاست" root category id from WordPress.
const PODCAST_CATEGORY_ID = 245;

export const metadata: Metadata = {
  title: "بودكاست",
  description:
    "حلقات البودكاست للدكتور سيف الدين عبد الفتاح — نقاشات علمية وثقافية في الفكر الحضاري الإسلامي",
};

export default async function PodcastPage() {
  const [posts, category] = await Promise.all([
    getPostsByCategoryId(PODCAST_CATEGORY_ID),
    getCategoryById(PODCAST_CATEGORY_ID),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-emerald-600 transition-colors">
          الرئيسية
        </Link>
        <span>/</span>
        <span className="text-gray-700">بودكاست</span>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white rounded-3xl p-8 md:p-12 mb-10 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/2" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center shrink-0">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">بودكاست</h1>
            <p className="text-indigo-100 leading-relaxed">
              {category?.count
                ? `${category.count} حلقة صوتية — استمع إلى نقاشات وتحليلات`
                : "استمع إلى نقاشات وتحليلات في الفكر والسياسة"}
            </p>
          </div>
        </div>
      </div>

      {/* Posts */}
      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50 mb-4">
            <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          </div>
          <p className="text-gray-400 text-lg">لا توجد حلقات بودكاست منشورة حالياً</p>
          <p className="text-gray-400 text-sm mt-2">ترقّبوا حلقات جديدة قريباً</p>
        </div>
      )}
    </div>
  );
}
