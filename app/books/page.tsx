import type { Metadata } from "next";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import { getPostsByCategoryId, getCategoryById } from "@/lib/data";

// "الكتب" category
const BOOKS_CATEGORY_ID = 41;

export const metadata: Metadata = {
  title: "الكتب",
  description:
    "مؤلفات وإصدارات الدكتور سيف الدين عبد الفتاح في الفكر السياسي والحضاري الإسلامي",
};

export default async function BooksPage() {
  const [posts, category] = await Promise.all([
    getPostsByCategoryId(BOOKS_CATEGORY_ID),
    getCategoryById(BOOKS_CATEGORY_ID),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-emerald-600 transition-colors">
          الرئيسية
        </Link>
        <span>/</span>
        <span className="text-gray-700">الكتب</span>
      </nav>

      <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white rounded-3xl p-8 md:p-12 mb-10 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full translate-x-1/3 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full -translate-x-1/4 translate-y-1/4" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center shrink-0">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">الكتب والمؤلفات</h1>
            <p className="text-slate-200 leading-relaxed">
              {category?.count
                ? `${category.count} كتاب — إصدارات وأعمال علمية في الفكر السياسي والحضاري الإسلامي`
                : "إصدارات وأعمال علمية في الفكر السياسي والحضاري الإسلامي"}
            </p>
          </div>
        </div>
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
          <p className="text-gray-400 text-lg">قريباً — سيتم إضافة الكتب المنشورة</p>
        </div>
      )}
    </div>
  );
}
