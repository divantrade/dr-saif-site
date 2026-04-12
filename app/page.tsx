import Link from "next/link";
import PostCard from "@/components/PostCard";
import { loadPosts } from "@/lib/data";

export default async function HomePage() {
  const allPosts = await loadPosts();

  // Featured: sticky posts or the latest post
  const stickyPosts = allPosts.filter((p) => p.sticky);
  const featuredPost = stickyPosts.length > 0 ? stickyPosts[0] : allPosts[0];

  // Latest 9 posts (excluding the featured one)
  const latestPosts = allPosts
    .filter((p) => p.id !== featuredPost.id)
    .slice(0, 9);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              د. سيف الدين عبد الفتاح
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 leading-relaxed mb-8">
              كتابات ومقالات في الفكر الحضاري الإسلامي والعلوم السياسية
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-white text-emerald-700 font-semibold px-6 py-3 rounded-xl hover:bg-emerald-50 transition-colors shadow-lg"
            >
              تصفح المقالات
              <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-10 mb-12">
        <PostCard post={featuredPost} featured />
      </section>

      {/* Latest Posts */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">آخر المقالات</h2>
          <Link
            href="/blog"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
          >
            عرض الكل
            <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </>
  );
}
