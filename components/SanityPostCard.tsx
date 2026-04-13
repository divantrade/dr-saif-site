import Link from "next/link";
import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import type { HomePost } from "@/lib/types";
import { postHref, seriesHref, formatDate } from "@/lib/types";
import { urlForImage } from "@/sanity/image";
import {
  axisColors,
  axisColorByNumber,
  type AxisColorClasses,
} from "./AxisBadge";

interface SanityPostCardProps {
  post: HomePost;
  /** Hero-sized card for the featured slot on the homepage. */
  featured?: boolean;
}

/**
 * Post card that reads Sanity-native post data (HomePost) directly.
 * When no featured image is available, the visual well is filled with
 * the post's axis colour + a subtle Islamic-geometric pattern so every
 * card keeps a clear visual identity.
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
      {/* Thumbnail / axis-coloured backdrop */}
      <div
        className={`relative overflow-hidden ${
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
          <AxisBackdrop
            axisColor={axisC}
            axisName={post.axis?.shortName || post.axis?.name || null}
            axisNumber={post.axis?.axisNumber ?? null}
          />
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

/**
 * Replaces the grey "no image" placeholder with a coloured well that
 * carries the axis identity. Background gradient = axis colour; the
 * overlaid Islamic-geometric pattern matches the Waqf al-Qalam CTA
 * section so the whole site shares one visual vocabulary.
 */
function AxisBackdrop({
  axisColor,
  axisName,
  axisNumber,
}: {
  axisColor: AxisColorClasses | null;
  axisName: string | null;
  axisNumber: number | null;
}) {
  const gradient = axisColor?.gradient ?? "from-stone-600 to-stone-800";

  return (
    <div
      className={`relative w-full h-full bg-gradient-to-br ${gradient} overflow-hidden`}
    >
      {/* Islamic-geometric pattern — matches the Waqf CTA motif. */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l10 20 20 10-20 10-10 20-10-20L0 30l20-10z' fill='%23ffffff'/%3E%3C/svg%3E\")",
          backgroundSize: "72px 72px",
        }}
        aria-hidden
      />

      {/* Axis number watermark — big, editorial, corner-placed. */}
      {axisNumber != null && (
        <span
          className="absolute -top-2 -left-2 font-display font-bold text-white/15 leading-none select-none pointer-events-none tabular-nums"
          style={{ fontSize: "10rem" }}
          aria-hidden
        >
          {axisNumber}
        </span>
      )}

      {/* Bottom editorial caption */}
      {axisName && (
        <div className="absolute bottom-4 right-4 left-4 flex items-center gap-2 text-white/80">
          <span className="h-px flex-1 bg-white/30" />
          <span className="text-[10px] tracking-[0.35em] uppercase font-semibold">
            {axisName}
          </span>
        </div>
      )}
    </div>
  );
}
