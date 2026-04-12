"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import type { CategoryNode } from "@/lib/types";
import { categoryHref } from "@/lib/types";

interface MegaMenuProps {
  articlesTree: CategoryNode[];
}

/**
 * Two-column mega menu:
 * - Right column: the six main "articles" categories.
 * - Left column (appears on hover over an item with children): sub-categories
 *   of the currently focused parent, with a header showing the parent name
 *   and a "View all" link.
 *
 * In RTL, "right column" is visually the starting column — which matches how
 * the user reads. We also use a small hover-close delay so the pointer can
 * travel between main item and sub-column without the menu flickering shut.
 */
export default function MegaMenu({ articlesTree }: MegaMenuProps) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setActiveId(null);
    }, 150);
  };

  const activeNode =
    activeId !== null
      ? articlesTree.find((n) => n.category.id === activeId) ?? null
      : null;

  // Default to auto-opening the first item with children so the submenu is
  // never empty when the menu first appears.
  const firstWithChildren = articlesTree.find((n) => n.children.length > 0);

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
        if (activeId === null && firstWithChildren) {
          setActiveId(firstWithChildren.category.id);
        }
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors inline-flex items-center gap-1 ${
          open
            ? "text-emerald-700 bg-emerald-50"
            : "text-gray-700 hover:text-emerald-700 hover:bg-emerald-50"
        }`}
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
        <div className="absolute top-full right-0 pt-3 z-50">
          <div
            className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-[260px_280px]"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            {/* Main list — first in JSX = right column in RTL */}
            <ul className="py-2 bg-white">
              {articlesTree.map((node) => {
                const hasChildren = node.children.length > 0;
                const isActive = activeId === node.category.id;
                return (
                  <li
                    key={node.category.id}
                    onMouseEnter={() => hasChildren && setActiveId(node.category.id)}
                  >
                    <Link
                      href={categoryHref(node.category.slug)}
                      className={`group/item flex items-center justify-between gap-3 px-4 py-3 text-sm transition-colors ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-medium truncate">
                          {node.category.name}
                        </span>
                        <span
                          className={`text-xs tabular-nums shrink-0 px-1.5 py-0.5 rounded ${
                            isActive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {node.category.count}
                        </span>
                      </div>
                      {hasChildren && (
                        <svg
                          className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                            isActive ? "-translate-x-0.5" : ""
                          }`}
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
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Sub panel — second in JSX = left column in RTL, subtle bg to differentiate */}
            <div className="bg-gray-50 border-r border-gray-100">
              {activeNode ? (
                <SubPanel node={activeNode} />
              ) : (
                <EmptySubPanel />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SubPanel({ node }: { node: CategoryNode }) {
  const hasChildren = node.children.length > 0;
  return (
    <div className="h-full flex flex-col py-2">
      {/* Header */}
      <div className="px-4 pt-2 pb-3 border-b border-gray-100">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
          القسم
        </p>
        <Link
          href={categoryHref(node.category.slug)}
          className="group/head flex items-center justify-between gap-2 text-sm font-bold text-gray-900 hover:text-emerald-700 transition-colors"
        >
          <span>{node.category.name}</span>
          <span className="text-xs font-normal text-emerald-600 opacity-0 group-hover/head:opacity-100 transition-opacity">
            عرض الكل ←
          </span>
        </Link>
      </div>

      {/* Children */}
      {hasChildren ? (
        <ul className="flex-1 py-2">
          {node.children.map((child) => (
            <li key={child.category.id}>
              <Link
                href={categoryHref(child.category.slug)}
                className="group/sub flex items-center justify-between gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-white hover:text-emerald-700 transition-colors"
              >
                <span className="truncate">{child.category.name}</span>
                <span className="text-[11px] tabular-nums text-gray-400 group-hover/sub:text-emerald-600 shrink-0">
                  {child.category.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div>
            <p className="text-sm text-gray-500 mb-3">
              استعرض جميع المقالات في هذا القسم
            </p>
            <Link
              href={categoryHref(node.category.slug)}
              className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              {node.category.count} مقال
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptySubPanel() {
  return (
    <div className="h-full flex items-center justify-center p-6 text-center">
      <div>
        <svg
          className="w-10 h-10 text-gray-300 mx-auto mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
          />
        </svg>
        <p className="text-xs text-gray-400">
          مرّر فوق قسم لعرض تصنيفاته
        </p>
      </div>
    </div>
  );
}
