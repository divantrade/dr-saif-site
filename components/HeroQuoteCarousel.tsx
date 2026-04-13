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
 * Independent dynamic panel that lives in the right-third of the Hero
 * (in RTL: the visual left). Crossfades between four short quotes from
 * the doctor's writings; auto-advances every 6 s and pauses on hover/
 * focus. Keyboard arrows + dot navigation. Honours
 * prefers-reduced-motion (auto-advance disabled).
 */
export default function HeroQuoteCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-advance
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

  // Keyboard navigation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        // In RTL, ArrowLeft = "next" semantically.
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
      className="relative w-full h-[28rem] sm:h-[32rem] lg:h-full lg:min-h-[36rem] bg-gradient-to-br from-amber-950 via-amber-900 to-stone-900 overflow-hidden rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
    >
      {/* Geometric watermark — same motif as the Waqf CTA */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0l15 35 35 15-35 15-15 35-15-35L0 50l35-15z' fill='%23fef3c7'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      {/* Inset gold rule mirroring the portrait panel */}
      <div
        className="absolute top-4 right-4 bottom-4 left-4 border border-amber-400/25 pointer-events-none"
        aria-hidden
      />

      {/* Decorative quotation bracket */}
      <div
        className="absolute top-2 right-4 sm:top-3 sm:right-6 font-display text-amber-400/25 text-[8rem] sm:text-[10rem] leading-none select-none pointer-events-none"
        aria-hidden
      >
        ﴿
      </div>

      {/* Editorial kicker */}
      <div className="absolute top-7 left-7 right-7 flex items-center gap-3 text-amber-300/80 z-10">
        <span className="text-[10px] tracking-[0.4em] uppercase font-semibold">
          شذرات
        </span>
        <span className="h-px flex-1 bg-amber-400/30" />
        <span className="text-[10px] tabular-nums text-amber-400/60">
          {String(active + 1).padStart(2, "0")} / {String(QUOTES.length).padStart(2, "0")}
        </span>
      </div>

      {/* Slides — absolutely positioned, crossfaded */}
      <div className="absolute inset-0 px-7 sm:px-10 pt-24 pb-16 flex items-center">
        <div className="relative w-full">
          {QUOTES.map((q, i) => (
            <figure
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                i === active
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
              aria-hidden={i !== active}
            >
              <blockquote className="font-display font-bold text-xl sm:text-2xl lg:text-2xl xl:text-3xl text-amber-50 leading-[1.6] mb-6">
                {q.text}
              </blockquote>
              <figcaption className="flex items-center gap-3 text-amber-300/70">
                <span className="h-px w-8 bg-amber-400/40" />
                <cite className="not-italic text-xs tracking-[0.25em] uppercase">
                  {q.source}
                </cite>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-7 right-7 left-7 flex items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2">
          {QUOTES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`الانتقال إلى الاقتباس ${i + 1}`}
              aria-current={i === active}
              className={`transition-all duration-300 rounded-full ${
                i === active
                  ? "w-6 h-1.5 bg-amber-300"
                  : "w-1.5 h-1.5 bg-amber-300/30 hover:bg-amber-300/60"
              }`}
            />
          ))}
        </div>
        <span className="text-[9px] tracking-[0.3em] uppercase text-amber-400/40">
          من كلامه
        </span>
      </div>
    </div>
  );
}
