import AnimatedCounter from "./AnimatedCounter";

export interface Stat {
  /** Numeric value (rendered with the animated counter). */
  value: string;
  /** Short Arabic label beneath the number. */
  label: string;
}

interface Props {
  stats: Stat[];
}

/**
 * Pick a responsive grid-columns class list appropriate for the number
 * of stats. Kept here so both the author and future editors can change
 * cell count without having to also touch the grid template.
 */
function gridColsFor(n: number): string {
  switch (n) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-1 sm:grid-cols-3";
    case 4:
      return "grid-cols-2 md:grid-cols-4";
    case 5:
      // 5 cells: 2+2+1 on mobile looks lopsided, so stagger 3 / 2 on
      // sm and switch to 5 across on md+.
      return "grid-cols-2 sm:grid-cols-3 md:grid-cols-5";
    default:
      return "grid-cols-2 md:grid-cols-4";
  }
}

/**
 * Quiet horizontal strip of numeric credits — placed between two
 * narrative sections on the homepage (between المحاور and
 * أحدث ما كُتب). Counters count up from zero when the strip scrolls
 * into view; numbers render in Latin digits so the scale reads
 * instantly to any audience.
 */
export default function StatsStrip({ stats }: Props) {
  if (stats.length === 0) return null;

  return (
    <section
      className="relative bg-[#f4f8f5] border-y border-stone-900/5"
      aria-label="إحصاءات المشروع"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div
          className={`grid gap-y-8 ${gridColsFor(stats.length)}`}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="group flex flex-col items-center text-center gap-2 px-4 relative"
            >
              {/* Divider between cells on md+. `first:hidden` via modulo
                  so only the element's leading edge gets a rule. In
                  RTL that's the right side, so we use `border-r`. */}
              {i > 0 && (
                <span
                  aria-hidden
                  className="hidden md:block absolute top-1/2 right-0 -translate-y-1/2 h-10 w-px bg-stone-900/10"
                />
              )}
              <div className="font-display text-4xl md:text-5xl text-emerald-900 tabular-nums leading-none">
                <AnimatedCounter value={stat.value} />
              </div>
              <div className="text-[11px] tracking-[0.3em] uppercase text-stone-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
