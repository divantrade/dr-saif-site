"use client";

import Link from "next/link";
import { useState } from "react";
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
import SearchForm from "./SearchForm";
import SocialLinks from "./SocialLinks";

interface MobileNavProps {
  axes: AxisSummary[];
  series: SeriesSummary[];
  years: YearSummary[];
  publishers: PublisherSummary[];
}

interface NavItem {
  href: string;
  label: string;
}

// Secondary links — sit below the four primary nav items (books,
// articles, about) but above the archive accordion which is pinned
// to the bottom of the menu.
const SECONDARY_LINKS: NavItem[] = [
  { href: "/podcast", label: "بودكاست" },
  { href: "/videos", label: "فيديوهاتنا" },
  { href: "/waqf-alqalam", label: "وقف القلم" },
  { href: "/civilizational-school", label: "المدرسة الحضارية" },
  { href: "/contact", label: "تواصل معنا" },
];

type Section = "articles" | "series" | "archive";

export default function MobileNav({
  axes,
  series,
  years,
  publishers,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<Section>>(new Set());

  const toggle = (s: Section) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });

  const close = () => setOpen(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="القائمة"
        aria-expanded={open}
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <nav className="md:hidden border-t border-gray-100 py-3 max-h-[80vh] overflow-y-auto">
          <div className="px-2 pb-3">
            <SearchForm placeholder="ابحث…" />
          </div>

          <Link
            href="/"
            onClick={close}
            className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
          >
            الرئيسية
          </Link>

          {/* الكتب والدراسات */}
          <Link
            href="/books"
            onClick={close}
            className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
          >
            الكتب والدراسات
          </Link>

          {/* المقالات */}
          <SectionAccordion
            label="المقالات"
            href="/axis"
            count={axes.length}
            isOpen={expanded.has("articles")}
            onToggle={() => toggle("articles")}
          >
            <ul className="space-y-0.5">
              {axes.map((a) => {
                const c = a.color ? axisColors(a.color) : axisColorByNumber(a.axisNumber);
                return (
                  <li key={a._id}>
                    <Link
                      href={axisHref(a.slug)}
                      onClick={close}
                      className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`shrink-0 w-2 h-2 rounded-full ${c.dot}`}
                          aria-hidden
                        />
                        <span className="truncate text-sm text-gray-700">
                          {a.shortName || a.name}
                        </span>
                      </span>
                      <span className="text-xs text-gray-400 tabular-nums shrink-0">
                        {a.postCount}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </SectionAccordion>

          {/* عن الدكتور */}
          <Link
            href="/about"
            onClick={close}
            className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
          >
            عن الدكتور
          </Link>

          {/* السلاسل — كشف إضافي داخل القائمة */}
          <SectionAccordion
            label="السلاسل"
            href="/series"
            count={series.length}
            isOpen={expanded.has("series")}
            onToggle={() => toggle("series")}
          >
            <ul className="space-y-0.5">
              {series.map((s) => (
                <li key={s._id}>
                  <Link
                    href={seriesHref(s.slug)}
                    onClick={close}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm text-gray-700 truncate">
                      {s.name}
                    </span>
                    <span className="text-xs text-gray-400 tabular-nums shrink-0">
                      {s.postCount}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </SectionAccordion>

          {/* Secondary links */}
          <div className="mt-2 border-t border-gray-100 pt-2">
            {SECONDARY_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* الأرشيف — آخر عنصر في القائمة */}
          <div className="mt-2 border-t border-gray-100 pt-2">
            <SectionAccordion
              label="الأرشيف"
              href="/archive"
              isOpen={expanded.has("archive")}
              onToggle={() => toggle("archive")}
            >
              <div className="px-2 pb-2">
                <p className="px-2 pt-1 pb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  حسب السنة
                </p>
                <ul className="grid grid-cols-4 gap-1.5 mb-3">
                  {years.map((y) => (
                    <li key={y.year}>
                      <Link
                        href={yearHref(y.year)}
                        onClick={close}
                        className="block text-center py-1.5 rounded border border-gray-100 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                      >
                        <span className="text-xs font-bold text-gray-700 tabular-nums">
                          {y.year}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <p className="px-2 pt-1 pb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  حسب منصّة النشر
                </p>
                <ul className="space-y-0.5">
                  {publishers.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={categoryHref(p.slug)}
                        onClick={close}
                        className="flex items-baseline justify-between gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-sm text-gray-700 truncate">
                          {p.name}
                        </span>
                        <span className="text-xs text-gray-400 tabular-nums shrink-0">
                          {p.count}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </SectionAccordion>
          </div>

          <div className="mt-3 px-4 flex justify-center">
            <SocialLinks />
          </div>
        </nav>
      )}
    </>
  );
}

// ─── Accordion section ──────────────────────────────────────────────────────

function SectionAccordion({
  label,
  href,
  count,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  href: string;
  count?: number;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-1">
      <div className="flex items-center">
        <Link
          href={href}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-800 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-2"
        >
          <span>{label}</span>
          {count != null && (
            <span className="text-[10px] tabular-nums px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
              {count}
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={onToggle}
          aria-label={isOpen ? "طي" : "توسيع"}
          className="p-2 mx-1 text-gray-400 hover:text-emerald-700"
        >
          <svg
            className={`w-4 h-4 transition-transform ${
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
      {isOpen && (
        <div className="pr-4 border-r-2 border-emerald-100 mr-4 my-1">
          {children}
        </div>
      )}
    </div>
  );
}
