"use client";

import { useEffect, useRef, useState } from "react";

interface CarouselQuote {
  text: string;
  source: string;
}

/**
 * Eight short-to-medium epigraphs spanning the different axes of the
 * project. They read well one-at-a-time — the carousel cycles through
 * them with varied entrance animations so each rotation feels distinct.
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
    text:
      "الظلم يستنزف طاقات الأمة حتى في شعورها بذاتها؛ و كسر هذا الحاجز " +
      "أوّل خطوات الاستعادة.",
    source: "الاستبداد و فقه المقاومة",
  },
  {
    text: "المقاومة فعلٌ حضاري قبل أن تكون كفاحاً سلاحياً.",
    source: "قاموس المقاومة",
  },
  {
    text:
      "إنّ هذه الأمة تحتاج إلى عقل استراتيجي يجمع بين الإرادة و الإدارة، " +
      "قادر على التفكير و التدبير و التغيير و التأثير.",
    source: "عقل استراتيجي و التغيّر القادم",
  },
  {
    text:
      "التراث قراءة للواقع لا ثقلاً عليه، و الاجتهاد يقظة دائمة تُحيي " +
      "المعنى في كل زمن.",
    source: "سؤال التراث",
  },
  {
    text:
      "المنظور الحضاري ليس زاوية نظر فرعية، بل هو الإطار الكلّي الذي " +
      "يُعيد ترتيب السؤال قبل أن يجترح الجواب.",
    source: "في المنظور الحضاري الإسلامي: رؤى منهاجية",
  },
];

const ROTATE_MS = 7000;

/**
 * Enter animations — the carousel picks the next one on every rotation
 * so successive quotes never feel like the same transition repeating.
 * Each name maps to a CSS keyframe defined inline further down.
 */
const ENTER_ANIMATIONS = [
  "anim-slide-up",
  "anim-slide-from-right",
  "anim-slide-down",
  "anim-fade",
  "anim-slide-from-left",
] as const;

/**
 * Full-height quote band that fills the bottom ~35% of the hero. Each
 * new quote is keyed by its index so React remounts the `<figure>` —
 * this is what triggers the entrance animation every cycle. We step
 * through the five animation variants sequentially rather than picking
 * at random so the sequence is deterministic and every variant gets a
 * turn before any repeats.
 */
export default function HeroQuoteCarousel() {
  const [active, setActive] = useState(0);
  const [animIdx, setAnimIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [entered, setEntered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // One-time entry animation on mount (the whole strip drops in).
  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Auto-advance.
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
      setAnimIdx((i) => (i + 1) % ENTER_ANIMATIONS.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [paused]);

  // Keyboard navigation — RTL-aware (ArrowLeft advances).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setActive((a) => (a + 1) % QUOTES.length);
        setAnimIdx((i) => (i + 1) % ENTER_ANIMATIONS.length);
      } else if (e.key === "ArrowRight") {
        setActive((a) => (a - 1 + QUOTES.length) % QUOTES.length);
        setAnimIdx((i) => (i + 1) % ENTER_ANIMATIONS.length);
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, []);

  const quote = QUOTES[active];
  const animation = ENTER_ANIMATIONS[animIdx];

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
      className="relative w-full flex-1 flex items-stretch bg-gradient-to-l from-stone-950 via-emerald-950 to-stone-900 text-amber-50 overflow-hidden focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-400/50"
      style={{
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(-16px)",
        transition:
          "opacity 900ms ease-out, transform 900ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* Soft radial glow (matches the old "من كلامه" section that this
          strip now replaces on the homepage). */}
      <div className="absolute top-0 right-1/4 w-[32rem] h-[32rem] bg-emerald-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[32rem] h-[32rem] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Geometric watermark */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0l15 35 35 15-35 15-15 35-15-35L0 50l35-15z' fill='%23fef3c7'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      {/* Top + bottom hairline gold rules */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent pointer-events-none" />

      <div className="relative w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-10 md:py-12 flex items-center">
        <div className="grid gap-6 md:gap-10 md:grid-cols-[auto_1fr_auto] items-center w-full">
          {/* Editorial kicker */}
          <div className="hidden md:flex md:flex-col md:items-end gap-2 text-amber-300/80 shrink-0 md:min-w-[6rem]">
            <span
              aria-hidden
              className="font-display text-amber-400/50 text-7xl leading-none select-none pointer-events-none"
            >
              ﴿
            </span>
            <span className="text-[10px] tracking-[0.35em] uppercase font-semibold whitespace-nowrap">
              شذرات
            </span>
          </div>

          {/* Quote well — the figure is keyed by the active index so
              React remounts it each rotation, retriggering the CSS
              enter animation. */}
          <div className="relative min-h-[6rem] md:min-h-[9rem] flex items-center">
            <figure
              key={active}
              className={`w-full ${animation}`}
              style={{
                animationDuration: "900ms",
                animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                animationFillMode: "both",
              }}
            >
              <blockquote className="font-display font-bold text-[1.35rem] sm:text-2xl md:text-3xl lg:text-[2.1rem] xl:text-[2.35rem] text-amber-50 leading-[1.55] mb-4">
                {quote.text}
              </blockquote>
              <figcaption className="flex items-center gap-3 text-amber-300/80">
                <span className="h-px w-10 bg-amber-400/40" />
                <cite className="not-italic text-[11px] sm:text-xs tracking-[0.25em] uppercase">
                  {quote.source}
                </cite>
              </figcaption>
            </figure>
          </div>

          {/* Dots + counter */}
          <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-3 shrink-0">
            <div className="flex items-center gap-2" role="tablist">
              {QUOTES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`الانتقال إلى الاقتباس ${i + 1}`}
                  onClick={() => {
                    setActive(i);
                    setAnimIdx((idx) => (idx + 1) % ENTER_ANIMATIONS.length);
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    i === active
                      ? "w-7 h-1.5 bg-amber-300"
                      : "w-1.5 h-1.5 bg-amber-300/30 hover:bg-amber-300/60"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] tabular-nums tracking-[0.25em] text-amber-400/50 whitespace-nowrap">
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(QUOTES.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* Keyframes — defined inline so the component is self-contained
          and the site can be themed without reaching into globals.css. */}
      <style>{`
        @keyframes heroQuoteSlideUp {
          from { opacity: 0; transform: translate3d(0, 40px, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes heroQuoteSlideDown {
          from { opacity: 0; transform: translate3d(0, -40px, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes heroQuoteSlideFromRight {
          from { opacity: 0; transform: translate3d(60px, 0, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes heroQuoteSlideFromLeft {
          from { opacity: 0; transform: translate3d(-60px, 0, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes heroQuoteFade {
          from { opacity: 0; transform: scale(0.985); }
          to   { opacity: 1; transform: scale(1); }
        }

        .anim-slide-up         { animation-name: heroQuoteSlideUp; }
        .anim-slide-down       { animation-name: heroQuoteSlideDown; }
        .anim-slide-from-right { animation-name: heroQuoteSlideFromRight; }
        .anim-slide-from-left  { animation-name: heroQuoteSlideFromLeft; }
        .anim-fade             { animation-name: heroQuoteFade; }

        @media (prefers-reduced-motion: reduce) {
          .anim-slide-up,
          .anim-slide-down,
          .anim-slide-from-right,
          .anim-slide-from-left,
          .anim-fade {
            animation-name: heroQuoteFade;
            animation-duration: 300ms !important;
          }
        }
      `}</style>
    </div>
  );
}
