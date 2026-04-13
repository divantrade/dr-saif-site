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
          className={`grid ${
            stats.length === 3
              ? "grid-cols-1 md:grid-cols-3"
              : stats.length === 2
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-2 md:grid-cols-4"
          }`}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`flex flex-col items-center md:items-start text-center md:text-right gap-2 py-4 md:py-0 ${
                i > 0 ? "md:border-r md:pr-8 md:border-stone-900/10" : ""
              }`}
            >
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
