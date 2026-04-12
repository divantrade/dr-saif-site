import Link from "next/link";
import Image from "next/image";
import { WPPost, formatDate, stripHtml, getMediaById, getCategoriesByIds } from "@/lib/data";

interface PostCardProps {
  post: WPPost;
  featured?: boolean;
}

export default async function PostCard({ post, featured = false }: PostCardProps) {
  const media = post.featured_media ? await getMediaById(post.featured_media) : null;
  const categories = await getCategoriesByIds(post.categories);
  const excerpt = stripHtml(post.excerpt.rendered);

  return (
    <article
      className={`group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        featured ? "md:col-span-2 md:grid md:grid-cols-2" : "flex flex-col"
      }`}
    >
      {/* Thumbnail */}
      <div className={`relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 ${
        featured ? "md:h-full h-56" : "h-48"
      }`}>
        {media?.source_url ? (
          <Image
            src={media.source_url}
            alt={media.alt_text || stripHtml(post.title.rendered)}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}

        {/* Sticky badge */}
        {post.sticky && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            مميز
          </span>
        )}
      </div>

      {/* Content */}
      <div className={`p-5 flex flex-col flex-1 ${featured ? "p-6 md:p-8 justify-center" : ""}`}>
        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.slice(0, 2).map((cat) => (
              <span
                key={cat.id}
                className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className={`font-bold text-gray-900 leading-relaxed mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors ${
          featured ? "text-xl md:text-2xl" : "text-lg"
        }`}>
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          </Link>
        </h3>

        {/* Excerpt */}
        <p className={`text-gray-500 leading-relaxed mb-4 ${
          featured ? "line-clamp-4 text-sm md:text-base" : "line-clamp-2 text-sm"
        }`}>
          {excerpt}
        </p>

        {/* Date */}
        <div className="mt-auto flex items-center gap-2 text-xs text-gray-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
      </div>
    </article>
  );
}
