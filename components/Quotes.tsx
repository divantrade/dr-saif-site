/**
 * Editorial "quote wall" — a single massive hero quote followed by a
 * visually varied arrangement of smaller ones. Dark, cinematic ground
 * so the typography really lands. Each card gets its own typographic
 * treatment and scale so the section reads like a curated gallery
 * rather than a uniform grid.
 */

import Link from "next/link";

interface Quote {
  text: string;
  source: string;
  slug?: string;
  theme: "استراتيجيا" | "منهاج" | "تغيير" | "استبداد" | "تراث" | "استشراف";
}

const QUOTES: Quote[] = [
  {
    text: "المنظور الحضاري ليس زاوية نظر فرعية، بل هو الإطار الكلّي الذي يُعيد ترتيب السؤال قبل أن يجترح الجواب.",
    source: "في المنظور الحضاري الإسلامي: رؤى منهاجية",
    theme: "منهاج",
  },
  {
    text: "إن هذه الأمة تحتاج إلى عقل استراتيجي يجمع بين الإرادة والإدارة، قادر على التفكير والتدبير والتغيير والتأثير.",
    source: "عقل استراتيجي والتغير القادم",
    theme: "استراتيجيا",
  },
  {
    text: "لا تنهض الأمم بالردّ على خصومها، بل بتجديد وعيها بذاتها، وإدراك سنن تدافعها، وبناء كياناتها المقاومة.",
    source: "مشاتل التغيير",
    theme: "تغيير",
  },
  {
    text: "الاستشراف عملية شاقة، تحفّها مخاطر محاكمة الواقع؛ إلا أنّ هذه الضغوط يجب ألّا تمنعنا من دراسة مشكلاته بغية تقويمها.",
    source: "مستقبل الثورات العربية بين معارك الذاكرة والمعنى",
    theme: "استشراف",
  },
  {
    text: "التراث قراءة للواقع لا ثقلاً عليه، والاجتهاد يقظة دائمة تُحيي المعنى في كل زمن.",
    source: "سؤال التراث",
    theme: "تراث",
  },
  {
    text: "الظلم يستنزف طاقات الأمة حتى في شعورها بذاتها؛ وكسر هذا الحاجز أوّل خطوات الاستعادة.",
    source: "الاستبداد",
    theme: "استبداد",
  },
];

const THEME_STYLES: Record<Quote["theme"], string> = {
  استراتيجيا: "text-amber-300",
  منهاج: "text-emerald-300",
  تغيير: "text-rose-300",
  استبداد: "text-orange-300",
  تراث: "text-teal-300",
  استشراف: "text-indigo-300",
};

export default function Quotes() {
  const [hero, ...rest] = QUOTES;

  return (
    <section className="relative bg-stone-950 text-white overflow-hidden">
      {/* Soft radial glow */}
      <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[40rem] h-[40rem] bg-amber-600/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Paper grain */}
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        {/* Editorial header */}
        <div className="flex items-end justify-between mb-14 md:mb-20">
          <div>
            <div className="flex items-center gap-3 mb-4 text-amber-400">
              <span className="font-display text-sm tabular-nums">۰۲</span>
              <span className="h-px w-10 bg-amber-400/40" />
              <span className="text-[11px] tracking-[0.35em] uppercase text-amber-300/80">
                شذرات
              </span>
            </div>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.95]">
              من كلامه
            </h2>
          </div>
          <div className="hidden md:block text-xs tracking-[0.3em] uppercase text-stone-500 text-left max-w-[14rem]">
            اخترناها من أرشيف ۱۱۶۱ مقالاً — تُمثّل مسار مشروعه الفكري
          </div>
        </div>

        {/* The hero quote — takes the full width with massive typography */}
        <HeroQuote quote={hero} />

        {/* Staggered grid of smaller quotes, deliberately non-uniform */}
        <div className="mt-16 md:mt-20 grid grid-cols-12 gap-6 md:gap-8">
          {/* Left tall quote */}
          <div className="col-span-12 md:col-span-7">
            <WallQuote quote={rest[0]} size="lg" align="start" />
          </div>
          {/* Right short quote */}
          <div className="col-span-12 md:col-span-5 md:pt-8">
            <WallQuote quote={rest[1]} size="md" align="start" />
          </div>
          {/* Right tall */}
          <div className="col-span-12 md:col-span-5 md:col-start-8 md:-mt-4">
            <WallQuote quote={rest[2]} size="md" align="start" />
          </div>
          {/* Left short, offset */}
          <div className="col-span-12 md:col-span-6 md:pt-12">
            <WallQuote quote={rest[3]} size="md" align="start" />
          </div>
          {/* Spanning bottom */}
          <div className="col-span-12 md:col-span-11 md:col-start-2">
            <WallQuote quote={rest[4]} size="lg" align="end" />
          </div>
        </div>
      </div>

      {/* Bottom edge gold rule */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
    </section>
  );
}

/** The featured, full-width quote at the top of the section. */
function HeroQuote({ quote }: { quote: Quote }) {
  return (
    <figure className="relative">
      {/* Giant decorative quotation mark */}
      <div className="absolute -top-6 -right-2 md:-right-8 font-display text-amber-500/25 text-[12rem] md:text-[16rem] leading-none select-none pointer-events-none">
        ﴿
      </div>

      <blockquote
        className={`relative font-display font-bold leading-[1.4] text-2xl sm:text-3xl md:text-4xl lg:text-5xl max-w-5xl ${THEME_STYLES[quote.theme]}`}
      >
        {quote.text}
      </blockquote>

      <figcaption className="mt-8 flex items-center gap-4">
        <span className="h-px w-16 bg-amber-400/40" />
        <cite className="not-italic text-sm tracking-[0.2em] uppercase text-stone-400">
          {quote.slug ? (
            <Link
              href={`/blog/${encodeURIComponent(quote.slug)}`}
              className="hover:text-amber-300 transition-colors"
            >
              {quote.source}
            </Link>
          ) : (
            quote.source
          )}
        </cite>
      </figcaption>
    </figure>
  );
}

/** Non-uniform quote card — varies by size and alignment. */
function WallQuote({
  quote,
  size,
  align,
}: {
  quote: Quote;
  size: "md" | "lg";
  align: "start" | "end";
}) {
  const textSize =
    size === "lg"
      ? "text-xl md:text-2xl lg:text-3xl"
      : "text-lg md:text-xl";

  return (
    <figure
      className={`relative ${align === "end" ? "text-left md:pl-10" : "text-right md:pr-10"}`}
    >
      {/* Accent bar */}
      <div
        className={`absolute top-1 bottom-1 w-[2px] ${align === "end" ? "left-0" : "right-0"} ${
          quote.theme === "استراتيجيا"
            ? "bg-amber-400/60"
            : quote.theme === "منهاج"
              ? "bg-emerald-400/60"
              : quote.theme === "تغيير"
                ? "bg-rose-400/60"
                : quote.theme === "استبداد"
                  ? "bg-orange-400/60"
                  : quote.theme === "تراث"
                    ? "bg-teal-400/60"
                    : "bg-indigo-400/60"
        }`}
      />

      <div className="mb-3">
        <span className={`text-[11px] tracking-[0.3em] uppercase ${THEME_STYLES[quote.theme]} opacity-80`}>
          {quote.theme}
        </span>
      </div>

      <blockquote
        className={`font-display ${textSize} leading-[1.7] text-stone-100`}
      >
        {quote.text}
      </blockquote>

      <figcaption className="mt-5 text-xs tracking-[0.2em] uppercase text-stone-500">
        {quote.slug ? (
          <Link
            href={`/blog/${encodeURIComponent(quote.slug)}`}
            className="hover:text-amber-300 transition-colors"
          >
            {quote.source}
          </Link>
        ) : (
          quote.source
        )}
      </figcaption>
    </figure>
  );
}
