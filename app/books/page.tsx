import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import { getAllBooks } from "@/lib/sanity-data";
import type { BookSummary } from "@/lib/types";
import { urlForImage } from "@/sanity/image";
import { axisColors, axisColorByNumber } from "@/components/AxisBadge";
import type { AxisColorClasses } from "@/components/AxisBadge";

export const metadata: Metadata = {
  title: "الكتب والمؤلّفات",
  description:
    "مؤلَّفات الأستاذ الدكتور سيف الدين عبد الفتاح في الفكر السياسي والحضاري الإسلامي.",
};

/** Curated studies list, mirrors the selection shown on the homepage. */
const STUDIES: { title: string; href: string; year?: number }[] = [
  {
    title: "نحو بناء مقياس للفساد: رؤية من منظور المدرسة الخلدونية",
    href:
      "/blog/" +
      encodeURIComponent(
        "نحو-بناء-مقياس-للفساد-رؤية-من-منظور-المدرسة-الخلدونية"
      ),
    year: 2008,
  },
  {
    title: "أركان الرؤية السياسية الإسلامية",
    href:
      "/blog/" + encodeURIComponent("أركان-الرؤية-السياسية-الإسلامية"),
    year: 2017,
  },
  {
    title: "التربية المدنية: دراسة في المفهوم بين العالمية والخصوصية",
    href:
      "/blog/" +
      encodeURIComponent(
        "التربية-المدنية-دراسة-في-المفهوم-بين-العالمية-والخصوصية"
      ),
    year: 2007,
  },
  {
    title: "مداخل الفكر السياسي الإسلامي",
    href:
      "/blog/" + encodeURIComponent("مداخل-الفكر-السياسي-الإسلامي"),
    year: 2018,
  },
  {
    title: "منظومة قضايا الفكر السياسي الإسلامي",
    href:
      "/blog/" +
      encodeURIComponent("منظومة-قضايا-الفكر-السياسي-الإسلامي"),
    year: 2018,
  },
];

export default async function BooksPage() {
  const books = await getAllBooks();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-stone-400 mb-8">
        <Link
          href="/"
          className="hover:text-emerald-700 transition-colors"
        >
          الرئيسية
        </Link>
        <span>/</span>
        <span className="text-stone-700">الكتب والمؤلّفات</span>
      </nav>

      {/* Page header */}
      <header className="max-w-3xl mb-14 md:mb-16">
        <div className="flex items-center gap-3 mb-5 text-emerald-800">
          <span className="h-px w-12 bg-emerald-700/30" />
          <span className="text-[11px] tracking-[0.35em] uppercase">
            الكتب والمؤلّفات
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 leading-[1.05] mb-5">
          المشروع في كتب
        </h1>
        <p className="text-base md:text-lg text-stone-600 leading-[2]">
          النظرية والمنهج والرؤية — في مؤلَّفات أكاديمية تؤسِّس للمنظور
          الحضاري الإسلامي وتطبيقاته في العلوم السياسية. ترتَّب الكتب
          بحسب أهميتها الفكرية، لا بحسب تاريخ النشر.
        </p>
      </header>

      {/* Books grid */}
      <ul className="grid gap-8 sm:gap-10 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {books.map((b) => (
          <li key={b._id}>
            <BookCard book={b} />
          </li>
        ))}
      </ul>

      {/* Studies */}
      <section className="mt-20 md:mt-24 pt-12 border-t border-stone-100">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-stone-900">
            دراسات مختارة
          </h2>
          <span className="text-xs tracking-[0.3em] uppercase text-stone-400">
            من أرشيف الأبحاث
          </span>
        </div>
        <p className="text-stone-600 leading-[2] max-w-3xl mb-8">
          دراسات محكَّمة وأوراق علمية تمهّد الطريق إلى الكتب أو تتفرّع منها
          — تستعرض جوانب منهجية ومفاهيمية في المشروع الفكري.
        </p>
        <ul className="grid gap-3 md:grid-cols-2">
          {STUDIES.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="group flex items-start gap-3 p-4 rounded-lg border border-stone-100 bg-stone-50/50 hover:bg-emerald-50/70 hover:border-emerald-200 transition-colors"
              >
                <span
                  className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500/70 group-hover:bg-emerald-600"
                  aria-hidden
                />
                <span className="flex-1 text-sm text-stone-700 leading-[1.9] group-hover:text-emerald-900 transition-colors">
                  {s.title}
                </span>
                {s.year && (
                  <span className="shrink-0 text-[11px] tabular-nums text-stone-400 tracking-wider pt-1">
                    {s.year}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function BookCard({ book }: { book: BookSummary }) {
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

  // Individual /books/[slug] pages aren't built yet. Prefer an
  // external publisher/PDF link when the book has one; otherwise the
  // card is non-interactive (we're already on /books).
  const href = book.externalUrl ?? "#";
  const isExternal = !!book.externalUrl;

  const wrap = (children: React.ReactNode) =>
    href === "#" ? (
      <div className="block">{children}</div>
    ) : (
      <Link
        href={href}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className="block group"
      >
        {children}
      </Link>
    );

  return wrap(
    <>
      <div className="relative aspect-[2/3] rounded-md overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.12)] group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] group-hover:-translate-y-1 transition-all duration-300 bg-stone-100">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={book.coverAlt || book.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          <CoverPlate title={book.title} color={c} />
        )}
        <div
          className="absolute inset-y-0 right-0 w-2 bg-gradient-to-l from-black/20 to-transparent pointer-events-none"
          aria-hidden
        />
      </div>
      <div className="mt-4 px-1">
        <h3 className="font-display font-bold text-[1rem] leading-snug text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-2">
          {book.title}
        </h3>
        {book.subtitle && (
          <p className="mt-1 text-xs text-stone-500 leading-relaxed line-clamp-2">
            {book.subtitle}
          </p>
        )}
        <div className="mt-2 flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-stone-500">
          {book.year && <span className="tabular-nums">{book.year}</span>}
          {book.year && book.axisName && (
            <span className="opacity-40">·</span>
          )}
          {book.axisName && (
            <span className={`${c.text} truncate`}>{book.axisName}</span>
          )}
        </div>
      </div>
    </>
  );
}

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
      <div
        className="absolute inset-0 opacity-[0.18] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l10 20 20 10-20 10-10 20-10-20L0 30l20-10z' fill='%23ffffff'/%3E%3C/svg%3E\")",
          backgroundSize: "64px 64px",
        }}
        aria-hidden
      />
      <div className="relative flex items-center gap-2 text-white/80">
        <span className="h-px flex-1 bg-white/40" />
        <span className="text-[9px] tracking-[0.35em] uppercase">كتاب</span>
      </div>
      <h4 className="relative font-display font-bold text-[1.05rem] sm:text-lg leading-[1.35] text-white drop-shadow-sm line-clamp-6">
        {title}
      </h4>
      <div className="relative flex items-end justify-between text-white/80">
        <span className="text-[10px] tracking-[0.3em] uppercase">س.ع.ف</span>
        <span className="h-px w-10 bg-white/40" />
      </div>
    </div>
  );
}
