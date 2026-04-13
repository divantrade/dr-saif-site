/**
 * Editorial quote wall. A single hero quote leads the section, followed
 * by a clean 2×2 grid of smaller ones. Each quote carries a coloured
 * edge rule from the axis it belongs to — the same palette used in
 * the header, footer and axis pages — so the reader recognises the
 * thematic family at a glance.
 */

import Link from "next/link";
import { axisColorByNumber, type AxisColorClasses } from "./AxisBadge";

interface Quote {
  text: string;
  source: string;
  slug?: string;
  /** Which axis this quote belongs to — drives the accent colour. */
  axisNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

/**
 * The hero quote sits alone at the top of the section (previously lived
 * inside the hero itself). The four below form a 2×2 grid that feels
 * calm and deliberate rather than scattered.
 */
const HERO_QUOTE: Quote = {
  text:
    "المنظور الحضاري ليس زاوية نظر فرعية، بل هو الإطار الكلّي الذي يُعيد " +
    "ترتيب السؤال قبل أن يجترح الجواب.",
  source: "في المنظور الحضاري الإسلامي: رؤى منهاجية",
  axisNumber: 1, // التأسيس الحضاري
};

const WALL_QUOTES: Quote[] = [
  {
    text:
      "إن هذه الأمة تحتاج إلى عقل استراتيجي يجمع بين الإرادة و الإدارة، " +
      "قادر على التفكير و التدبير و التغيير و التأثير.",
    source: "عقل استراتيجي و التغيّر القادم",
    axisNumber: 3, // النهوض و الإصلاح
  },
  {
    text:
      "لا تنهض الأمم بالردّ على خصومها، بل بتجديد وعيها بذاتها، و إدراك " +
      "سنن تدافعها، و بناء كياناتها المقاوِمة.",
    source: "مشاتل التغيير",
    axisNumber: 3,
  },
  {
    text:
      "التراث قراءة للواقع لا ثقلاً عليه، و الاجتهاد يقظة دائمة تُحيي " +
      "المعنى في كل زمن.",
    source: "سؤال التراث",
    axisNumber: 2,
  },
  {
    text:
      "الظلم يستنزف طاقات الأمة حتى في شعورها بذاتها؛ و كسر هذا الحاجز " +
      "أوّل خطوات الاستعادة.",
    source: "الاستبداد",
    axisNumber: 4,
  },
];

export default function Quotes() {
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
              <span className="font-display text-sm tabular-nums">٠٤</span>
              <span className="h-px w-10 bg-amber-400/40" />
              <span className="text-[11px] tracking-[0.35em] uppercase text-amber-300/80">
                شذرات
              </span>
            </div>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.95]">
              من كلامه
            </h2>
          </div>
          <div className="hidden md:block text-xs tracking-[0.3em] uppercase text-stone-500 text-left max-w-[16rem]">
            مقتطفات من أرشيف الكتابات — تُعبّر عن مداخل المشروع الفكري
          </div>
        </div>

        {/* Hero quote — single, full-width, editorial */}
        <HeroQuote quote={HERO_QUOTE} />

        {/* 2 × 2 orderly grid of smaller quotes */}
        <div className="mt-16 md:mt-20 grid gap-8 md:gap-10 md:grid-cols-2">
          {WALL_QUOTES.map((q, i) => (
            <WallQuote key={i} quote={q} />
          ))}
        </div>
      </div>

      {/* Bottom gold rule */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
    </section>
  );
}

function quoteColor(q: Quote): AxisColorClasses {
  return axisColorByNumber(q.axisNumber);
}

/** Hero quote at the top of the section. */
function HeroQuote({ quote }: { quote: Quote }) {
  const c = quoteColor(quote);
  const glow = accentHex(c);

  return (
    <figure className="relative">
      {/* Giant decorative bracket */}
      <div className="absolute -top-6 -right-2 md:-right-8 font-display text-amber-500/25 text-[12rem] md:text-[16rem] leading-none select-none pointer-events-none">
        ﴿
      </div>

      <blockquote
        className="relative font-display font-bold leading-[1.4] text-2xl sm:text-3xl md:text-4xl lg:text-5xl max-w-5xl"
        style={{ color: glow }}
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

/** One card in the orderly 2×2 grid. */
function WallQuote({ quote }: { quote: Quote }) {
  const c = quoteColor(quote);
  return (
    <figure
      className="relative pr-6 md:pr-8"
      style={{ borderRight: `3px solid ${accentHex(c)}` }}
    >
      <blockquote className="font-display text-lg md:text-xl lg:text-2xl leading-[1.75] text-stone-100">
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

/**
 * Pull a hex colour from the axis palette for the inline `style` prop
 * (needed because the accent edge on the dark ground looks best in the
 * axis's brand colour at full saturation, not a Tailwind `text-*-300`).
 */
function accentHex(c: AxisColorClasses): string {
  // Map back from Tailwind class → hex. If the palette changes, edit here.
  const map: Record<string, string> = {
    "bg-emerald-600": "#059669",
    "bg-sky-600": "#0284c7",
    "bg-violet-600": "#7c3aed",
    "bg-red-600": "#dc2626",
    "bg-amber-600": "#d97706",
    "bg-orange-600": "#ea580c",
    "bg-lime-600": "#65a30d",
    "bg-indigo-600": "#4f46e5",
    "bg-rose-600": "#e11d48",
    "bg-teal-600": "#0d9488",
  };
  return map[c.dot] ?? "#d97706"; // amber-600 default
}

