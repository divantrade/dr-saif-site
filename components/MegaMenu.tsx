"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import type {
  AxisSummary,
  SeriesSummary,
  YearSummary,
  PublisherSummary,
} from "@/lib/types";
import {
  axisHref,
  seriesHref,
  yearHref,
  categoryHref,
} from "@/lib/types";
import { axisColors, axisColorByNumber } from "./AxisBadge";

interface MegaMenuProps {
  axes: AxisSummary[];
  series: SeriesSummary[];
  years: YearSummary[];
  publishers: PublisherSummary[];
  /**
   * When provided, render only the listed tab triggers (in the order
   * given). Lets the Header place different tabs at different spots in
   * the nav (e.g. "المقالات" before "عن الدكتور" but "الأرشيف" last).
   */
  tabs?: Tab[];
}

type Tab = "articles" | "series" | "archive";

interface TabDef {
  id: Tab;
  label: string;
  href: string;
  matchPrefix: string;
}

const TABS: TabDef[] = [
  { id: "articles", label: "المقالات", href: "/axis", matchPrefix: "/axis" },
  { id: "series", label: "السلاسل", href: "/series", matchPrefix: "/series" },
  { id: "archive", label: "الأرشيف", href: "/archive", matchPrefix: "/archive" },
];

/**
 * Desktop mega menu with three anchored triggers. Each trigger has its own
 * panel positioned just beneath it; moving the cursor between triggers
 * swaps panels without closing the dropdown.
 *
 * - Active trigger: green text + 2px green underline (matches HeaderLink).
 * - Chevron rotates 180° when its panel is open.
 * - Panel closes on Escape or when the cursor leaves the whole menu region.
 */
export default function MegaMenu({
  axes,
  series,
  years,
  publishers,
  tabs,
}: MegaMenuProps) {
  const [openTab, setOpenTab] = useState<Tab | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname() || "/";

  const visibleTabs = tabs
    ? (tabs
        .map((id) => TABS.find((t) => t.id === id))
        .filter(Boolean) as TabDef[])
    : TABS;

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenTab(null), 160);
  };

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenTab(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Sort series by episode count descending for the panel.
  const seriesSorted = [...series].sort((a, b) => b.postCount - a.postCount);

  return (
    <div
      className="flex items-stretch self-stretch"
      onMouseLeave={scheduleClose}
      onMouseEnter={cancelClose}
    >
      {visibleTabs.map((tab) => {
        const isOpen = openTab === tab.id;
        const isActive =
          pathname === tab.matchPrefix ||
          pathname.startsWith(`${tab.matchPrefix}/`);

        return (
          <div key={tab.id} className="relative flex items-stretch">
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={isOpen}
              onMouseEnter={() => {
                cancelClose();
                setOpenTab(tab.id);
              }}
              onFocus={() => setOpenTab(tab.id)}
              onClick={() => setOpenTab(isOpen ? null : tab.id)}
              className={`relative px-3 py-5 text-[0.9rem] font-medium inline-flex items-center gap-1.5 transition-colors ${
                isOpen || isActive
                  ? "text-emerald-700"
                  : "text-gray-700 hover:text-emerald-700"
              }`}
            >
              {tab.label}
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              <span
                aria-hidden
                className={`absolute right-3 left-3 bottom-0 h-[2px] bg-emerald-600 transition-opacity ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              />
            </button>

            {isOpen && (
              <div
                className="absolute top-full right-0 pt-2 z-50"
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
              >
                <div className="bg-white border border-gray-100 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] animate-[panelIn_180ms_ease-out] origin-top overflow-hidden">
                  {tab.id === "articles" && (
                    <ArticlesPanel axes={axes} onNavigate={() => setOpenTab(null)} />
                  )}
                  {tab.id === "series" && (
                    <SeriesPanel
                      series={seriesSorted}
                      onNavigate={() => setOpenTab(null)}
                    />
                  )}
                  {tab.id === "archive" && (
                    <ArchivePanel
                      years={years}
                      publishers={publishers}
                      onNavigate={() => setOpenTab(null)}
                    />
                  )}
                </div>

                <style>{`
                  @keyframes panelIn {
                    from { opacity: 0; transform: translateY(-4px); }
                    to   { opacity: 1; transform: translateY(0); }
                  }
                `}</style>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Panels ─────────────────────────────────────────────────────────────────

function PanelHeader({ label }: { label: string }) {
  return (
    <div className="px-5 pt-4 pb-2">
      <p className="text-[0.78rem] font-semibold text-gray-400 tracking-wide">
        {label}
      </p>
    </div>
  );
}

function PanelFooter({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate: () => void;
}) {
  return (
    <div className="border-t border-gray-100 px-5 py-3 bg-gray-50">
      <Link
        href={href}
        onClick={onNavigate}
        className="inline-flex items-center gap-1 text-[0.8rem] font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {label}
      </Link>
    </div>
  );
}

function ArticlesPanel({
  axes,
  onNavigate,
}: {
  axes: AxisSummary[];
  onNavigate: () => void;
}) {
  return (
    <div className="w-[380px]">
      <PanelHeader label={`المقالات — ٧ محاور`} />
      <ul className="pb-2">
        {axes.map((a) => {
          // Prefer explicit colour, fall back to axis-number default so any
          // Sanity doc missing a colour still renders with the right dot.
          const c = a.color ? axisColors(a.color) : axisColorByNumber(a.axisNumber);
          return (
            <li key={a._id}>
              <Link
                href={axisHref(a.slug)}
                onClick={onNavigate}
                className="group flex items-center gap-3 px-5 py-[0.65rem] transition-colors hover:bg-gray-50"
              >
                <span
                  className={`shrink-0 w-2.5 h-2.5 rounded-full ${c.dot}`}
                  aria-hidden
                />
                <span className="flex-1 text-[0.88rem] text-gray-800 group-hover:text-emerald-800 transition-colors leading-snug">
                  {a.name}
                </span>
                <span className="shrink-0 text-[0.72rem] text-gray-400 tabular-nums">
                  {a.postCount} مقال
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <PanelFooter
        href="/blog"
        label="كل المقالات"
        onNavigate={onNavigate}
      />
    </div>
  );
}

function SeriesPanel({
  series,
  onNavigate,
}: {
  series: SeriesSummary[];
  onNavigate: () => void;
}) {
  return (
    <div className="w-[380px]">
      <PanelHeader label="السلاسل المقالية" />
      <ul className="pb-2">
        {series.map((s) => (
          <li key={s._id}>
            <Link
              href={seriesHref(s.slug)}
              onClick={onNavigate}
              className="group flex items-center gap-3 px-5 py-[0.65rem] transition-colors hover:bg-gray-50"
            >
              <BookIcon />
              <span className="flex-1 text-[0.88rem] text-gray-800 group-hover:text-emerald-800 transition-colors leading-snug">
                {s.name}
                {s.featured && (
                  <span className="ms-2 align-middle text-[9px] font-bold tracking-wider px-1.5 py-px rounded bg-amber-50 text-amber-700 border border-amber-200">
                    ★
                  </span>
                )}
              </span>
              <span className="shrink-0 text-[0.72rem] text-gray-400 tabular-nums">
                {s.postCount} حلقة
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <PanelFooter
        href="/series"
        label="كل السلاسل"
        onNavigate={onNavigate}
      />
    </div>
  );
}

function BookIcon() {
  return (
    <svg
      aria-hidden
      className="shrink-0 w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );
}

function ArchivePanel({
  years,
  publishers,
  onNavigate,
}: {
  years: YearSummary[];
  publishers: PublisherSummary[];
  onNavigate: () => void;
}) {
  return (
    <div className="w-[620px] max-w-[90vw]">
      <div className="grid grid-cols-2">
        {/* Years */}
        <div>
          <PanelHeader label="حسب السنة" />
          <ul className="px-3 pb-2 grid grid-cols-2 gap-x-1 gap-y-0.5">
            {years.map((y) => (
              <li key={y.year}>
                <Link
                  href={yearHref(y.year)}
                  onClick={onNavigate}
                  className="group flex items-baseline justify-between gap-1 px-3 py-2 rounded-md text-[0.82rem] text-gray-700 hover:text-emerald-800 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium tabular-nums">{y.year}</span>
                  <span className="text-[0.72rem] text-gray-400 tabular-nums">
                    {y.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Publishers — separated by a subtle vertical line. In RTL the
            DOM-order second child sits visually on the left; `border-s` uses
            inline-start so the line ends up between the two columns. */}
        <div className="border-s border-gray-100">
          <PanelHeader label="حسب منصّة النشر" />
          <ul className="pb-2">
            {publishers.map((p) => (
              <li key={p.slug}>
                <Link
                  href={categoryHref(p.slug)}
                  onClick={onNavigate}
                  className="group flex items-baseline justify-between gap-2 px-5 py-2 text-[0.82rem] text-gray-700 hover:text-emerald-800 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium truncate">{p.name}</span>
                  <span className="text-[0.72rem] text-gray-400 tabular-nums shrink-0">
                    {p.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <PanelFooter
        href="/archive"
        label="الأرشيف الكامل"
        onNavigate={onNavigate}
      />
    </div>
  );
}
