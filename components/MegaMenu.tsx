"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import type { CategoryNode } from "@/lib/types";
import { categoryHref } from "@/lib/types";

interface MegaMenuProps {
  articlesTree: CategoryNode[];
}

/**
 * Dynamic mega menu:
 * - Hover "المقالات" → only the main list shows.
 * - Hover an item with children → submenu slides in from the left.
 * - Hover an item without children → submenu slides back out.
 * - Move mouse away from the whole panel → menu closes entirely.
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

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
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
            className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden flex"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            {/* Main list — always visible when the menu is open */}
            <ul
              className="w-[260px] py-2 shrink-0"
              // Clear the sub-panel when hovering the surrounding padding/gaps.
              onMouseEnter={() => {
                /* no-op; handled per-item */
              }}
            >
              {articlesTree.map((node) => {
                const hasChildren = node.children.length > 0;
                const isActive = activeId === node.category.id;
                return (
                  <li
                    key={node.category.id}
                    onMouseEnter={() =>
                      setActiveId(hasChildren ? node.category.id : null)
                    }
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

            {/* Sub panel — only mounted when a parent with children is focused */}
            {activeNode && (
              <div
                key={activeNode.category.id}
                className="w-[280px] bg-gray-50 border-r border-gray-100 shrink-0 animate-[megaSlide_180ms_ease-out]"
              >
                <SubPanel node={activeNode} />
              </div>
            )}
          </div>

          {/* Tiny keyframe, scoped to this component */}
          <style>{`
            @keyframes megaSlide {
              from { opacity: 0; transform: translateX(-8px); }
              to   { opacity: 1; transform: translateX(0); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

function SubPanel({ node }: { node: CategoryNode }) {
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
    </div>
  );
}
