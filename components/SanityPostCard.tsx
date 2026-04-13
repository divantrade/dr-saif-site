import Link from "next/link";
import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import type { HomePost } from "@/lib/types";
import { postHref, seriesHref, formatDate } from "@/lib/types";
import { urlForImage } from "@/sanity/image";
import { axisColors, axisColorByNumber } from "./AxisBadge";

interface SanityPostCardProps {
  post: HomePost;
  /** Hero-sized card for the featured slot on the homepage. */
  featured?: boolean;
}

/**
 * Post card that reads Sanity-native post data (HomePost) directly.
 * Replaces the WP-JSON-backed PostCard for the new homepage so images
 * come from Sanity's asset CDN and the axis badge can be drawn inline
 * without a second round-trip.
 */
export default function SanityPostCard({
  post,
  featured = false,
}: SanityPostCardProps) {
  const img = post.featuredImage
    ? urlForImage(post.featuredImage as SanityImageSource)
        .width(featured ? 1200 : 640)
        .height(featured ? 700 : 420)
        .fit("crop")
        .auto("format")
        .url()
    : null;

  const axisC = post.axis
    ? post.axis.color
      ? axisColors(post.axis.color)
      : axisColorByNumber(post.axis.axisNumber)
    : null;

  return (
    <article
      className={`group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        featured ? "md:col-span-2 md:grid md:grid-cols-2" : "flex flex-col"
      }`}
    >
      {/* Thumbnail */}
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-stone-100 to-stone-50 ${
          featured ? "md:h-full h-64" : "h-48"
        }`}
      >
        {img ? (
          <Image
            src={img}
            alt={post.imageAlt || post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={
              featured
                ? "(max-width: 768px) 100vw, 50vw"
                : "(max-width: 768px) 100vw, 33vw"
            }
          />
        ) : (
          <PlaceholderMark />
        )}

        {/* Sticky badge */}
        {post.sticky && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow tracking-wider uppercase">
            مميَّز
          </span>
        )}
      </div>

      {/* Content */}
      <div
        className={`p-5 flex flex-col flex-1 ${
          featured ? "p-6 md:p-10 justify-center" : ""
        }`}
      >
        {/* Axis + series meta row */}
        {(post.axis || post.series) && (
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {post.axis && axisC && (
              <Link
                href={`/axis/${encodeURIComponent(post.axis.slug)}`}
                className={`inline-flex items-center gap-1.5 text-xs font-medium ${axisC.soft} px-2.5 py-0.5 rounded-full hover:underline`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${axisC.dot}`}
                  aria-hidden
                />
                {post.axis.shortName || post.axis.name}
              </Link>
            )}
            {post.series && (
              <Link
                href={seriesHref(post.series.slug)}
                className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-emerald-700 transition-colors"
              >
                <span className="opacity-60">·</span>
                <span className="truncate">
                  {post.series.name}
                  {post.seriesNumber != null && (
                    <span className="mr-1 tabular-nums opacity-60">
                      ({post.seriesNumber})
                    </span>
                  )}
                </span>
              </Link>
            )}
          </div>
        )}

        {/* Title */}
        <h3
          className={`font-display font-bold text-gray-900 leading-snug mb-2 group-hover:text-emerald-800 transition-colors ${
            featured
              ? "text-2xl md:text-3xl line-clamp-3"
              : "text-lg line-clamp-2"
          }`}
        >
          <Link href={postHref(post.slug)} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p
            className={`text-gray-500 leading-relaxed mb-4 ${
              featured
                ? "line-clamp-4 text-base md:text-[1.05rem] leading-[1.8]"
                : "line-clamp-2 text-sm"
            }`}
          >
            {post.excerpt}
          </p>
        )}

        {/* Date */}
        <div className="mt-auto flex items-center gap-2 text-xs text-gray-400">
          <svg
            className="w-3.5 h-3.5"
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
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
        </div>
      </div>
    </article>
  );
}

function PlaceholderMark() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg
        className="w-14 h-14 text-stone-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.4}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    </div>
  );
}
