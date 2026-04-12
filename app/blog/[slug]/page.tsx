import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  loadPosts,
  getPostBySlug,
  getMediaById,
  getCategoriesByIds,
  getTagsByIds,
  formatDate,
  stripHtml,
} from "@/lib/data";

// Generate all slugs at build time
export async function generateStaticParams() {
  const posts = await loadPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "غير موجود" };

  return {
    title: stripHtml(post.title.rendered),
    description: stripHtml(post.excerpt.rendered).slice(0, 160),
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const media = post.featured_media
    ? await getMediaById(post.featured_media)
    : null;
  const categories = await getCategoriesByIds(post.categories);
  const tags = await getTagsByIds(post.tags);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-emerald-600 transition-colors">
          الرئيسية
        </Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-emerald-600 transition-colors">
          المدونة
        </Link>
        <span>/</span>
        <span className="text-gray-600 truncate max-w-[200px]">
          <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        </span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <span
                key={cat.id}
                className="text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        <h1
          className="text-2xl md:text-4xl font-bold text-gray-900 leading-relaxed mb-4"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        <div className="flex items-center gap-4 text-sm text-gray-400">
          <time dateTime={post.date} className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {formatDate(post.date)}
          </time>
        </div>
      </header>

      {/* Featured image */}
      {media?.source_url && (
        <div className="relative aspect-video rounded-2xl overflow-hidden mb-10 bg-gray-100">
          <Image
            src={media.source_url}
            alt={media.alt_text || stripHtml(post.title.rendered)}
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div
        className="prose prose-lg prose-gray max-w-none
          prose-headings:text-gray-900 prose-headings:font-bold
          prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-xl prose-img:shadow-md
          prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50/50 prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:px-4
          prose-strong:text-gray-800
          leading-loose"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mt-10 pt-8 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">
            الوسوم
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Back to blog */}
      <div className="mt-10 pt-8 border-t border-gray-100">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          العودة للمدونة
        </Link>
      </div>
    </article>
  );
}
