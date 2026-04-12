import Link from "next/link";
import PostCard from "@/components/PostCard";
import Hero from "@/components/Hero";
import ContentVerticals from "@/components/ContentVerticals";
import Quotes from "@/components/Quotes";
import {
  loadPosts,
  getPostsByCategoryId,
  getArticlesTree,
  categoryHref,
  type CategoryNode,
  type WPPost,
} from "@/lib/data";

// Category ids used on this page. These mirror the ids set up in the
// WordPress export and are stable.
const CAT_ARTICLES = 42;
const CAT_BOOKS = 41;
const CAT_STUDIES = 43;
const CAT_PROJECTS = 488; // مشروعات النهوض والتغيير

// A handful of short epigraphs that rotate through the hero with each
// render (or visit, via Next's ISR). Hand-picked to span different facets
// of the intellectual project.
const HERO_EPIGRAPHS = [
  "المنظور الحضاري ليس زاوية نظر فرعية، بل هو الإطار الكلّي الذي يُعيد ترتيب السؤال قبل أن يجترح الجواب.",
  "إن هذه الأمة تحتاج إلى عقل استراتيجي يجمع بين الإرادة والإدارة.",
  "لا تنهض الأمم بالردّ على خصومها، بل بتجديد وعيها بذاتها.",
];

export default async function HomePage() {
  const [allPosts, tree, bookPosts, studyPosts, projectPosts] = await Promise.all([
    loadPosts(),
    getArticlesTree(),
    getPostsByCategoryId(CAT_BOOKS),
    getPostsByCategoryId(CAT_STUDIES),
    getPostsByCategoryId(CAT_PROJECTS),
  ]);

  // Featured: sticky posts or the latest one.
  const stickyPosts = allPosts.filter((p) => p.sticky);
  const featured = stickyPosts.length > 0 ? stickyPosts[0] : allPosts[0];
  const latestPosts = allPosts.filter((p) => p.id !== featured.id).slice(0, 6);

  // Stats for the hero bar. Numbers come from the actual JSON so they
  // stay accurate as the archive grows.
  const heroStats = [
    { value: allPosts.length.toLocaleString("ar-EG"), label: "مقالاً منشوراً" },
    { value: "+٤٠", label: "سنة من الإنتاج" },
    { value: bookPosts.length.toLocaleString("ar-EG"), label: "كتاباً ومؤلَّفاً" },
    { value: studyPosts.length.toLocaleString("ar-EG"), label: "دراسة متعمِّقة" },
  ];

  // Pick one epigraph deterministically per-day so the homepage rotates
  // without requiring client-side JS.
  const epigraph =
    HERO_EPIGRAPHS[
      Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % HERO_EPIGRAPHS.length
    ];

  // Featured sections: pick up to 3 of the main article categories that
  // have posts, for the category spotlights further down.
  const featuredSections = tree.filter((n) => n.category.count > 0).slice(0, 3);
  const sections = await Promise.all(
    featuredSections.map(async (n) => ({
      node: n,
      posts: (await getPostsByCategoryId(n.category.id)).slice(0, 3),
    }))
  );

  return (
    <>
      <Hero stats={heroStats} epigraph={epigraph} />

      {/* Content verticals — distinguish articles, books, studies, projects */}
      <ContentVerticals
        articleCount={allPosts.length}
        bookCount={bookPosts.length}
        studyCount={studyPosts.length}
        projectCount={projectPosts.length}
        podcastCount={8}
        videoCount={12}
      />

      {/* Featured article (sticky or latest) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <div className="flex items-end justify-between mb-7">
          <div>
            <p className="text-emerald-700 text-xs tracking-[0.3em] uppercase font-semibold mb-2">
              المقال المميَّز
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 heading-underline">
              اقرأ اليوم
            </h2>
          </div>
        </div>
        <PostCard post={featured} featured />
      </section>

      {/* Latest articles grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-end justify-between mb-7">
          <div>
            <p className="text-emerald-700 text-xs tracking-[0.3em] uppercase font-semibold mb-2">
              الجديد
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 heading-underline">
              آخر المقالات
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-900 items-center gap-1 transition-colors"
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

      {/* Quotes from the doctor's writings */}
      <Quotes />

      {/* Category spotlights */}
      {sections.map(({ node, posts }) =>
        posts.length === 0 ? null : (
          <CategorySection key={node.category.id} node={node} posts={posts} />
        )
      )}

      {/* Waqf al-Qalam CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="relative bg-gradient-to-br from-amber-900 via-orange-800 to-amber-900 text-white rounded-3xl p-10 md:p-16 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l10 20 20 10-20 10-10 20-10-20L0 30l20-10z' fill='%23ffffff'/%3E%3C/svg%3E\")",
            }}
          />

          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full text-xs font-semibold mb-5 tracking-wider">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
              مشروع وقف القلم
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-5 leading-tight">
              الأعمال الكاملة — وقفاً لوجه الله
            </h2>
            <p className="text-amber-50/90 text-lg leading-[2] max-w-2xl mb-8">
              تأخذ كتابات الدكتور طريقها إلى الإتاحة المفتوحة للقارئ والباحث،
              في عمل تراكمي يسعى لتوثيق المشروع الفكري ونشره دون حواجز.
            </p>
            <Link
              href="/waqf-alqalam"
              className="inline-flex items-center gap-2 bg-white text-amber-900 hover:bg-amber-50 font-bold px-8 py-4 rounded-xl transition-colors shadow-lg"
            >
              تعرّف على المشروع
              <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
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
      <div className="flex items-end justify-between mb-6 pb-5 border-b border-gray-100">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900">
            {node.category.name}
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {node.category.count.toLocaleString("ar-EG")} مقال
          </p>
        </div>
        <Link
          href={categoryHref(node.category.slug)}
          className="text-sm font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition-colors shrink-0"
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
