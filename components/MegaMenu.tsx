"use client";

import Link from "next/link";
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
import { axisColors } from "./AxisBadge";

interface MegaMenuProps {
  axes: AxisSummary[];
  series: SeriesSummary[];
  years: YearSummary[];
  publishers: PublisherSummary[];
}

type Tab = "project" | "series" | "archive";

interface TabDef {
  id: Tab;
  label: string;
  href: string;
}

const TABS: TabDef[] = [
  { id: "project", label: "المشروع الفكري", href: "/axis" },
  { id: "series", label: "السلاسل", href: "/series" },
  { id: "archive", label: "أرشيف", href: "/archive" },
];

/**
 * Three-trigger mega menu (المشروع الفكري / السلاسل / أرشيف).
 * Each trigger opens its own panel; hovering between triggers swaps the
 * panel without closing the dropdown — the panel stays open until the
 * cursor leaves the whole menu region.
 */
export default function MegaMenu({
  axes,
  series,
  years,
  publishers,
}: MegaMenuProps) {
  const [openTab, setOpenTab] = useState<Tab | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  return (
    <div
      className="relative flex items-center"
      onMouseLeave={scheduleClose}
      onMouseEnter={cancelClose}
    >
      {TABS.map((tab) => {
        const isOpen = openTab === tab.id;
        return (
          <div key={tab.id} className="relative">
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
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors inline-flex items-center gap-1 ${
                isOpen
                  ? "text-emerald-700 bg-emerald-50"
                  : "text-gray-700 hover:text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              {tab.label}
              <svg
                className={`w-3.5 h-3.5 transition-transform ${
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
            </button>
          </div>
        );
      })}

      {openTab && (
        <div
          className="absolute top-full right-0 left-0 pt-3 z-50"
          // Anchor the panel to the menu — its right edge meets the rightmost
          // trigger so it appears under the menu, not flush to the viewport.
          style={{ minWidth: "min(100vw - 2rem, 880px)" }}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-[panelIn_180ms_ease-out] origin-top">
            {openTab === "project" && <ProjectPanel axes={axes} />}
            {openTab === "series" && <SeriesPanel series={series} axes={axes} />}
            {openTab === "archive" && (
              <ArchivePanel years={years} publishers={publishers} />
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
}

// ─── Sub-panels ─────────────────────────────────────────────────────────────

function ProjectPanel({ axes }: { axes: AxisSummary[] }) {
  return (
    <div className="p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-700">
          المشروع الفكري — ٧ محاور
        </h3>
        <Link
          href="/axis"
          className="text-xs text-gray-500 hover:text-emerald-700"
        >
          عرض الكل ←
        </Link>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {axes.map((a) => {
          const c = axisColors(a.color);
          return (
            <li key={a._id}>
              <Link
                href={axisHref(a.slug)}
                className={`group flex items-start gap-3 p-3 rounded-xl border ${c.border} ${c.soft} hover:shadow-md transition-all`}
              >
                <span
                  className={`shrink-0 w-9 h-9 rounded-lg ${c.accent} flex items-center justify-center text-xs font-bold tabular-nums`}
                >
                  {a.axisNumber}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-gray-900 text-sm leading-tight group-hover:text-emerald-800 transition-colors">
                    {a.name}
                  </span>
                  {a.tagline && (
                    <span className="block text-xs text-gray-600 leading-snug mt-0.5 line-clamp-1">
                      {a.tagline}
                    </span>
                  )}
                </span>
                <span className="text-xs text-gray-500 tabular-nums shrink-0 self-center">
                  {a.postCount}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SeriesPanel({
  series,
  axes,
}: {
  series: SeriesSummary[];
  axes: AxisSummary[];
}) {
  const axesByNumber = new Map(axes.map((a) => [a.axisNumber, a]));
  return (
    <div className="p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-700">
          السلاسل — أعمدة مرقّمة
        </h3>
        <Link
          href="/series"
          className="text-xs text-gray-500 hover:text-emerald-700"
        >
          عرض الكل ←
        </Link>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {series.map((s) => {
          const ax = axesByNumber.get(s.axisNumber);
          const c = axisColors(ax?.color ?? null);
          return (
            <li key={s._id}>
              <Link
                href={seriesHref(s.slug)}
                className="group flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-gray-50 transition-all"
              >
                <span
                  className={`shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br ${c.gradient} text-white flex items-center justify-center text-xs font-bold tabular-nums`}
                >
                  {s.postCount}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-gray-900 text-sm leading-tight group-hover:text-emerald-800 transition-colors">
                    {s.name}
                    {s.featured && (
                      <span className="mr-1.5 align-middle text-[9px] font-bold uppercase tracking-wider px-1.5 py-px rounded-full bg-amber-100 text-amber-800">
                        ★
                      </span>
                    )}
                  </span>
                  {s.tagline && (
                    <span className="block text-xs text-gray-500 leading-snug mt-0.5 line-clamp-1">
                      {s.tagline}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ArchivePanel({
  years,
  publishers,
}: {
  years: YearSummary[];
  publishers: PublisherSummary[];
}) {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-700">
            حسب السنة
          </h3>
          <Link
            href="/archive"
            className="text-xs text-gray-500 hover:text-emerald-700"
          >
            الأرشيف الكامل ←
          </Link>
        </div>
        <ul className="grid grid-cols-3 gap-2">
          {years.map((y) => (
            <li key={y.year}>
              <Link
                href={yearHref(y.year)}
                className="group flex flex-col items-center justify-center py-2.5 rounded-lg border border-gray-100 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
              >
                <span className="text-sm font-bold text-gray-900 tabular-nums group-hover:text-emerald-800">
                  {y.year}
                </span>
                <span className="text-[10px] text-gray-400 tabular-nums">
                  {y.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-700 mb-3">
          حسب منصّة النشر
        </h3>
        <ul className="space-y-1">
          {publishers.map((p) => (
            <li key={p.slug}>
              <Link
                href={categoryHref(p.slug)}
                className="group flex items-baseline justify-between gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-800 transition-colors">
                  {p.name}
                </span>
                <span className="text-xs text-gray-400 tabular-nums">
                  {p.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
