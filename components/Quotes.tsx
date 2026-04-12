/**
 * Curated aphorisms from Dr Saif's writings. Hand-picked from the archive
 * to represent the sweep of his intellectual project — civilizational
 * perspective, reform, strategic thought, will and resistance.
 *
 * To add or edit a quote: drop an entry into QUOTES with the source slug
 * so it stays traceable back to the original article.
 */

import Link from "next/link";

interface Quote {
  text: string;
  source: string; // short attribution (article title or theme)
  slug?: string; // link to source article if applicable
}

const QUOTES: Quote[] = [
  {
    text: "إن هذه الأمة تحتاج إلى عقل استراتيجي يجمع بين الإرادة والإدارة، قادر على التفكير والتدبير والتغيير والتأثير.",
    source: "عقل استراتيجي والتغير القادم",
  },
  {
    text: "الاستشراف عملية شاقة، تحفّها مخاطر محاكمة الواقع؛ إلا أنّ هذه الضغوط يجب ألّا تمنعنا من دراسة مشكلاته بغية تقويمها.",
    source: "مستقبل الثورات العربية بين معارك الذاكرة والمعنى",
  },
  {
    text: "المنظور الحضاري ليس زاوية نظر فرعية، بل هو الإطار الكلّي الذي يُعيد ترتيب السؤال قبل أن يجترح الجواب.",
    source: "في المنظور الحضاري الإسلامي: رؤى منهاجية",
  },
  {
    text: "لا تنهض الأمم بالردّ على خصومها، بل بتجديد وعيها بذاتها، وإدراك سنن تدافعها، وبناء كياناتها المقاومة.",
    source: "مشاتل التغيير",
  },
  {
    text: "التراث قراءة للواقع لا ثقلاً عليه، والاجتهاد يقظة دائمة تُحيي المعنى في كل زمن.",
    source: "سؤال التراث",
  },
  {
    text: "الظلم يستنزف طاقات الأمة حتى في شعورها بذاتها؛ وكسر هذا الحاجز أوّل خطوات الاستعادة.",
    source: "الاستبداد",
  },
];

export default function Quotes() {
  return (
    <section className="relative bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-50 overflow-hidden">
      {/* Decorative calligraphy motif */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0l20 40 40 20-40 20-20 40-20-40L0 60l40-20z' fill='%23b45309' fill-opacity='0.3'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-amber-700 text-sm tracking-[0.3em] uppercase font-semibold mb-3">
            شذرات من الفكر
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            من كلام الدكتور
          </h2>
          <div className="flex items-center justify-center gap-3 text-amber-600">
            <span className="h-px w-12 bg-amber-600/30" />
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
            </svg>
            <span className="h-px w-12 bg-amber-600/30" />
          </div>
        </div>

        {/* Quotes grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {QUOTES.map((q, i) => (
            <QuoteCard key={i} quote={q} featured={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function QuoteCard({ quote, featured }: { quote: Quote; featured: boolean }) {
  return (
    <figure
      className={`relative bg-white rounded-2xl border border-stone-200/70 shadow-sm hover:shadow-lg transition-shadow duration-300 p-8 md:p-10 ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      {/* Large decorative opening quotation mark in Arabic style */}
      <div className="absolute top-4 right-6 text-amber-600/20 font-display text-7xl md:text-8xl leading-none select-none pointer-events-none">
        ”
      </div>

      <blockquote
        className={`relative font-display text-gray-800 leading-[2] ${
          featured
            ? "text-xl md:text-2xl lg:text-3xl"
            : "text-lg md:text-xl"
        }`}
      >
        {quote.text}
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3 pt-5 border-t border-stone-100">
        <div className="w-8 h-px bg-amber-600/40 shrink-0" />
        <cite className="not-italic text-sm text-gray-500">
          {quote.slug ? (
            <Link
              href={`/blog/${encodeURIComponent(quote.slug)}`}
              className="hover:text-emerald-700 transition-colors"
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
