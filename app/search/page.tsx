import type { Metadata } from "next";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import SearchForm from "@/components/SearchForm";
import { searchPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "البحث",
  description: "ابحث في مقالات وكتابات د. سيف الدين عبد الفتاح",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? await searchPosts(query, 60) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-emerald-600 transition-colors">
          الرئيسية
        </Link>
        <span>/</span>
        <span className="text-gray-700">البحث</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">البحث</h1>
        <SearchForm initialValue={query} />
      </header>

      {query ? (
        <section>
          <p className="text-gray-500 mb-6">
            {results.length > 0
              ? `وجدنا ${results.length} نتيجة عن "${query}"`
              : `لم نجد نتائج لـ "${query}"`}
          </p>
          {results.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-400">جرّب كلمات مفتاحية مختلفة</p>
            </div>
          )}
        </section>
      ) : (
        <div className="py-16 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-500 text-lg">أدخل كلمة مفتاحية للبحث في المقالات</p>
        </div>
      )}
    </div>
  );
}
