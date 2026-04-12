"use client";

import Link from "next/link";
import { useState } from "react";
import type { CategoryNode } from "@/lib/types";
import { categoryHref } from "@/lib/types";

interface MegaMenuProps {
  articlesTree: CategoryNode[];
}

/**
 * Desktop "المقالات" dropdown with optional second-level sub-categories on hover.
 * Uses pure CSS hover + a single React state for keyboard/tap a11y toggling.
 */
export default function MegaMenu({ articlesTree }: MegaMenuProps) {
  const [open, setOpen] = useState(false);
  const [activeChild, setActiveChild] = useState<number | null>(null);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        setOpen(false);
        setActiveChild(null);
      }}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors inline-flex items-center gap-1"
      >
        المقالات
        <svg
          className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full right-0 pt-2 z-50">
          <div className="bg-white border border-gray-100 rounded-xl shadow-xl min-w-[240px] py-2 flex">
            {/* Active child's sub-menu opens to the LEFT (RTL-friendly) */}
            {activeChild !== null && (
              <SubMenu
                tree={articlesTree.find((n) => n.category.id === activeChild)?.children ?? []}
              />
            )}

            {/* Main list */}
            <ul className="min-w-[240px]">
              {articlesTree.map((node) => {
                const hasChildren = node.children.length > 0;
                const isActive = activeChild === node.category.id;
                return (
                  <li
                    key={node.category.id}
                    onMouseEnter={() => setActiveChild(hasChildren ? node.category.id : null)}
                  >
                    {hasChildren ? (
                      <button
                        type="button"
                        className={`w-full text-right px-4 py-2.5 text-sm flex items-center justify-between gap-2 transition-colors ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span>{node.category.name}</span>
                        <svg
                          className="w-3.5 h-3.5 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    ) : (
                      <Link
                        href={categoryHref(node.category.slug)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-700 transition-colors"
                      >
                        {node.category.name}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function SubMenu({ tree }: { tree: CategoryNode[] }) {
  if (tree.length === 0) return null;
  return (
    <ul className="min-w-[220px] border-l border-gray-100 pl-0 ml-0">
      {tree.map((node) => (
        <li key={node.category.id}>
          <Link
            href={categoryHref(node.category.slug)}
            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
          >
            {node.category.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
