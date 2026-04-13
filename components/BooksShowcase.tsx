import Link from "next/link";
import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import type { BookSummary } from "@/lib/types";
import { urlForImage } from "@/sanity/image";
import { axisColors, axisColorByNumber, type AxisColorClasses } from "./AxisBadge";

interface Props {
  books: BookSummary[];
}

/**
 * "المشروع في كتب" — the project's foundational books, rendered as a
 * row of book-shaped tiles. Each tile wears the colour of its parent
 * axis; when a Sanity cover image is present it takes over the tile.
 *
 * A small "دراسات مختارة" row sits beneath the books — three selected
 * studies shown as text links, no covers. Those studies are curated in
 * code; once the editor stands up dedicated `study` records we can
 * swap the list for a Sanity query.
 */
const SELECTED_STUDIES: { title: string; href: string }[] = [
  {
    title: "نحو بناء مقياس للفساد: رؤية من منظور المدرسة الخلدونية",
    href: "/blog/" +
      encodeURIComponent(
        "نحو-بناء-مقياس-للفساد-رؤية-من-منظور-المدرسة-الخلدونية"
      ),
  },
  {
    title: "أركان الرؤية السياسية الإسلامية",
    href: "/blog/" +
      encodeURIComponent("أركان-الرؤية-السياسية-الإسلامية"),
  },
  {
    title: "التربية المدنية: دراسة في المفهوم بين العالمية والخصوصية",
    href: "/blog/" +
      encodeURIComponent(
        "التربية-المدنية-دراسة-في-المفهوم-بين-العالمية-والخصوصية"
      ),
  },
];

export default function BooksShowcase({ books }: Props) {
  if (books.length === 0) return null;

  return (
    <section className="relative bg-white">
      <div className="h-px bg-gradient-to-l from-transparent via-stone-200 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-24">
        {/* Section header */}
        <div className="max-w-3xl mb-14 md:mb-16">
          <div className="flex items-center gap-3 mb-5 text-emerald-800">
            <span className="font-display text-sm tabular-nums">٠١</span>
            <span className="h-px w-12 bg-emerald-700/30" />
            <span className="text-[11px] tracking-[0.35em] uppercase">
              الكتب والمؤلّفات
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 leading-[1.05] mb-5">
            المشروع في كتب
          </h2>
          <p className="text-base md:text-lg text-stone-600 leading-[2] max-w-2xl">
            النظرية والمنهج والرؤية — في مؤلَّفات أكاديمية تؤسِّس للمنظور
            الحضاري الإسلامي وتطبيقاته في العلوم السياسية.
          </p>
        </div>

        {/* Book covers row — scrollable on mobile, grid on desktop */}
        <div
          className="
            -mx-4 sm:-mx-6 px-4 sm:px-6
            flex gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory
            md:mx-0 md:px-0 md:grid md:gap-6
            md:grid-cols-4 lg:grid-cols-7 md:overflow-visible
            pb-4 md:pb-0
            [scrollbar-width:thin]
          "
        >
          {books.slice(0, 7).map((b) => (
            <BookTile key={b._id} book={b} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/books"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-950 border-b border-emerald-700/30 hover:border-emerald-700 pb-0.5 transition-colors"
          >
            كل الكتب والدراسات
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
        </div>

        {/* ─── Selected studies ─────────────────────────────────────── */}
        <div className="mt-16 md:mt-20 pt-10 border-t border-stone-100">
          <div className="flex items-baseline justify-between mb-6">
            <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-stone-500">
              دراسات مختارة
            </h3>
            <Link
              href="/books"
              className="text-xs text-stone-500 hover:text-emerald-700 transition-colors"
            >
              الكل ←
            </Link>
          </div>
          <ul className="grid gap-3 md:grid-cols-3">
            {SELECTED_STUDIES.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="group flex items-start gap-3 p-4 rounded-lg border border-stone-100 bg-stone-50/50 hover:bg-emerald-50/70 hover:border-emerald-200 transition-colors"
                >
                  <span
                    className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500/70 group-hover:bg-emerald-600"
                    aria-hidden
                  />
                  <span className="text-sm text-stone-700 leading-[1.9] group-hover:text-emerald-900 transition-colors">
                    {s.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** One 2:3 book tile — cover image if available, coloured plate otherwise. */
function BookTile({ book }: { book: BookSummary }) {
  const c = book.axisColor
    ? axisColors(book.axisColor)
    : axisColorByNumber(book.axisNumber);

  const coverUrl = book.cover
    ? urlForImage(book.cover as SanityImageSource)
        .width(500)
        .height(750)
        .fit("crop")
        .auto("format")
        .url()
    : null;

  // Individual /books/[slug] pages don't exist yet. Until they do, we
  // prefer the book's external URL (publisher / PDF) if set, and
  // otherwise send the reader to the catalogue page.
  const isExternal = !!book.externalUrl;
  const linkHref = isExternal ? book.externalUrl! : "/books";

  return (
    <Link
      href={linkHref}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex-shrink-0 w-[55%] sm:w-[38%] md:w-auto snap-start block"
    >
      {/* Cover */}
      <div
        className="relative aspect-[2/3] rounded-md overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.12)] group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] group-hover:-translate-y-1 transition-all duration-300 bg-stone-100"
      >
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={book.coverAlt || book.title}
            fill
            sizes="(max-width: 768px) 50vw, 15vw"
            className="object-cover"
          />
        ) : (
          <CoverPlate title={book.title} color={c} />
        )}

        {/* Spine shadow hint */}
        <div
          className="absolute inset-y-0 right-0 w-2 bg-gradient-to-l from-black/20 to-transparent pointer-events-none"
          aria-hidden
        />
      </div>

      {/* Caption */}
      <div className="mt-4 px-1">
        <h3 className="font-display font-bold text-[0.95rem] leading-snug text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-2">
          {book.title}
        </h3>
        <div className="mt-1.5 flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-stone-500">
          {book.year && <span className="tabular-nums">{book.year}</span>}
          {book.year && book.axisName && (
            <span className="opacity-40">·</span>
          )}
          {book.axisName && (
            <span className={`${c.text} truncate`}>{book.axisName}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

/**
 * Replaces a missing cover image. Renders a full-height tile coloured
 * by the book's axis, overlaid with a subtle Islamic-geometric
 * pattern, and sets the book title in white across the tile.
 */
function CoverPlate({
  title,
  color,
}: {
  title: string;
  color: AxisColorClasses;
}) {
  return (
    <div
      className={`relative w-full h-full bg-gradient-to-br ${color.gradient} flex flex-col justify-between p-5 text-white`}
    >
      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.18] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l10 20 20 10-20 10-10 20-10-20L0 30l20-10z' fill='%23ffffff'/%3E%3C/svg%3E\")",
          backgroundSize: "64px 64px",
        }}
        aria-hidden
      />

      {/* Top rule + small kicker */}
      <div className="relative flex items-center gap-2 text-white/80">
        <span className="h-px flex-1 bg-white/40" />
        <span className="text-[9px] tracking-[0.35em] uppercase">كتاب</span>
      </div>

      {/* Title */}
      <h4 className="relative font-display font-bold text-[1.05rem] sm:text-lg leading-[1.35] text-white drop-shadow-sm line-clamp-6">
        {title}
      </h4>

      {/* Bottom monogram */}
      <div className="relative flex items-end justify-between text-white/80">
        <span className="text-[10px] tracking-[0.3em] uppercase">
          س.ع.ف
        </span>
        <span className="h-px w-10 bg-white/40" />
      </div>
    </div>
  );
}
