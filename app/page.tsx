import Link from "next/link";
import Image from "next/image";
import PostCard from "@/components/PostCard";
import SearchForm from "@/components/SearchForm";
import {
  loadPosts,
  getPostsByCategoryId,
  getArticlesTree,
  categoryHref,
  type CategoryNode,
  type WPPost,
} from "@/lib/data";

const DOCTOR_PORTRAIT =
  "https://www.saifabdelfattah.net/wp-content/uploads/2023/02/dr-site-m.png";

export default async function HomePage() {
  const [allPosts, tree] = await Promise.all([
    loadPosts(),
    getArticlesTree(),
  ]);

  // Featured: sticky posts or the latest one.
  const stickyPosts = allPosts.filter((p) => p.sticky);
  const featured = stickyPosts.length > 0 ? stickyPosts[0] : allPosts[0];

  // Latest posts excluding the featured one.
  const latestPosts = allPosts.filter((p) => p.id !== featured.id).slice(0, 6);

  // Featured sections: pick up to 4 of the main article categories that have posts.
  const featuredSections = tree.filter((n) => n.category.count > 0).slice(0, 4);

  // Load a small sample per section in parallel.
  const sections = await Promise.all(
    featuredSections.map(async (n) => ({
      node: n,
      posts: (await getPostsByCategoryId(n.category.id)).slice(0, 3),
    }))
  );

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-700 via-teal-700 to-emerald-900 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <div className="grid md:grid-cols-5 gap-10 items-center">
            {/* Portrait */}
            <div className="md:col-span-2 order-2 md:order-1">
              <div className="relative w-64 h-64 md:w-full md:h-96 mx-auto md:mx-0">
                <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl" />
                <Image
                  src={DOCTOR_PORTRAIT}
                  alt="أ.د. سيف الدين عبد الفتاح"
                  fill
                  className="object-contain relative"
                  sizes="(max-width: 768px) 256px, 400px"
                  priority
                />
              </div>
            </div>

            {/* Copy */}
            <div className="md:col-span-3 order-1 md:order-2 text-center md:text-right">
              <p className="text-emerald-200 font-medium mb-3 text-sm tracking-wider uppercase">
                الموقع الرسمي
              </p>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5">
                أ.د. سيف الدين عبد الفتاح إسماعيل
              </h1>
              <p className="text-lg md:text-xl text-emerald-100 leading-relaxed mb-8 max-w-2xl mx-auto md:mx-0">
                كتابات ومقالات في الفكر الحضاري الإسلامي والعلوم السياسية — مشروع فكري يسعى لإعادة قراءة الواقع من منظور حضاري مقاوم.
              </p>

              {/* Search in hero */}
              <div className="max-w-lg mx-auto md:mx-0 mb-6">
                <SearchForm placeholder="ابحث في أكثر من ١٠٠٠ مقال…" />
              </div>

              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 bg-white text-emerald-700 font-semibold px-6 py-3 rounded-xl hover:bg-emerald-50 transition-colors shadow-lg"
                >
                  تصفح المقالات
                  <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors border border-white/20"
                >
                  السيرة الذاتية
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10 mb-14">
        <PostCard post={featured} featured />
      </section>

      {/* Latest Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">آخر المقالات</h2>
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

      {/* Category sections */}
      {sections.map(({ node, posts }) =>
        posts.length === 0 ? null : (
          <CategorySection key={node.category.id} node={node} posts={posts} />
        )
      )}

      {/* Call to action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-3xl p-8 md:p-12 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 mb-4">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">مشروع وقف القلم</h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6 leading-relaxed">
            الأعمال الكاملة للدكتور سيف عبد الفتاح، وقفٌ لوجه الله، تُتاح مجاناً للقارئ والباحث.
          </p>
          <Link
            href="/waqf-alqalam"
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm"
          >
            تعرّف على المشروع
            <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}

function CategorySection({
  node,
  posts,
}: {
  node: CategoryNode;
  posts: WPPost[];
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            {node.category.name}
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">{node.category.count} مقال</p>
        </div>
        <Link
          href={categoryHref(node.category.slug)}
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors shrink-0"
        >
          المزيد
          <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
