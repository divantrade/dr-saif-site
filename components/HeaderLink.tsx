"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderLinkProps {
  href: string;
  label: string;
  /** Also treat sub-paths as active (e.g. `/axis` active for `/axis/foo`). */
  matchDescendants?: boolean;
}

/**
 * Top-level header link with active-state indicator: a 2px bottom border
 * in the brand green, matching the spec. Extracted so Header.tsx can stay
 * a server component while still highlighting the current route.
 */
export default function HeaderLink({
  href,
  label,
  matchDescendants = false,
}: HeaderLinkProps) {
  const pathname = usePathname() || "/";
  const active =
    href === "/"
      ? pathname === "/"
      : matchDescendants
        ? pathname === href || pathname.startsWith(`${href}/`)
        : pathname === href;

  return (
    <Link
      href={href}
      className={`relative px-3 py-5 text-[0.9rem] font-medium transition-colors ${
        active
          ? "text-emerald-700"
          : "text-gray-700 hover:text-emerald-700"
      }`}
    >
      {label}
      <span
        aria-hidden
        className={`absolute right-3 left-3 bottom-0 h-[2px] bg-emerald-600 transition-opacity ${
          active ? "opacity-100" : "opacity-0"
        }`}
      />
    </Link>
  );
}
