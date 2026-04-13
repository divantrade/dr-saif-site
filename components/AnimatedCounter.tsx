"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  /** The full, formatted value to display once the count completes
   * (e.g. "١,١٦١" or "٢٠١٤–٢٠٢٦"). If the value isn't purely numeric
   * we render it verbatim without any animation. */
  value: string;
  /** ms — how long the count-up should take. */
  duration?: number;
}

/**
 * Counts from zero to the final value once the element scrolls into
 * view, then freezes. Non-numeric values (e.g. a year range) render
 * as-is — no jitter.
 */
export default function AnimatedCounter({ value, duration = 1400 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  // Parse Arabic / Latin digits out of the value — if there's just one
  // integer (possibly with commas), we can animate up to it.
  const numeric = parseLeadingNumber(value);

  // Initialise the displayed string so that:
  //   - non-numeric values render verbatim immediately, and
  //   - numeric values start at zero ready for the count-up.
  // Doing it inside the useState initialiser avoids any synchronous
  // setState in the effect, which the React purity lint flags.
  const [display, setDisplay] = useState<string>(() =>
    numeric == null ? value : formatArabic(0)
  );

  useEffect(() => {
    if (numeric == null) return;

    const el = ref.current;
    if (!el) return;

    let rafId = 0;
    let startedAt = 0;
    let done = false;

    // Reduced-motion users get the final value with no animation.
    // Defer the setState via rAF so we never call it synchronously
    // inside the effect body (React purity rule).
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      rafId = requestAnimationFrame(() =>
        setDisplay(formatArabic(numeric))
      );
      return () => cancelAnimationFrame(rafId);
    }

    const animate = (ts: number) => {
      if (!startedAt) startedAt = ts;
      const progress = Math.min(1, (ts - startedAt) / duration);
      // ease-out cubic — fast start, gentle finish
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(numeric * eased);
      setDisplay(formatArabic(current));
      if (progress < 1 && !done) rafId = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !done) {
            done = true;
            rafId = requestAnimationFrame(animate);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);

    return () => {
      done = true;
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [numeric, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}

/**
 * If `value` parses as a single integer (ignoring thousands-separator
 * variants), returns that integer. Otherwise returns null so the value
 * is rendered verbatim. Handles ASCII (0-9) and Arabic-Indic (٠-٩) digits.
 */
function parseLeadingNumber(value: string): number | null {
  const cleaned = value
    .replace(/[\u066C,]/g, "") // thousands separators
    .replace(/[\u0660-\u0669]/g, (d) =>
      String(d.charCodeAt(0) - 0x0660)
    );
  // Disallow any non-digit character — that rules out ranges like "٢٠١٤–٢٠٢٦".
  if (!/^\d+$/.test(cleaned)) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

/** Format an integer using Arabic-Indic digits + comma. */
function formatArabic(n: number): string {
  return n.toLocaleString("ar-EG");
}
