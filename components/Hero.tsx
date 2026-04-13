import Image from "next/image";
import SearchForm from "@/components/SearchForm";

const DOCTOR_PORTRAIT =
  "https://www.saifabdelfattah.net/wp-content/uploads/2023/02/dr-site-m.png";

interface HeroStat {
  value: string;
  label: string;
}

export interface HeroProps {
  stats: HeroStat[];
}

/**
 * Editorial hero — quiet and uncluttered. Portrait in a dramatic dark
 * panel on one side; the author's name, role and project statement on
 * the other. A single search field is the only interactive element;
 * the main navigation already lives in the header, so the hero is
 * dedicated to identity, not to CTAs.
 */
export default function Hero({ stats }: HeroProps) {
  return (
    <section className="relative bg-[#faf7f1] text-gray-900 overflow-hidden">
      {/* Very subtle paper grain */}
      <div
        className="absolute inset-0 opacity-[0.5] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.55 0 0 0 0 0.42 0 0 0 0 0.18 0 0 0 0.015 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Typography column */}
          <div className="lg:col-span-7 order-1 flex flex-col justify-center">
            <h1 className="font-display font-bold leading-[0.95] tracking-tight mb-8">
              <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-stone-900">
                سيف الدين
              </span>
              <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-emerald-900 mt-2">
                عبد الفتاح
              </span>
              <span className="block text-xl sm:text-2xl lg:text-2xl text-stone-500 mt-5 font-normal italic">
                أستاذ العلوم السياسية — جامعة القاهرة
              </span>
            </h1>

            <p className="text-base md:text-lg text-stone-700 leading-[2] max-w-xl mb-9">
              مشروع فكري في
              <span className="font-semibold text-emerald-900">
                {" "}
                المنظور الحضاري الإسلامي
              </span>
              {" — "}
              يقرأ الواقع من منظور منهاجي مقاوم، و يُعيد السؤال قبل أن
              يجترح الجواب.
            </p>

            {/* Single search field — the header covers navigation */}
            <div className="max-w-lg">
              <SearchForm placeholder="ابحث في الأرشيف…" />
            </div>
          </div>

          {/* Portrait column */}
          <div className="lg:col-span-5 order-2 relative">
            <div className="relative w-full h-[28rem] sm:h-[32rem] lg:h-full lg:min-h-[36rem] bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-900 overflow-hidden rounded-sm">
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
              <div className="absolute bottom-6 right-6 left-6 flex items-end justify-between text-amber-50/80">
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

      {/* Stats strip — soft green ground, editorial credits style */}
      {stats.length > 0 && (
        <div className="relative border-t border-stone-900/10 bg-[#f4f8f5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center md:items-start text-center md:text-right gap-1 py-3 md:py-0 ${
                    i > 0 ? "md:border-r md:pr-6 md:border-stone-900/10" : ""
                  }`}
                >
                  <div className="font-display text-3xl md:text-4xl text-emerald-900 tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-[11px] tracking-[0.3em] uppercase text-stone-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
