import Image from "next/image";
import SearchForm from "@/components/SearchForm";
import HeroQuoteCarousel from "@/components/HeroQuoteCarousel";

const DOCTOR_PORTRAIT =
  "https://www.saifabdelfattah.net/wp-content/uploads/2023/02/dr-site-m.png";

/**
 * Editorial hero sized to the viewport, split roughly 65 / 35 between
 * identity and a dynamic quote strip:
 *
 *   Top 65%     : identity — portrait on one side, name (single line),
 *                 role, project statement and search on the other. The
 *                 name is deliberately set on ONE line so the page
 *                 opens with the author's full name read in one beat.
 *   Bottom 35%  : a larger quote carousel that rotates through the
 *                 doctor's writings with varied entrance animations —
 *                 the page's only moving element above the fold.
 *
 * Stats still live in the `<StatsStrip />` component and remain below
 * the hero on the homepage.
 */
export default function Hero() {
  return (
    <section className="relative bg-[#faf7f1] text-gray-900 overflow-hidden flex flex-col min-h-[100svh]">
      {/* Very subtle paper grain */}
      <div
        className="absolute inset-0 opacity-[0.5] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.55 0 0 0 0 0.42 0 0 0 0 0.18 0 0 0 0.015 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── Top band — identity (≈ 65% of hero height) ───────────── */}
      <div
        className="relative flex-[65] flex items-center"
        style={{ minHeight: "32rem" }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-14">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Text column (in RTL: right side) */}
            <div className="lg:col-span-7 order-1 flex flex-col justify-center">
              <h1 className="font-display font-bold leading-[0.95] tracking-tight mb-6">
                {/* Full name on a single line. Uses `whitespace-nowrap`
                    so browsers never break it across two lines even at
                    the very largest display size. */}
                <span className="block whitespace-nowrap text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] text-stone-900">
                  سيف الدين
                  <span className="text-emerald-900"> عبد الفتاح</span>
                </span>
                <span className="block text-lg sm:text-xl lg:text-2xl text-stone-500 mt-4 font-normal italic">
                  أستاذ العلوم السياسية — جامعة القاهرة
                </span>
              </h1>

              <p className="text-base md:text-lg text-stone-700 leading-[1.95] max-w-xl mb-7">
                مشروع فكري في
                <span className="font-semibold text-emerald-900">
                  {" "}
                  المنظور الحضاري الإسلامي
                </span>
                {" — "}
                يقرأ الواقع من منظور منهاجي مقاوم، و يُعيد السؤال قبل أن
                يجترح الجواب.
              </p>

              <div className="max-w-lg">
                <SearchForm placeholder="ابحث في الأرشيف…" />
              </div>
            </div>

            {/* Portrait column — dark dramatic panel */}
            <div className="lg:col-span-5 order-2 relative">
              <div className="relative w-full h-[22rem] sm:h-[26rem] lg:h-full lg:min-h-[28rem] bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-900 overflow-hidden rounded-sm">
                <div
                  className="absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0l15 35 35 15-35 15-15 35-15-35L0 50l35-15z' fill='%23fef3c7'/%3E%3C/svg%3E\")",
                  }}
                />
                <div className="absolute top-4 right-4 bottom-4 left-4 border border-amber-400/25 pointer-events-none" />
                <Image
                  src={DOCTOR_PORTRAIT}
                  alt="أ.د. سيف الدين عبد الفتاح"
                  fill
                  className="object-contain object-bottom drop-shadow-2xl"
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  priority
                />
                <div className="absolute bottom-5 right-5 left-5 flex items-end justify-between text-amber-50/80">
                  <div className="text-[10px] tracking-[0.35em] uppercase">
                    صورة المؤلّف
                  </div>
                  <div className="font-display text-xl italic text-amber-100/90">
                    س.ع.ف
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom band — rotating quote strip (≈ 35% of hero) ─── */}
      <div
        className="relative flex-[35] flex items-stretch"
        style={{ minHeight: "16rem" }}
      >
        <HeroQuoteCarousel />
      </div>
    </section>
  );
}
