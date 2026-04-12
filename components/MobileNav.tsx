"use client";

import Link from "next/link";
import { useState } from "react";
import type { CategoryNode } from "@/lib/types";
import { categoryHref } from "@/lib/types";
import SearchForm from "./SearchForm";
import SocialLinks from "./SocialLinks";

interface MobileNavProps {
  articlesTree: CategoryNode[];
}

interface NavItem {
  href: string;
  label: string;
}

const TOP_LEVEL: NavItem[] = [
  { href: "/", label: "الرئيسية" },
  { href: "/podcast", label: "بودكاست" },
  { href: "/videos", label: "فيديوهاتنا" },
  { href: "/waqf-alqalam", label: "وقف القلم" },
  { href: "/civilizational-school", label: "المدرسة الحضارية" },
  { href: "/about", label: "السيرة الذاتية" },
  { href: "/contact", label: "تواصل معنا" },
];

export default function MobileNav({ articlesTree }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggle = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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

          {/* Articles accordion */}
          <div className="mt-1">
            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">
              المقالات
            </div>
            <ul>
              {articlesTree.map((node) => {
                const hasChildren = node.children.length > 0;
                const isOpen = expanded.has(node.category.id);
                return (
                  <li key={node.category.id}>
                    <div className="flex items-center">
                      <Link
                        href={categoryHref(node.category.slug)}
                        onClick={close}
                        className="flex-1 px-4 py-2.5 text-sm text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        {node.category.name}
                      </Link>
                      {hasChildren && (
                        <button
                          type="button"
                          onClick={() => toggle(node.category.id)}
                          aria-label={isOpen ? "طي" : "توسيع"}
                          className="p-2 mx-1 text-gray-400 hover:text-emerald-700"
                        >
                          <svg
                            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {hasChildren && isOpen && (
                      <ul className="pr-4 border-r-2 border-emerald-100 mr-4 my-1">
                        {node.children.map((child) => (
                          <li key={child.category.id}>
                            <Link
                              href={categoryHref(child.category.slug)}
                              onClick={close}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                              {child.category.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-1 border-t border-gray-100 pt-2">
            {TOP_LEVEL.filter((item) => item.href !== "/").map((item) => (
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

          <div className="mt-3 px-4 flex justify-center">
            <SocialLinks />
          </div>
        </nav>
      )}
    </>
  );
}
