"use client";

import { useEffect, useRef, useState } from "react";

interface CarouselQuote {
  text: string;
  source: string;
}

/**
 * Four short epigraphs spanning different axes of the project. Kept
 * deliberately punchier than the longer pieces in the "من كلامه"
 * section — these are headline-length so they read in one beat.
 */
const QUOTES: CarouselQuote[] = [
  {
    text: "المنظور الحضاري يُعيد ترتيب السؤال قبل أن يجترح الجواب.",
    source: "في المنظور الحضاري الإسلامي",
  },
  {
    text: "لا تنهض الأمم بالردّ على خصومها، بل بتجديد وعيها بذاتها.",
    source: "مشاتل التغيير",
  },
  {
    text: "الظلم يستنزف طاقات الأمة حتى في شعورها بذاتها؛ و كسر هذا الحاجز أوّل خطوات الاستعادة.",
    source: "الاستبداد و فقه المقاومة",
  },
  {
    text: "المقاومة فعلٌ حضاري قبل أن تكون كفاحاً سلاحياً.",
    source: "قاموس المقاومة",
  },
];

const ROTATE_MS = 6000;

/**
 * Full-width horizontal strip that sits beneath the Hero's portrait +
 * identity block. Crossfades between four short quotes, auto-advancing
 * every six seconds. Pauses on hover/focus. Keyboard arrows + dots for
 * manual navigation. Honours prefers-reduced-motion.
 */
export default function HeroQuoteCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const id = setInterval(() => {
      setActive((a) => (a + 1) % QUOTES.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [paused]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        // RTL: ArrowLeft advances.
        setActive((a) => (a + 1) % QUOTES.length);
      } else if (e.key === "ArrowRight") {
        setActive((a) => (a - 1 + QUOTES.length) % QUOTES.length);
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="شذرات من كلام الدكتور"
      aria-live="polite"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative w-full bg-gradient-to-l from-amber-950 via-amber-900 to-stone-900 overflow-hidden focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-400/50"
    >
      {/* Geometric watermark */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0l15 35 35 15-35 15-15 35-15-35L0 50l35-15z' fill='%23fef3c7'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      {/* Hairline top + bottom gold rules */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-8 md:py-10">
        <div className="grid gap-5 md:gap-8 md:grid-cols-[auto_1fr_auto] items-center">
          {/* Editorial kicker — far side (right in RTL) */}
          <div className="flex items-center md:flex-col md:items-end gap-3 md:gap-2 text-amber-300/80 shrink-0 md:min-w-[6rem]">
            <span className="font-display text-amber-400/50 text-5xl leading-none select-none pointer-events-none">
              ﴿
            </span>
            <span className="text-[10px] tracking-[0.35em] uppercase font-semibold whitespace-nowrap">
              شذرات
            </span>
          </div>

          {/* Slide well — crossfaded quote + source */}
          <div className="relative min-h-[5.5rem] md:min-h-[7rem] flex items-center">
            {QUOTES.map((q, i) => (
              <figure
                key={i}
                className={`absolute inset-0 flex flex-col justify-center transition-opacity duration-700 ease-in-out ${
                  i === active
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
                aria-hidden={i !== active}
              >
                <blockquote className="font-display font-bold text-lg sm:text-xl md:text-2xl lg:text-[1.65rem] xl:text-3xl text-amber-50 leading-[1.55] mb-3">
                  {q.text}
                </blockquote>
                <figcaption className="flex items-center gap-3 text-amber-300/70">
                  <span className="h-px w-8 bg-amber-400/40" />
                  <cite className="not-italic text-[11px] tracking-[0.25em] uppercase">
                    {q.source}
                  </cite>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Dots + counter — far side (left in RTL) */}
          <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-3 shrink-0">
            <div className="flex items-center gap-2" role="tablist">
              {QUOTES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`الانتقال إلى الاقتباس ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === active
                      ? "w-7 h-1.5 bg-amber-300"
                      : "w-1.5 h-1.5 bg-amber-300/30 hover:bg-amber-300/60"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] tabular-nums tracking-[0.25em] text-amber-400/50 whitespace-nowrap">
              {String(active + 1).padStart(2, "0")} / {String(QUOTES.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
