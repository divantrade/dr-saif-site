import Image from "next/image";
import Link from "next/link";
import SearchForm from "@/components/SearchForm";

const DOCTOR_PORTRAIT =
  "https://www.saifabdelfattah.net/wp-content/uploads/2023/02/dr-site-m.png";

interface HeroStat {
  value: string;
  label: string;
}

export interface HeroProps {
  stats: HeroStat[];
  /** A short aphorism to display under the main copy, rotated server-side each render. */
  epigraph?: string;
}

export default function Hero({ stats, epigraph }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-emerald-950 via-teal-900 to-emerald-900 text-white overflow-hidden">
      {/* Geometric Islamic pattern, subtle and breathing */}
      <div
        className="absolute inset-0 breathe pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.5'%3E%3Cpath d='M40 0l10 20 20 10-20 10-10 20-10-20L10 30l20-10z'/%3E%3Ccircle cx='40' cy='40' r='1.5'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      {/* Gold accent glow */}
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[32rem] h-[32rem] bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top metallic divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Portrait — ordered second on desktop for RTL */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-full lg:h-[28rem] mx-auto">
              {/* Ornamental frame */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/30 via-transparent to-emerald-400/20 blur-2xl" />
              <div className="absolute inset-4 rounded-full border border-amber-400/30" />
              <div className="absolute inset-6 rounded-full border border-white/10" />
              <Image
                src={DOCTOR_PORTRAIT}
                alt="أ.د. سيف الدين عبد الفتاح"
                fill
                className="object-contain relative drop-shadow-2xl"
                sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 480px"
                priority
              />
            </div>
          </div>

          {/* Copy */}
          <div className="lg:col-span-7 order-1 lg:order-2 text-center lg:text-right">
            <div className="inline-flex items-center gap-3 mb-6 text-amber-300">
              <span className="h-px w-10 bg-amber-400/50" />
              <span className="text-xs tracking-[0.4em] uppercase font-semibold">
                الموقع الرسمي
              </span>
              <span className="h-px w-10 bg-amber-400/50" />
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.15] mb-6">
              أ.د. سيف الدين
              <br />
              <span className="text-amber-300">عبد الفتاح إسماعيل</span>
            </h1>

            <p className="text-lg md:text-xl text-emerald-50/90 leading-[2] max-w-2xl mx-auto lg:mx-0 mb-8">
              أستاذ العلوم السياسية بجامعة القاهرة — وصاحب مشروع فكري في
              <span className="text-amber-300 font-semibold"> المنظور الحضاري الإسلامي</span>،
              يقرأ الواقع من منظور منهاجي مقاوم، ويعيد السؤال قبل أن يجترح الجواب.
            </p>

            {/* Epigraph */}
            {epigraph && (
              <figure className="mb-8 max-w-2xl mx-auto lg:mx-0">
                <div className="relative border-r-2 border-amber-400/60 pr-5 lg:pr-6">
                  <blockquote className="font-display italic text-lg md:text-xl text-amber-100/90 leading-[1.9]">
                    ”{epigraph}“
                  </blockquote>
                </div>
              </figure>
            )}

            {/* Search */}
            <div className="max-w-xl mx-auto lg:mx-0 mb-7">
              <SearchForm placeholder="ابحث في أكثر من ١١٠٠ مقال…" />
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-amber-500/20"
              >
                تصفَّح المقالات
                <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-7 py-3.5 rounded-xl transition-colors border border-white/20"
              >
                السيرة الذاتية
              </Link>
              <Link
                href="/civilizational-school"
                className="inline-flex items-center gap-2 text-emerald-100 hover:text-amber-300 font-medium px-4 py-3.5 transition-colors"
              >
                المدرسة الحضارية
                <svg className="w-3.5 h-3.5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        {stats.length > 0 && (
          <div className="mt-14 pt-10 border-t border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className={`text-center md:text-right ${i > 0 ? "md:border-r md:pr-6 md:border-white/10" : ""}`}
                >
                  <div className="font-display text-3xl md:text-4xl font-bold text-amber-300 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-emerald-100/70 tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom metallic divider */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
    </section>
  );
}
